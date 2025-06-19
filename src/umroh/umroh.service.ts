/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, users } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CreateUmrohRegisterRequest, ListUmrohRequest } from './umroh.dto';
import { WebResponse } from 'src/common/dto/web.dto';
import { PrismaService } from 'src/common/prisma.service';
import { UploadService } from 'src/common/upload.service';
import { camelToSnakeCase } from 'src/common/utils/camelToSnakeCase';
import { generateAutoId } from 'src/common/utils/generateAutoId';
import snakeToCamelObject from 'src/common/utils/snakeToCamelObject';
import { Logger } from 'winston';
import { SseService } from 'src/sse/sse.service';
import { AuthUser } from 'src/common/auth.middleware';

@Injectable()
export class UmrohService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
    private readonly sseService: SseService
  ) { }

  async createUmroh(
    authUser: AuthUser,
    dto: CreateUmrohRegisterRequest,
    files: {
      photoIdentity?: Express.Multer.File[];
      selfPhoto?: Express.Multer.File[];
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
      if (files.photoIdentity?.[0]) await saveFile(files.photoIdentity[0], 'photoIdentity');
      if (files.selfPhoto?.[0]) await saveFile(files.selfPhoto[0], 'selfPhoto');

      return await this.prisma.$transaction(async (tx) => {
        const existingJamaah = await tx.jamaah.findFirst({
          where: { identity_number: dto.identityNumber },
        });

        if (!existingJamaah) {
          // 🔁 Ambil task_type berdasarkan code
          const taskType = await tx.task_types.findFirst({
            where: {
              code: 'VALIDASI_JAMAAH',
            },
          });

          if (!taskType) throw new Error(`Task type 'VALIDASI_JAMAAH' not found`);

          const roleId = taskType.role_id;

          // 🔁 Ambil user_id yang punya role ini
          const userRoles = await tx.user_roles.findMany({
            where: {
              roles_id: roleId,
              user: {
                isActive: true,
                isDeleted: false,
              },
            },
            select: {
              user_id: true,
            },
          });

          const userIds = userRoles.map((ur) => ur.user_id);
          if (userIds.length === 0) throw new Error(`No users with role_id = ${roleId}`);

          // 🔁 Hitung jumlah task status '0' / '1'
          const tasksPerUser = await tx.tasks.groupBy({
            by: ['to_user_id'],
            where: {
              to_user_id: { in: userIds },
              status: { in: ['0', '1'] },
            },
            _count: { _all: true },
          });

          // Inisialisasi map untuk menyimpan jumlah task per user
          const taskCountMap = new Map<string, number>();

          // Isi awal map dengan 0 untuk setiap user_id
          userIds.forEach((id) => taskCountMap.set(id, 0));

          // Update map dengan jumlah task yang sudah dihitung dari groupBy
          tasksPerUser.forEach(({ to_user_id, _count }) =>
            taskCountMap.set(to_user_id, _count._all)
          );

          // Cari user_id dengan jumlah task paling sedikit
          // reduce akan membandingkan jumlah task antar user dan memilih yang paling sedikit
          const toUserId = [...taskCountMap.entries()].reduce((min, curr) =>
            curr[1] < min[1] ? curr : min
          )[0];

          const notes = `Anda telah menerima tugas dari ${authUser.username} [${authUser.roleNames[0]}] untuk melakukan validasi data jamaah atas nama "${dto.firstName} ${dto.lastName}". Harap segera diproses.`;

          // 🔁 Simpan task
          const task = await tx.tasks.create({
            data: {
              task_type_id: taskType.id,
              title: 'Pendaftaran Umroh Tanpa Data Jamaah',
              data: {
                ...dto,
                photoIdentity: uploadedFiles['photoIdentity'] ?? null,
                selfPhoto: uploadedFiles['selfPhoto'] ?? null,
              },
              notes,
              status: '0',
              from_user_id: authUser.id,
              to_user_id: toUserId,
              is_read: false,
              created_at: new Date(),
              updated_at: new Date(),
            },
          });

          // 🔁 Kirim notif ke user via SSE
          await this.sseService.sendToUser(toUserId, { ...snakeToCamelObject(task), type: taskType.name })

          return {
            data: snakeToCamelObject(task),
            info: 'Data tidak ditemukan, disimpan sebagai task untuk ditindaklanjuti',
          };
        }

        // ✅ Proses normal jika jamaah ditemukan
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
          umrohCode = await generateAutoId(this.prisma, {
            model: 'umrah',
            field: 'umroh_code',
            prefix: 'UMR',
            padding: 6,
          });

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

        const addedUmroh = await tx.umrah_registers.create({
          data: {
            umroh_code: umrohCode,
            jamaah: existingJamaah.jamaah_code,
            remarks: Number(dto.remarks),
            mahram: dto.mahram,
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
            updated_at: null,
          },
        });

        return {
          data: snakeToCamelObject(addedUmroh),
        };
      });
    } catch (error) {
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

  async editPackageUmroh(
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
        id: true,
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
        registerId: item.id,
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

  async editJamaahUmroh(
    authUser: users,
    dto: CreateUmrohRegisterRequest,
    files: {
      photoIdentity?: Express.Multer.File[];
      selfPhoto?: Express.Multer.File[];
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
      // Upload file baru jika ada
      if (files.photoIdentity?.[0]) await saveFile(files.photoIdentity[0], 'photoIdentity');
      if (files.selfPhoto?.[0]) await saveFile(files.selfPhoto[0], 'selfPhoto');

      // Proses transaksi
      return await this.prisma.$transaction(async (tx) => {
        const jamaah = await tx.jamaah.findFirst({
          where: { identity_number: dto.identityNumber },
        });

        if (!jamaah) {
          throw new NotFoundException('Jamaah dengan NIK tersebut tidak ditemukan');
        }

        // Simpan path file lama
        const oldPhotoIdentity = jamaah.photo_identity;
        const oldSelfPhoto = jamaah.self_photo;

        // Update data jamaah
        await tx.jamaah.update({
          where: { jamaah_code: jamaah.jamaah_code },
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
            photo_identity: uploadedFiles['photoIdentity'] ?? oldPhotoIdentity,
            self_photo: uploadedFiles['selfPhoto'] ?? oldSelfPhoto,
            medical_condition: dto.medicalCondition,
            notes: dto.notes,
            updated_by: authUser.id,
            updated_at: new Date(),
          },
        });

        // Update umrah_registers
        const updatedUmroh = await tx.umrah_registers.update({
          where: { id: dto.id },
          data: {
            remarks: Number(dto.remarks),
            mahram: dto.mahram,
            package_room_price: dto.packageRoomPrice,
            office_discount: dto.officeDiscount ?? 0,
            agent_discount: dto.agentDiscount ?? 0,
            other_expenses: dto.otherExpenses ?? 0,
            agent_id: dto.agentId,
            register_name: dto.registerName,
            register_phone: dto.registerPhone,
            notes: dto.notes,
            updated_by: authUser.id,
            updated_at: new Date(),
          },
        });

        // Hapus file lama jika diganti
        if (uploadedFiles['photoIdentity'] && oldPhotoIdentity) {
          await this.uploadService.deleteFile(oldPhotoIdentity);
        }

        if (uploadedFiles['selfPhoto'] && oldSelfPhoto) {
          await this.uploadService.deleteFile(oldSelfPhoto);
        }

        return {
          data: snakeToCamelObject(updatedUmroh),
        };
      });
    } catch (error) {
      // Rollback file yang sudah terupload jika transaksi gagal
      for (const path of rollbackFiles) {
        await this.uploadService.deleteFile(path);
      }
      throw error;
    }
  }

  async detailJamaahUmroh(registerId: string): Promise<any> {
    const umrohRegister = await this.prisma.umrah_registers.findUnique({
      where: { id: registerId },
      include: {
        jamaahRel: true,
        packageRoomPrice: {
          select: {
            packages_id: true
          }
        },
      },
    });

    if (!umrohRegister) {
      throw new NotFoundException('Data pendaftaran umroh tidak ditemukan');
    }

    const jamaah = umrohRegister.jamaahRel;

    if (!jamaah) {
      throw new NotFoundException('Data jamaah tidak ditemukan');
    }
    const baseImage = 'http://localhost:3000/uploads/'
    return {
      registerId: umrohRegister.id,
      umrohCode: umrohRegister.umroh_code,
      remarks: String(umrohRegister.remarks),
      mahram: umrohRegister.mahram,
      packageId: umrohRegister.packageRoomPrice.packages_id,
      packageRoomPrice: umrohRegister.package_room_price,
      officeDiscount: umrohRegister.office_discount,
      agentDiscount: umrohRegister.agent_discount,
      otherExpenses: umrohRegister.other_expenses,
      agentId: umrohRegister.agent_id,
      registerName: umrohRegister.register_name,
      registerPhone: umrohRegister.register_phone,
      notes: umrohRegister.notes,
      identityNumber: jamaah.identity_number,
      firstName: jamaah.first_name,
      middleName: jamaah.mid_name,
      lastName: jamaah.last_name,
      birthPlace: jamaah.birth_place,
      birthDate: jamaah.birth_date,
      gender: String(jamaah.gender),
      marriedStatus: String(jamaah.married_status),
      phoneNumber: jamaah.phone_number,
      province: jamaah.province,
      district: jamaah.district,
      subDistrict: jamaah.sub_district,
      neighborhoods: jamaah.neighborhoods,
      address: jamaah.address,
      staffId: jamaah.staff_id,
      medicalCondition: jamaah.medical_condition,
      photoIdentity: baseImage + jamaah.photo_identity,
      selfPhoto: baseImage + jamaah.self_photo,
    };
  }

  async deleteJamaahUmroh(authUser: users, registerId: string) {
    // Cek apakah data umroh_register ada
    const existingRegister = await this.prisma.umrah_registers.findUnique({
      where: { id: registerId },
    });

    if (!existingRegister) {
      throw new NotFoundException('Data pendaftaran umroh tidak ditemukan');
    }

    // Jalankan soft delete atau hard delete sesuai kebutuhan
    await this.prisma.umrah_registers.delete({
      where: { id: registerId },
    });

    // Log atau audit trail jika dibutuhkan
    this.logger.info(
      `Data umroh_register dengan ID ${registerId} telah dihapus oleh user ${authUser.username}`,
    );

    return {
      registerId,
      message: 'Data pendaftaran umroh berhasil dihapus',
    };
  }
}
