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

  @Get('jamaah/:identityNumber')
  @HttpCode(HttpStatus.OK)
  async getJamaahByIdentityNumber(
    @Auth() _: users,
    @Param('identityNumber') identityNumber: string,
  ): Promise<WebResponse<any>> {
    const result = await this.lovService.getJamaahByIdentityNumber(identityNumber);
    return result;
  }

  @Get('jamaah/umroh/:umrohCode')
  @HttpCode(HttpStatus.OK)
  async listJamaahUmroh(
    @Auth() _: users,
    @Param('umrohCode') umrohCode: string,
  ): Promise<WebResponse<JamaahResponse[]>> {
    const result = await this.lovService.listJamaahUmroh(umrohCode);
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

  @Get('airlines')
  @HttpCode(HttpStatus.OK)
  async listAirline(
    @Auth() _: users,
  ): Promise<WebResponse<{ id: number, name: string }[]>> {
    const result = await this.lovService.listAirline();
    return result;
  }

  @Get('airports')
  @HttpCode(HttpStatus.OK)
  async listAirport(
    @Auth() _: users,
  ): Promise<WebResponse<{ code: string, name: string }[]>> {
    const result = await this.lovService.listAirport();
    return result;
  }

  @Get('partners')
  @HttpCode(HttpStatus.OK)
  async listPartner(
    @Auth() _: users,
  ): Promise<WebResponse<{ id: number, name: string }[]>> {
    const result = await this.lovService.listPartner();
    return result;
  }

  @Get('banks')
  @HttpCode(HttpStatus.OK)
  async listBank(
    @Auth() _: users,
  ): Promise<WebResponse<{ id: number, name: string }[]>> {
    const result = await this.lovService.listBank();
    return result;
  }

  @Get('user-agent')
  @HttpCode(HttpStatus.OK)
  async listUserAgent(
    @Auth() user: users,
  ): Promise<WebResponse<{ id: string, name: string }[]>> {
    const result = await this.lovService.listUserAgent(user);
    return result;
  }

  @Get('agents')
  @HttpCode(HttpStatus.OK)
  async listAgent(
    @Auth() user: users,
  ): Promise<WebResponse<{ id: number, name: string }[]>> {
    const result = await this.lovService.listAgent(user);
    return result;
  }

  @Get('provinces')
  @HttpCode(HttpStatus.OK)
  async listProvince(
    @Auth() _: users,
  ): Promise<WebResponse<{ id: number, name: string }[]>> {
    const result = await this.lovService.listProvince();
    return result;
  }

  @Get('provinces/:provinceId/districts')
  @HttpCode(HttpStatus.OK)
  async listDistrict(
    @Auth() _: users,
    @Param('provinceId') provinceId: string,
  ): Promise<WebResponse<{ id: number; name: string }[]>> {
    return await this.lovService.listDistrict(Number(provinceId));
  }

  @Get('provinces/:provinceId/districts/:districtId/sub-districts')
  @HttpCode(HttpStatus.OK)
  async listSubDistrict(
    @Auth() _: users,
    @Param('provinceId') provinceId: string,
    @Param('districtId') districtId: string,
  ): Promise<WebResponse<{ id: number; name: string }[]>> {
    return await this.lovService.listSubDistrict(
      Number(provinceId),
      Number(districtId),
    );
  }


  @Get(
    'provinces/:provinceId/districts/:districtId/sub-districts/:subDistrictId/neighborhoods',
  )
  @HttpCode(HttpStatus.OK)
  async listNeighborhoods(
    @Auth() _: users,
    @Param('provinceId') provinceId: string,
    @Param('districtId') districtId: string,
    @Param('subDistrictId') subDistrictId: string,
  ): Promise<WebResponse<{ id: number; name: string }[]>> {
    return await this.lovService.listNeighborhoods(
      Number(provinceId),
      Number(districtId),
      Number(subDistrictId),
    );
  }

  @Get('umroh-package')
  @HttpCode(HttpStatus.OK)
  async listUmrohPackage(
    @Auth() _: users,
  ): Promise<WebResponse<{ id: string, name: string }[]>> {
    const result = await this.lovService.listUmrohPackage();
    return result;
  }

  @Get('umroh-package/:packageId/rooms')
  @HttpCode(HttpStatus.OK)
  async listUmrohPackageRooms(
    @Auth() _: users,
    @Param('packageId') packageId: string,
  ): Promise<WebResponse<{ id: number, price: number }[]>> {
    const result = await this.lovService.listUmrohPackageRooms(packageId);
    return result;
  }

  @Get('umroh/:umrohCode')
  @HttpCode(HttpStatus.OK)
  async getUmroh(
    @Auth() _: users,
    @Param('umrohCode') umrohCode: string,
  ): Promise<WebResponse<any>> {
    const result = await this.lovService.getUmroh(umrohCode);
    return result;
  }
}