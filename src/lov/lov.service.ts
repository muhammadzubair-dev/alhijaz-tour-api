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
import * as moment from 'moment';

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

  async listJamaahUmroh(umrohCode: string): Promise<WebResponse<any[]>> {
    const jamaah = await this.prisma.umrah_registers.findMany({
      select: {
        jamaahRel: {
          select: {
            jamaah_code: true,
            first_name: true,
            mid_name: true,
            last_name: true
          }
        }
      },
      where: {
        umroh_code: umrohCode,
        status: '1'
      }
    });
    return {
      data: jamaah.map((item) => ({
        jamaahCode: item.jamaahRel.jamaah_code,
        jamaahName: `${item.jamaahRel.first_name} ${item.jamaahRel.mid_name ?? ''} ${item.jamaahRel.last_name ?? ''}`.trim(),
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

  async listTicket(): Promise<WebResponse<any[]>> {
    const tickets = await this.prisma.tickets.findMany({
      where: { status: '1' },
      select: {
        id: true,
        booking_code: true,
        seat_pack: true,
        ticket_details: {
          select: {
            ticket_date: true,
            flight_no: true,
            ticket_etd: true,
            ticket_eta: true,
            type: true,
            airline: {
              select: {
                id: true,
                name: true,
              },
            },
            airport_from: {
              select: {
                code: true,
                name: true,
              },
            },
            airport_to: {
              select: {
                code: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const usedSeats = await this.prisma.packages.groupBy({
      by: ['ticket'],
      where: {
        ticket: { in: tickets.map((t) => t.id) },
        seat: { not: null },
      },
      _sum: { seat: true },
    });

    const seatMap = Object.fromEntries(
      usedSeats.map((u) => [u.ticket, u._sum.seat || 0])
    );

    const data = tickets.map((t) => {
      const remainingSeat = t.seat_pack - (seatMap[t.id] || 0);

      const sortedDetails = t.ticket_details.sort(
        (a, b) => new Date(a.ticket_date).getTime() - new Date(b.ticket_date).getTime()
      );

      const departureDetail = sortedDetails.find((d) => d.type === 0); // departure
      const returnDetail = sortedDetails.find((d) => d.type === 1); // return

      return {
        id: t.id,
        bookingCode: t.booking_code,
        seatPack: t.seat_pack,
        remainingSeat,
        departureDate: departureDetail?.ticket_date ?? null,
        ticketDetails: sortedDetails.map((d) => ({
          type: d.type,
          flightNo: d.flight_no,
          ticketDate: d.ticket_date,
          ticketAirlineName: d.airline?.name,
          ticketFrom: d.airport_from?.code,
          ticketFromName: d.airport_from?.name,
          ticketEtd: d.ticket_etd,
          ticketTo: d.airport_to?.code,
          ticketToName: d.airport_to?.name,
          ticketEta: d.ticket_eta,
        })),
      };
    });

    return { data };
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

  async listStaff(user: users, staffId: string): Promise<WebResponse<{ id: string, name: string }[]>> {
    const users = await this.prisma.users.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        isDeleted: false,
        isActive: true,
        ...(staffId && {
          id: staffId
        })
      }
    });
    return {
      data: users.map((item) => ({
        id: item.id,
        name: item.name,
      })),
    };
  }

  async listAgent(user: users, agentId: number): Promise<WebResponse<{ id: number, name: string }[]>> {
    const agents = await this.prisma.agents.findMany({
      where: {
        ...(agentId !== undefined && { id: agentId }),
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

  async listRole(userType: string): Promise<WebResponse<{ id: number, name: string }[]>> {
    const agents = await this.prisma.roles.findMany({
      where: {
        isActive: true,
        type: userType
      },
      select: {
        id: true,
        name: true
      }
    });

    return {
      data: agents.map((item) => ({
        id: item.id,
        name: item.name,
      })),
    };
  }

  async listProvince(provinceId: number): Promise<WebResponse<{ id: number, name: string }[]>> {
    const province = await this.prisma.provinces.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        status: '1',
        ...(provinceId && {
          id: provinceId
        })
      }
    });
    return {
      data: province.map((item) => ({
        id: item.id,
        name: item.name,
      })),
    };
  }

  async listDistrict(provinceId: number, districtId: number): Promise<WebResponse<{ id: number, name: string }[]>> {
    const district = await this.prisma.districts.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        status: '1',
        province_id: provinceId,
        ...(districtId && {
          id: districtId
        })
      }
    });
    return {
      data: district.map((item) => ({
        id: item.id,
        name: item.name,
      })),
    };
  }

  async listSubDistrict(provinceId: number, districtId: number, subDistrictId: number): Promise<WebResponse<{ id: number, name: string }[]>> {
    const subDistrict = await this.prisma.sub_districts.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        status: '1',
        province_id: provinceId,
        district_id: districtId,
        ...(subDistrictId && {
          id: subDistrictId
        })
      }
    });
    return {
      data: subDistrict.map((item) => ({
        id: item.id,
        name: item.name,
      })),
    };
  }

  async listNeighborhoods(provinceId: number, districtId: number, subDistrictId: number, neighborhoodId: number): Promise<WebResponse<{ id: number, name: string }[]>> {
    const neighborhood = await this.prisma.neighborhoods.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        status: '1',
        province_id: provinceId,
        district_id: districtId,
        sub_district_id: subDistrictId,
        ...(neighborhoodId && {
          id: neighborhoodId
        })
      }
    });
    return {
      data: neighborhood.map((item) => ({
        id: item.id,
        name: item.name,
      })),
    };
  }

  async listUmrohPackage(packageId: string): Promise<WebResponse<{ id: string, name: string }[]>> {
    const banks = await this.prisma.packages.findMany({
      select: {
        id: true,
        name: true,
        departure_date: true
      },
      where: {
        status: '1',
        ...(packageId && {
          id: packageId
        })
      }
    });
    return {
      data: banks.map((item) => ({
        id: item.id,
        name: `${item.name} / ${moment(item.departure_date).format('YYYY-MM-DD')}`,
      })),
    };
  }

  async listUmrohPackageRooms(packagesId: string, packageRoomId: number): Promise<WebResponse<{ id: number, price: number }[]>> {
    const result = await this.prisma.package_room_prices.findMany({
      where: {
        packages_id: packagesId,
        ...(packageRoomId && {
          id: packageRoomId
        })
      },
      select: {
        id: true,
        price: true,
        package: {
          select: {
            equipment_handling_price: true
          }
        },
        package_room: {
          select: {
            room_type: {
              select: { name: true },
            },
            package_type: {
              select: { name: true },
            },
          },
        },
      },
    });
    return {
      data: result.map((item) => ({
        id: item.id,
        name: `${item.package_room.package_type.name}: ${item.package_room.room_type.name}`,
        price: item.price,
        equipmentHandlingPrice: item.package.equipment_handling_price
      })),
    };
  }

  async getUmroh(umrohCode): Promise<WebResponse<any>> {
    const result = await this.prisma.umrah.findFirst({
      select: {
        umroh_code: true,
        package: true,
      },
      where: {
        umroh_code: umrohCode
      }
    });
    return {
      data: result,
    };
  }

  async listMenu(): Promise<WebResponse<{ id: string, name: string }[]>> {
    const banks = await this.prisma.menus.findMany({
      select: {
        id: true,
        name: true,
        desc: true
      },
    });
    return {
      data: banks.map((item) => ({
        id: item.id,
        name: item.name,
        desc: item.desc
      })),
    };
  }
}
