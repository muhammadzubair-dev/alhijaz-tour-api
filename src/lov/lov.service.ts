/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { users } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CityResponse, HotelResponse, JamaahResponse, PackageRoomResponse, PackageTypeResponse, RoomTypeResponse } from 'src/common/dto/master.dto';
import { WebResponse } from 'src/common/dto/web.dto';
import { PrismaService } from 'src/common/prisma.service';
import snakeToCamelObject from 'src/common/utils/snakeToCamelObject';
import { Logger } from 'winston';

@Injectable()
export class LovService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly prisma: PrismaService,
  ) { }

  async listPackageType(): Promise<WebResponse<PackageTypeResponse[]>> {
    const packageTypes = await this.prisma.package_types.findMany();
    return {
      data: packageTypes
    }
  }

  async listCity(): Promise<WebResponse<CityResponse[]>> {
    const cities = await this.prisma.citys.findMany({
      where: {
        status: '1'
      }
    });
    return {
      data: cities
    }
  }

  async listRoomType(): Promise<WebResponse<RoomTypeResponse[]>> {
    const rooms = await this.prisma.room_types.findMany();
    return {
      data: rooms
    }
  }

  async listPackageRoom(packageId: number): Promise<WebResponse<PackageRoomResponse[]>> {
    const rooms = await this.prisma.package_rooms.findMany({
      where: {
        package_type_id: packageId,   // opsional, bisa dihapus kalau mau semua room type
        status: '1',       // status harus '1'
      },
      include: {
        room_type: {
          select: {
            name: true,
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
    });
    return {
      data: rooms.map(room => ({
        id: room.id,
        packageTypeId: room.package_type_id,
        roomTypeId: room.room_type_id,
        status: room.status,
        name: room.room_type?.name ?? null, // fix: akses nama dari relasi
        createdBy: room.createdByUser?.name ?? null,
        createdAt: room.created_at,
        updatedBy: room.updatedByUser?.name ?? null,
        updatedAt: room.updated_at,
      })),
    };
  }

  async listHotel(cityId: number): Promise<WebResponse<HotelResponse[]>> {
    const hotels = await this.prisma.hotels.findMany({
      where: {
        city_id: cityId,
        status: '1', // optional, jika hanya ingin hotel aktif
      },
      orderBy: {
        name: 'asc',
      },
    });

    return {
      data: hotels,
    };
  }

  async listJamaah(): Promise<WebResponse<JamaahResponse[]>> {
    const jamaah = await this.prisma.jamaah.findMany({
      select: {
        jamaah_code: true,
        first_name: true,
        mid_name: true,
        last_name: true,
      },
      where: {
        status: '1'
      }
    });
    return {
      data: jamaah.map((item) => ({
        jamaahCode: item.jamaah_code,
        jamaahName: `${item.first_name} ${item.mid_name ?? ''} ${item.last_name ?? ''}`.trim(),
      })),
    };
  }

  async getJamaahByIdentityNumber(identityNumber: string): Promise<WebResponse<any | null>> {
    const jamaah = await this.prisma.jamaah.findFirst({
      where: {
        identity_number: identityNumber,
        status: '1',
      },
    });

    return {
      data: snakeToCamelObject(jamaah),
    };
  }


  async listTicket(): Promise<WebResponse<{ bookingCode: string }[]>> {
    const jamaah = await this.prisma.tickets.findMany({
      select: {
        id: true,
        booking_code: true,
      },
      where: {
        status: '1'
      }
    });
    return {
      data: jamaah.map((item) => ({
        id: item.id,
        bookingCode: item.booking_code,
      })),
    };
  }

  async listAirport(): Promise<WebResponse<{ code: string, name: string }[]>> {
    const airports = await this.prisma.airport.findMany({
      select: {
        code: true,
        name: true,
      },
      where: {
        status: '1'
      }
    });
    return {
      data: airports.map((item) => ({
        code: item.code,
        name: item.name,
      })),
    };
  }

  async listAirline(): Promise<WebResponse<{ id: number, name: string }[]>> {
    const airports = await this.prisma.airlines.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        status: '1'
      }
    });
    return {
      data: airports.map((item) => ({
        id: item.id,
        name: item.name,
      })),
    };
  }

  async listPartner(): Promise<WebResponse<{ id: number, name: string }[]>> {
    const partners = await this.prisma.partners.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        status: '1'
      }
    });
    return {
      data: partners.map((item) => ({
        id: item.id,
        name: item.name,
      })),
    };
  }

  async listBank(): Promise<WebResponse<{ id: number, name: string }[]>> {
    const banks = await this.prisma.banks.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        isActive: true
      }
    });
    return {
      data: banks.map((item) => ({
        id: item.id,
        name: item.name,
      })),
    };
  }

  async listUserAgent(user: users): Promise<WebResponse<{ id: string, name: string }[]>> {
    const users = await this.prisma.users.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        isDeleted: false,
        isActive: true,
        type: null,
        id: {
          not: user.id
        }
      }
    });
    return {
      data: users.map((item) => ({
        id: item.id,
        name: item.name,
      })),
    };
  }

  async listAgent(user: users): Promise<WebResponse<{ id: number, name: string }[]>> {
    const agents = await this.prisma.agents.findMany({
      where: {
        isDeleted: false,
        isActive: true,
        user_id: {
          not: user.id
        }
      },
      select: {
        id: true,
        user: {
          select: {
            name: true,
          }
        }
      }
    });

    return {
      data: agents.map((item) => ({
        id: item.id,
        name: item.user.name,
      })),
    };
  }

  async listProvince(): Promise<WebResponse<{ id: number, name: string }[]>> {
    const banks = await this.prisma.provinces.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        status: '1'
      }
    });
    return {
      data: banks.map((item) => ({
        id: item.id,
        name: item.name,
      })),
    };
  }

  async listDistrict(provinceId: number): Promise<WebResponse<{ id: number, name: string }[]>> {
    const banks = await this.prisma.districts.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        status: '1',
        province_id: provinceId
      }
    });
    return {
      data: banks.map((item) => ({
        id: item.id,
        name: item.name,
      })),
    };
  }

  async listSubDistrict(provinceId: number, districtId: number): Promise<WebResponse<{ id: number, name: string }[]>> {
    const banks = await this.prisma.sub_districts.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        status: '1',
        province_id: provinceId,
        district_id: districtId
      }
    });
    return {
      data: banks.map((item) => ({
        id: item.id,
        name: item.name,
      })),
    };
  }

  async listNeighborhoods(provinceId: number, districtId: number, subDistrictId: number): Promise<WebResponse<{ id: number, name: string }[]>> {
    const banks = await this.prisma.neighborhoods.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        status: '1',
        province_id: provinceId,
        district_id: districtId,
        sub_district_id: subDistrictId
      }
    });
    return {
      data: banks.map((item) => ({
        id: item.id,
        name: item.name,
      })),
    };
  }
}
