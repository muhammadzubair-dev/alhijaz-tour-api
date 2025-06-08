/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CityResponse, HotelResponse, PackageTypeResponse, RoomTypeResponse } from 'src/common/dto/master.dto';
import { WebResponse } from 'src/common/dto/web.dto';
import { PrismaService } from 'src/common/prisma.service';
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
    const cities = await this.prisma.citys.findMany();
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
}
