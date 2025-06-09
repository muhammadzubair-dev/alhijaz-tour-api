/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { users } from "@prisma/client";
import { Auth } from "src/common/auth.decorator";
import { JamaahResponse, PackageRoomResponse, PackageTypeResponse, RoomTypeResponse } from "src/common/dto/master.dto";
import { WebResponse } from "src/common/dto/web.dto";
import { LovService } from "./lov.service";

@Controller('/api/lov')
export class LovController {
  constructor(private lovService: LovService) { }

  @Get('package-types')
  @HttpCode(HttpStatus.OK)
  async listPackageType(
    @Auth() _: users,
  ): Promise<WebResponse<PackageTypeResponse[]>> {
    const result = await this.lovService.listPackageType();
    return result;
  }

  @Get('room-types')
  @HttpCode(HttpStatus.OK)
  async listRoomType(
    @Auth() _: users,
  ): Promise<WebResponse<RoomTypeResponse[]>> {
    const result = await this.lovService.listRoomType();
    return result;
  }

  @Get('cities')
  @HttpCode(HttpStatus.OK)
  async listCity(
    @Auth() _: users,
  ): Promise<WebResponse<PackageTypeResponse[]>> {
    const result = await this.lovService.listCity();
    return result;
  }

  @Get('package/:packageId/rooms')
  @HttpCode(HttpStatus.OK)
  async listPackageRoom(
    @Auth() _: users,
    @Param('packageId') packageId: number,
  ): Promise<WebResponse<PackageRoomResponse[]>> {
    const result = await this.lovService.listPackageRoom(packageId);
    return result;
  }

  @Get('cities/:cityId/hotels')
  @HttpCode(HttpStatus.OK)
  async listHotel(
    @Auth() _: users,
    @Param('cityId') cityId: number,
  ): Promise<WebResponse<RoomTypeResponse[]>> {
    const result = await this.lovService.listHotel(cityId);
    return result;
  }

  @Get('jamaah')
  @HttpCode(HttpStatus.OK)
  async listJamaah(
    @Auth() _: users,
  ): Promise<WebResponse<JamaahResponse[]>> {
    const result = await this.lovService.listJamaah();
    return result;
  }

  @Get('tickets')
  @HttpCode(HttpStatus.OK)
  async listTicket(
    @Auth() _: users,
  ): Promise<WebResponse<{ bookingCode: string }[]>> {
    const result = await this.lovService.listTicket();
    return result;
  }
}