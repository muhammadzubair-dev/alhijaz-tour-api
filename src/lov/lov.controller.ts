/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { ListBankRequest, ListSosmedRequest, BankResponse, SosmedResponse, RegisterBankRequest, RegisterSosmedRequest, PackageTypeResponse, RoomTypeResponse } from "src/common/dto/master.dto";
import { WebResponse } from "src/common/dto/web.dto";
import { LovService } from "./lov.service";
import { Auth } from "src/common/auth.decorator";
import { users } from "@prisma/client";

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

  @Get('cities/:cityId/hotels')
  @HttpCode(HttpStatus.OK)
  async listHotel(
    @Auth() _: users,
    @Param('cityId') cityId: number,
  ): Promise<WebResponse<RoomTypeResponse[]>> {
    const result = await this.lovService.listHotel(cityId);
    return result;
  }
}