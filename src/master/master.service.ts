/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { users } from '@prisma/client';
import moment from 'moment';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ListBankRequest, ListSosmedRequest, BankResponse, RegisterBankRequest, RegisterSosmedRequest, PackageTypeResponse, SosmedResponse, RegisterPackageRequest, CreatePackageRequestDto, PackageResponse, ListPackageRequest } from 'src/common/dto/master.dto';
import { WebResponse } from 'src/common/dto/web.dto';
import { PrismaService } from 'src/common/prisma.service';
import { UploadService } from 'src/common/upload.service';
import { camelToSnakeCase } from 'src/common/utils/camelToSnakeCase';
import { generateAutoId } from 'src/common/utils/generateAutoId';
import { Logger } from 'winston';

@Injectable()
export class MasterService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService
  ) { }

  // Bank
  async listBank(
    request: ListBankRequest,
  ): Promise<WebResponse<BankResponse[]>> {
    const {
      bankCode,
      name,
      isActive,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = request;

    const where = Object.fromEntries(
      Object.entries({
        bank_code: bankCode ? { contains: bankCode, mode: 'insensitive' } : undefined,
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      }).filter(([_, value]) => value !== undefined),
    );

    const total = await this.prisma.banks.count({ where });
    const totalPages = Math.ceil(total / limit);

    const banks = await this.prisma.banks.findMany({
      where,
      orderBy: sortBy
        ? {
          [camelToSnakeCase(sortBy, ['isActive'])]: sortOrder ?? 'asc',
        }
        : undefined,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: banks.map((bank) => ({
        id: bank.id,
        bankCode: bank.bank_code,
        name: bank.name,
        isActive: bank.isActive,
        createdBy: bank.created_by,
        createdAt: bank.created_at,
        updatedBy: bank.updated_by,
        updatedAt: bank.updated_at,
      })),
      paging: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async registerBank(request: RegisterBankRequest): Promise<BankResponse> {
    this.logger.info(`Registering new bank: ${request.name}`);

    const existingBank = await this.prisma.banks.findFirst({
      where: {
        OR: [
          { name: request.name },
          { bank_code: request.bankCode },
        ],
      },
    });

    if (existingBank) {
      let message = 'Bank sudah terdaftar';
      if (existingBank.name === request.name) {
        message = 'Nama bank sudah terdaftar';
      } else if (existingBank.bank_code === request.bankCode) {
        message = 'Kode bank sudah terdaftar';
      }

      this.logger.warn(`Duplicate bank found: ${message}`);
      throw new BadRequestException(message);
    }

    const bank = await this.prisma.banks.create({
      data: {
        bank_code: request.bankCode,
        name: request.name,
        isActive: request.isActive,
      },
    });

    this.logger.info(`Bank registered: ${bank.name}`);

    return {
      id: bank.id,
      bankCode: bank.bank_code,
      name: bank.name,
      isActive: bank.isActive,
    };
  }

  async updateBank(
    bankId: number,
    payload: Partial<RegisterBankRequest>,
  ): Promise<BankResponse> {
    const existingMaster = await this.prisma.banks.findUnique({
      where: { id: bankId },
    });

    if (!existingMaster) {
      throw new NotFoundException(`Bank with ID ${bankId} not found`);
    }

    // Validasi name atau bankCode yang ingin diubah
    if (
      (payload.name && payload.name !== existingMaster.name) ||
      (payload.bankCode && payload.bankCode !== existingMaster.bank_code)
    ) {
      const conflictBank = await this.prisma.banks.findFirst({
        where: {
          AND: [
            {
              OR: [
                { name: payload.name },
                { bank_code: payload.bankCode },
              ],
            },
            {
              NOT: { id: bankId }, // pastikan bukan dirinya sendiri
            },
          ],
        },
      });

      if (conflictBank) {
        const nameConflict = conflictBank.name === payload.name;
        const codeConflict = conflictBank.bank_code === payload.bankCode;
        let message = 'Bank data already in use by another master.';
        if (nameConflict && codeConflict) {
          message = 'Nama Bank dan Kode Bank sudah dipakai oleh master lain.';
        } else if (nameConflict) {
          message = 'Nama Bank sudah dipakai oleh master lain.';
        } else if (codeConflict) {
          message = 'Kode Bank sudah dipakai oleh master lain.';
        }
        throw new BadRequestException(message);
      }
    }

    // Cek apakah payload berbeda dengan data existing
    const isSameData =
      (payload.name ?? existingMaster.name) === existingMaster.name &&
      (payload.bankCode ?? existingMaster.bank_code) === existingMaster.bank_code &&
      (payload.isActive ?? existingMaster.isActive) === existingMaster.isActive;

    if (isSameData) {
      if (isSameData) {
        throw new BadRequestException(
          'No changes detected in the update request',
        );
      }
    }

    const updatedBank = await this.prisma.banks.update({
      where: { id: bankId },
      data: {
        name: payload.name ?? existingMaster.name,
        bank_code: payload.bankCode ?? existingMaster.bank_code,
        isActive: payload.isActive ?? existingMaster.isActive,
      },
    });

    return {
      id: bankId,
      name: updatedBank.name,
      bankCode: updatedBank.bank_code,
      isActive: updatedBank.isActive,
    };
  }

  async deleteBank(id: number): Promise<{ message: string }> {
    const existingBank = await this.prisma.banks.findUnique({
      where: { id },
    });

    if (!existingBank) {
      throw new NotFoundException(`Bank with ID ${id} not found`);
    }

    await this.prisma.banks.delete({
      where: { id },
    });

    return { message: `Bank with ID ${id} deleted successfully.` };
  }

  // Sosmed
  async listSosmed(
    request: ListSosmedRequest,
  ): Promise<WebResponse<SosmedResponse[]>> {
    const {
      name,
      isActive,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = request;

    const where = Object.fromEntries(
      Object.entries({
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      }).filter(([_, value]) => value !== undefined),
    );

    const total = await this.prisma.social_media.count({ where });
    const totalPages = Math.ceil(total / limit);

    const sosmeds = await this.prisma.social_media.findMany({
      where,
      orderBy: sortBy
        ? {
          [camelToSnakeCase(sortBy, ['isActive'])]: sortOrder ?? 'asc',
        }
        : undefined,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: sosmeds.map((sosmed) => ({
        id: sosmed.id,
        name: sosmed.name,
        isActive: sosmed.isActive,
        createdBy: sosmed.created_by,
        createdAt: sosmed.created_at,
        updatedBy: sosmed.updated_by,
        updatedAt: sosmed.updated_at,
      })),
      paging: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async registerSosmed(request: RegisterSosmedRequest): Promise<SosmedResponse> {
    this.logger.info(`Registering new sosmed: ${request.name}`);

    const existingSosmed = await this.prisma.social_media.findFirst({
      where: { name: request.name },
    });

    if (existingSosmed) {
      this.logger.warn(`Sosmed already exists: ${request.name}`);
      throw new BadRequestException('Sosmed name already exists');
    }

    const sosmed = await this.prisma.social_media.create({
      data: {
        name: request.name,
        isActive: request.isActive,
      },
    });

    this.logger.info(`Sosmed registered: ${sosmed.name}`);

    return {
      id: sosmed.id,
      name: sosmed.name,
      isActive: sosmed.isActive,
    };
  }

  async updateSosmed(
    sosmedId: number,
    payload: Partial<RegisterSosmedRequest>,
  ): Promise<SosmedResponse> {
    const existingMaster = await this.prisma.social_media.findUnique({
      where: { id: sosmedId },
    });

    if (!existingMaster) {
      throw new NotFoundException(`Sosmed with ID ${sosmedId} not found`);
    }

    // Validasi name yang ingin diubah
    if (payload.name && payload.name !== existingMaster.name) {
      const sosmedTaken = await this.prisma.social_media.findFirst({
        where: {
          name: payload.name,
          NOT: { id: sosmedId },
        },
      });

      if (sosmedTaken) {
        throw new BadRequestException(
          'Sosmed already in use by another user',
        );
      }
    }

    // Cek apakah payload berbeda dengan data existing
    const isSameData =
      (payload.name ?? existingMaster.name) === existingMaster.name &&
      (payload.isActive ?? existingMaster.isActive) === existingMaster.isActive;

    if (isSameData) {
      throw new BadRequestException(
        'No changes detected in the update request',
      );
    }


    const updatedSosmed = await this.prisma.social_media.update({
      where: { id: sosmedId },
      data: {
        name: payload.name ?? existingMaster.name,
        isActive: payload.isActive ?? existingMaster.isActive,
      },
    });

    return {
      id: sosmedId,
      name: updatedSosmed.name,
      isActive: updatedSosmed.isActive,
    };
  }

  async deleteSosmed(id: number): Promise<{ message: string }> {
    const existingSosmed = await this.prisma.social_media.findUnique({
      where: { id },
    });

    if (!existingSosmed) {
      throw new NotFoundException(`Sosmed with ID ${id} not found`);
    }

    await this.prisma.social_media.delete({
      where: { id },
    });

    return { message: `Sosmed with ID ${id} deleted successfully.` };
  }

  // Paket
  async registerPackage(
    authUser: users,
    data: CreatePackageRequestDto,
    files: {
      itinerary?: Express.Multer.File[];
      manasikInvitation?: Express.Multer.File[];
      brochure?: Express.Multer.File[];
      departureInfo?: Express.Multer.File[];
    },
  ) {
    const uploadedFiles: Record<string, string> = {};
    const rollbackFiles: string[] = [];

    const saveFile = async (file: Express.Multer.File, type: string) => {
      const path = await this.uploadService.saveFile(file.buffer, file.originalname);
      uploadedFiles[type] = path;
      rollbackFiles.push(path);
    };

    try {
      // Upload semua file yang ada
      if (files.itinerary?.[0]) await saveFile(files.itinerary[0], 'itinerary');
      if (files.manasikInvitation?.[0]) await saveFile(files.manasikInvitation[0], 'manasikInvitation');
      if (files.brochure?.[0]) await saveFile(files.brochure[0], 'brochure');
      if (files.departureInfo?.[0]) await saveFile(files.departureInfo[0], 'departureInfo');

      // Jalankan transaksi Prisma
      const result = await this.prisma.$transaction(async (tx) => {
        // Generate ID
        const newId = await generateAutoId(this.prisma, {
          model: 'packages',
          prefix: 'JBU',
          padding: 4,
        });
        // Insert ke tabel `packages`
        const createdPackage = await tx.packages.create({
          data: {
            id: newId,
            name: data.name,
            itinerary: uploadedFiles['itinerary'] ?? null,
            manasik_invitation: uploadedFiles['manasikInvitation'] ?? null,
            brochure: uploadedFiles['brochure'] ?? null,
            departure_info: uploadedFiles['departureInfo'] ?? null,
            ticket: data.ticket,
            seat: data.seat,
            maturity_passport_delivery: new Date(data.maturityPassportDelivery),
            maturity_repayment: new Date(data.maturityRepayment),
            manasik_date: new Date(data.manasikDatetime),
            manasik_time: new Date(data.manasikDatetime),
            manasik_price: data.manasikPrice,
            admin_price: data.adminPrice,
            equipment_handling_price: data.equipmentHandlingPrice,
            pcr_price: data.pcrPrice,
            airport_rally_point: data.airportRallyPoint,
            gathering_time: new Date(data.gatheringTime),
            tour_lead: data.tourLead,
            checkin_madinah: new Date(data.checkInMadinah),
            checkout_madinah: new Date(data.checkOutMadinah),
            checkin_mekkah: new Date(data.checkInMekkah),
            checkout_mekkah: new Date(data.checkOutMekkah),
            isPromo: data.isPromo === 'true',
            wa_group: data.waGroup,
            notes: data.notes,
            status: data.status,
            created_by: authUser.id,
            updated_by: null,
            updated_at: null,
          },
        });

        // Build data package_room_prices
        const roomPrices = [];
        const hotelData = [];

        for (const pkg of data.hotelRooms) {
          for (const room of pkg.rooms) {
            roomPrices.push({
              packages_id: createdPackage.id,
              package_rooms_id: room.roomId,
              price: room.roomPrice,
              created_by: authUser.id,
              updated_by: authUser.id,
            });
          }

          for (const hotel of pkg.hotels) {
            hotelData.push({
              package_id: createdPackage.id,
              package_type_id: pkg.packageTypeId,
              city_id: hotel.cityId,
              hotel_id: parseInt(hotel.hotelId),
              created_by: authUser.id,
              updated_by: authUser.id,
            });
          }
        }

        if (roomPrices.length > 0) {
          await tx.package_room_prices.createMany({ data: roomPrices });
        }

        if (hotelData.length > 0) {
          await tx.package_hotels.createMany({ data: hotelData });
        }

        return createdPackage;
      });

      return { message: `Package registered: ${result.id}` };

    } catch (error) {
      // Rollback: hapus file yang sudah diupload
      for (const filePath of rollbackFiles) {
        try {
          await this.uploadService.deleteFile(filePath); // asumsi kamu punya method ini
        } catch (e) {
          console.warn('Gagal hapus file rollback:', filePath);
        }
      }

      throw new Error('Gagal menyimpan paket. Semua perubahan telah di-rollback.');
    }
  }

  async listPackage(
    request: ListPackageRequest,
  ): Promise<WebResponse<PackageResponse[]>> {
    const {
      id,
      name,
      status,
      bookingCode,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = request;

    const where: any = {
      ...(id && { id }),
      ...(name && {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      }),
      ...(status && { status }),
      ...(bookingCode && {
        ticket_rel: {
          is: {
            booking_code: {
              equals: bookingCode,
            },
          },
        },
      }),
    };


    const total = await this.prisma.packages.count({ where });
    const totalPages = Math.ceil(total / limit);

    let orderBy: any = {
      created_at: 'desc', // default jika tidak ada sortBy
    };

    if (sortBy) {
      if (sortBy === 'bookingCode') {
        orderBy = {
          ticket_rel: {
            booking_code: sortOrder ?? 'asc',
          },
        };
      } else if (sortBy === 'createdBy') {
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

    const packages = await this.prisma.packages.findMany({
      where,
      include: {
        tourLeadUser: {
          select: {
            first_name: true,
            mid_name: true,
            last_name: true
          }
        },
        ticket_rel: {
          select: {
            booking_code: true,
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
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: packages.map((item) => ({
        id: item.id,
        name: item.name,
        bookingCode: item.ticket_rel?.booking_code || null,
        tourLead: `${item.tourLeadUser.first_name} ${item.tourLeadUser?.mid_name ?? ''} ${item.tourLeadUser?.last_name ?? ''}`.trim(),
        isPromo: item.isPromo,
        status: item.status,
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



  // Testing Upload
  async uploadAvatar(buffer: Buffer, originalName: string) {
    const uploaded = await this.uploadService.saveFile(buffer, originalName);
    // Contoh: bisa tambahkan logic simpan ke DB juga di sini
    return {
      message: 'Avatar uploaded',
      // ...uploaded,
    };
  }
}
