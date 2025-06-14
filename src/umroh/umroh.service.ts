/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { users } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CreateUmrohRegisterRequest, ListUmrohRequest } from './umroh.dto';
import { WebResponse } from 'src/common/dto/web.dto';
import { PrismaService } from 'src/common/prisma.service';
import { UploadService } from 'src/common/upload.service';
import { camelToSnakeCase } from 'src/common/utils/camelToSnakeCase';
import { generateAutoId } from 'src/common/utils/generateAutoId';
import snakeToCamelObject from 'src/common/utils/snakeToCamelObject';
import { Logger } from 'winston';

@Injectable()
export class UmrohService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService
  ) { }

  // Umroh
  async createUmroh(
    authUser: users,
    dto: CreateUmrohRegisterRequest,
    files: {
      photoIdentity?: Express.Multer.File[],
      selfPhoto?: Express.Multer.File[]
    },
  ) {
    const uploadedFiles: Record<string, string> = {};
    const rollbackFiles: string[] = [];

    const saveFile = async (file: Express.Multer.File, key: string) => {
      const path = await this.uploadService.saveFile(file.buffer, file.originalname);
      uploadedFiles[key] = path;
      rollbackFiles.push(path);
    };

    try {
      // ✅ Upload file jika ada
      if (files.photoIdentity?.[0]) await saveFile(files.photoIdentity[0], 'photoIdentity');
      if (files.selfPhoto?.[0]) await saveFile(files.selfPhoto[0], 'selfPhoto');

      // ✅ Jalankan transaksi database
      return await this.prisma.$transaction(async (tx) => {
        // Cek jamaah berdasarkan NIK
        const existingJamaah = await tx.jamaah.findFirst({
          where: { identity_number: dto.identityNumber },
        });

        if (!existingJamaah) {
          throw new NotFoundException('Jamaah dengan NIK tersebut tidak ditemukan');
        }

        // Update data jamaah
        await tx.jamaah.update({
          where: { jamaah_code: existingJamaah.jamaah_code },
          data: {
            first_name: dto.firstName,
            mid_name: dto.middleName,
            last_name: dto.lastName,
            birth_place: dto.birthPlace,
            birth_date: dto.birthDate,
            gender: Number(dto.gender),
            married_status: Number(dto.marriedStatus),
            phone_number: dto.phoneNumber,
            province: dto.province,
            district: dto.district,
            sub_district: dto.subDistrict,
            neighborhoods: dto.neighborhoods,
            address: dto.address,
            agents_id: dto.agentId,
            staff_id: dto.staffId,
            photo_identity: uploadedFiles['photoIdentity'] ?? undefined,
            self_photo: uploadedFiles['selfPhoto'] ?? undefined,
            medical_condition: dto.medicalCondition,
            notes: dto.notes,
            updated_by: authUser.id,
            updated_at: new Date()
          },
        });

        let umrohCode = dto.umrohCode;

        if (!umrohCode) {
          // Buat kode umroh unik
          umrohCode = await generateAutoId(this.prisma, {
            model: 'umrah',
            field: 'umroh_code',
            prefix: 'UMR',
            padding: 6,
          });

          // Insert ke tabel umrah
          await tx.umrah.create({
            data: {
              umroh_code: umrohCode,
              pin: Number(dto.phoneNumber.slice(-5)),
              package: dto.packageId,
              created_by: authUser.id,
              updated_by: null,
              updated_at: null,
            },
          });
        }

        // Insert ke umrah_registers
        const addedUmroh = await tx.umrah_registers.create({
          data: {
            umroh_code: umrohCode,
            jamaah: existingJamaah.jamaah_code,
            remarks: Number(dto.remarks),
            mahram: dto.mahram,
            // package: dto.packageId,
            package_room_price: dto.packageRoomPrice,
            office_discount: dto.officeDiscount ?? 0,
            agent_discount: dto.agentDiscount ?? 0,
            other_expenses: dto.otherExpenses ?? 0,
            agent_id: dto.agentId,
            register_name: dto.registerName,
            register_phone: dto.registerPhone,
            notes: dto.notes,
            status: '1',
            created_by: authUser.id,
            updated_by: null,
            updated_at: null
          },
        });

        return {
          data: snakeToCamelObject(addedUmroh)
        }
      });
    } catch (error) {
      // 🧹 Rollback uploaded files if transaction fails
      for (const filePath of rollbackFiles) {
        await this.uploadService.deleteFile(filePath);
      }
      throw error;
    }
  }

  async listUmroh(
    request: ListUmrohRequest,
  ): Promise<WebResponse<any[]>> {
    const {
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = request;

    const where: any = {
      // ...(name && { name: { contains: name, mode: 'insensitive' } }),
      // ...(status && { status }),
    };

    let orderBy: any = {
      created_at: 'desc', // default jika tidak ada sortBy
    };

    if (sortBy) {
      if (sortBy === 'createdBy') {
        orderBy = {
          createdByUser: {
            name: sortOrder ?? 'asc',
          },
        };
      } else if (sortBy === 'updatedBy') {
        orderBy = {
          updatedByUser: {
            name: sortOrder ?? 'asc',
          },
        };
      } else {
        orderBy = {
          [camelToSnakeCase(sortBy)]: sortOrder ?? 'asc',
        };
      }
    }

    const total = await this.prisma.umrah.count({ where });
    const totalPages = Math.ceil(total / limit);

    const umrah = await this.prisma.umrah.findMany({
      where,
      select: {
        umroh_code: true,
        pin: true,
        packageRel: {
          select: {
            id: true,
            name: true,
            tour_lead: true,
            departure_date: true,
            tourLeadUser: {
              select: {
                first_name: true,
                mid_name: true,
                last_name: true
              }
            }
          }
        },
        _count: {
          select: {
            registers: true,
          },
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
          },
        },
        updatedByUser: {
          select: {
            id: true,
            name: true,
          },
        },
        created_at: true,
        updated_at: true,
      },
      orderBy
    });

    return {
      data: umrah.map((item) => ({
        id: item.umroh_code,
        countRegister: item._count.registers,
        packageId: item.packageRel.id,
        packageName: item.packageRel.name,
        // tourLead: item.packageRel?.tourLeadUser ? `${item.packageRel?.tourLeadUser?.first_name} ${item.packageRel?.tourLeadUser?.mid_name ?? ''} ${item.packageRel?.tourLeadUser?.last_name}` : '-',
        pin: item.pin,
        departureDate: item.packageRel.departure_date,
        // name: item.name,
        // status: item.status,
        createdBy: item.createdByUser?.name || null,
        createdAt: item.created_at,
        updatedBy: item.updatedByUser?.name || null,
        updatedAt: item.updated_at,
      })),
      paging: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async editUmroh(
    authUser: users,
    paramUmrohCode: string,
    body: { packageId: string; tourLead: string }
  ) {
    const { packageId, tourLead } = body;

    // Jalankan transaction
    return await this.prisma.$transaction(async (tx) => {
      // Cek apakah umrah ada
      const umrah = await tx.umrah.findUnique({
        where: { umroh_code: paramUmrohCode },
      });

      if (!umrah) {
        throw new NotFoundException(`Umrah with code ${paramUmrohCode} not found`);
      }

      // Cek apakah package ada
      const pkg = await tx.packages.findUnique({
        where: { id: packageId },
      });

      if (!pkg) {
        throw new NotFoundException(`Package with id ${packageId} not found`);
      }

      // Update umrah
      await tx.umrah.update({
        where: { umroh_code: paramUmrohCode },
        data: {
          package: packageId,
          updated_by: authUser.id,
          updated_at: new Date(),
        },
      });

      // Update package
      await tx.packages.update({
        where: { id: packageId },
        data: {
          tour_lead: tourLead,
          updated_by: authUser.id,
          updated_at: new Date(),
        },
      });

      return {
        data: {
          message: 'Umrah and package updated successfully',
          umrohCode: paramUmrohCode,
        }
      };
    });
  }

  async deleteUmroh(umrohCode: string) {
    return await this.prisma.$transaction(async (tx) => {
      // Pastikan umrah ada
      const umrah = await tx.umrah.findUnique({
        where: { umroh_code: umrohCode },
        include: {
          registers: true,
        },
      });

      if (!umrah) {
        throw new NotFoundException(`Umrah with code ${umrohCode} not found`);
      }

      // Hapus semua umrah_payments yang terkait dengan umrah_registers
      const registerIds = umrah.registers.map((r) => r.id);

      if (registerIds.length > 0) {
        await tx.umrah_payments.deleteMany({
          where: {
            umrah_register_id: { in: registerIds },
          },
        });

        // Hapus semua umrah_registers
        await tx.umrah_registers.deleteMany({
          where: {
            id: { in: registerIds },
          },
        });
      }

      // Hapus umrah itu sendiri
      await tx.umrah.delete({
        where: { umroh_code: umrohCode },
      });

      return {
        message: 'Umrah and its related data successfully deleted',
        umrohCode
      };
    });
  }

  async listJamaahUmroh(
    umrohCode: string,
    request: ListUmrohRequest,
  ): Promise<WebResponse<any[]>> {
    const {
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = request;

    const where: any = {
      umroh_code: umrohCode
      // ...(name && { name: { contains: name, mode: 'insensitive' } }),
      // ...(status && { status }),
    };

    let orderBy: any = {
      created_at: 'desc', // default jika tidak ada sortBy
    };

    if (sortBy) {
      if (sortBy === 'createdBy') {
        orderBy = {
          createdByUser: {
            name: sortOrder ?? 'asc',
          },
        };
      } else if (sortBy === 'updatedBy') {
        orderBy = {
          updatedByUser: {
            name: sortOrder ?? 'asc',
          },
        };
      } else {
        orderBy = {
          [camelToSnakeCase(sortBy)]: sortOrder ?? 'asc',
        };
      }
    }

    const total = await this.prisma.umrah_registers.count({ where });
    const totalPages = Math.ceil(total / limit);

    const umrah = await this.prisma.umrah_registers.findMany({
      where,
      select: {
        register_name: true,
        register_phone: true,
        created_at: true,
        updated_at: true,
        jamaahRel: {
          select: {
            jamaah_code: true,
            first_name: true,
            mid_name: true,
            last_name: true,
          }
        },
        packageRoomPrice: {
          select: {
            package_room: {
              select: {
                package_type: {
                  select: {
                    name: true
                  }
                },
                room_type: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
          },
        },
        updatedByUser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy
    });

    return {
      data: umrah.map((item) => ({
        jamaahName: `${item.jamaahRel.first_name} ${item.jamaahRel.mid_name ?? ''} ${item.jamaahRel.last_name}`,
        typePackage: item.packageRoomPrice.package_room.package_type.name,
        roomPackage: item.packageRoomPrice.package_room.room_type.name,
        registerName: item.register_name,
        registerPhone: item.register_phone,
        createdBy: item.createdByUser?.name || null,
        createdAt: item.created_at,
        updatedBy: item.updatedByUser?.name || null,
        updatedAt: item.updated_at,
      })),
      paging: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}
