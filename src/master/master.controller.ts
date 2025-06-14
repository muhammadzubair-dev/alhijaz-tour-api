/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { users } from "@prisma/client";
import { Auth } from "src/common/auth.decorator";
import { AirlineResponse, AirportResponse, BankResponse, CreatePackageRequestDto, ListAirlineRequest, ListAirportRequest, ListBankRequest, ListPackageRequest, ListSosmedRequest, PackageResponse, RegisterAirlineRequest, RegisterAirportRequest, RegisterBankRequest, RegisterSosmedRequest, SosmedResponse } from "src/common/dto/master.dto";
import { WebResponse } from "src/common/dto/web.dto";
import { MasterService } from "./master.service";

@Controller('/api/master')
export class MasterController {
  constructor(private masterService: MasterService) { }

  // bank
  @Post('bank')
  @HttpCode(HttpStatus.CREATED)
  async registerBank(
    @Auth() user: users,
    @Body() request: RegisterBankRequest,
  ): Promise<WebResponse<BankResponse>> {
    const result = await this.masterService.registerBank(user, request);
    return {
      data: result,
    };
  }

  @Patch('bank/:id')
  @HttpCode(HttpStatus.OK)
  async updateBank(
    @Auth() user: users,
    @Param('id') id: number,
    @Body() request: Partial<RegisterBankRequest>,
  ): Promise<WebResponse<BankResponse>> {
    const result = await this.masterService.updateBank(user, id, request);
    return {
      data: result,
    };
  }

  @Get('banks')
  @HttpCode(HttpStatus.OK)
  async listBanks(
    @Auth() _: users,
    @Query() request: ListBankRequest,
  ): Promise<WebResponse<BankResponse[]>> {
    const result = await this.masterService.listBank(request);
    return result;
  }

  @Delete('bank/:id')
  @HttpCode(HttpStatus.OK)
  async deleteBank(
    @Auth() _: users,
    @Param('id') id: number
  ): Promise<{ message: string }> {
    return this.masterService.deleteBank(id);
  }

  // Airport
  @Post('airport')
  @HttpCode(HttpStatus.CREATED)
  async registerAirport(
    @Auth() user: users,
    @Body() request: RegisterAirportRequest,
  ): Promise<WebResponse<AirportResponse>> {
    const result = await this.masterService.registerAirport(user, request);
    return {
      data: result,
    };
  }

  @Patch('airport/:code')
  @HttpCode(HttpStatus.OK)
  async updateRequest(
    @Auth() user: users,
    @Param('code') code: string,
    @Body() request: Partial<RegisterAirportRequest>,
  ): Promise<WebResponse<AirportResponse>> {
    const result = await this.masterService.updateAirport(user, code, request);
    return {
      data: result,
    };
  }

  @Get('airports')
  @HttpCode(HttpStatus.OK)
  async listAirport(
    @Auth() _: users,
    @Query() request: ListAirportRequest,
  ): Promise<WebResponse<AirportResponse[]>> {
    const result = await this.masterService.listAirport(request);
    return result;
  }

  @Delete('airport/:code')
  @HttpCode(HttpStatus.OK)
  async deleteAirport(
    @Auth() _: users,
    @Param('code') code: string
  ): Promise<{ message: string }> {
    return this.masterService.deleteAirport(code);
  }

  // Airline
  @Post('airline')
  @HttpCode(HttpStatus.CREATED)
  async registerAirline(
    @Auth() user: users,
    @Body() request: RegisterAirlineRequest,
  ): Promise<WebResponse<AirlineResponse>> {
    const result = await this.masterService.registerAirline(user, request);
    return {
      data: result,
    };
  }

  @Patch('airline/:id')
  @HttpCode(HttpStatus.OK)
  async updateAirline(
    @Auth() user: users,
    @Param('id') id: number,
    @Body() request: Partial<RegisterAirlineRequest>,
  ): Promise<WebResponse<AirlineResponse>> {
    const result = await this.masterService.updateAirline(user, id, request);
    return {
      data: result,
    };
  }

  @Get('airlines')
  @HttpCode(HttpStatus.OK)
  async listAirline(
    @Auth() _: users,
    @Query() request: ListAirlineRequest,
  ): Promise<WebResponse<AirlineResponse[]>> {
    const result = await this.masterService.listAirline(request);
    return result;
  }

  @Delete('airline/:id')
  @HttpCode(HttpStatus.OK)
  async deleteAirline(
    @Auth() _: users,
    @Param('id') id: number
  ): Promise<{ message: string }> {
    return this.masterService.deleteAirline(id);
  }

  // Sosmed
  @Post('sosmed')
  @HttpCode(HttpStatus.CREATED)
  async registerSosmed(
    @Auth() _: users,
    @Body() request: RegisterSosmedRequest,
  ): Promise<WebResponse<SosmedResponse>> {
    const result = await this.masterService.registerSosmed(request);
    return {
      data: result,
    };
  }

  @Patch('sosmed/:id')
  @HttpCode(HttpStatus.OK)
  async updateSosmed(
    @Auth() _: users,
    @Param('id') id: number,
    @Body() request: Partial<RegisterSosmedRequest>,
  ): Promise<WebResponse<SosmedResponse>> {
    const result = await this.masterService.updateSosmed(id, request);
    return {
      data: result,
    };
  }

  @Get('sosmeds')
  @HttpCode(HttpStatus.OK)
  async listSosmed(
    @Auth() _: users,
    @Query() request: ListSosmedRequest,
  ): Promise<WebResponse<SosmedResponse[]>> {
    const result = await this.masterService.listSosmed(request);
    return result;
  }

  @Delete('sosmed/:id')
  @HttpCode(HttpStatus.OK)
  async deleteSosmed(
    @Auth() _: users,
    @Param('id') id: number
  ): Promise<{ message: string }> {
    return this.masterService.deleteSosmed(id);
  }

  // Package
  @Post('package')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'itinerary', maxCount: 1 },
      { name: 'manasikInvitation', maxCount: 1 },
      { name: 'brochure', maxCount: 1 },
      { name: 'departureInfo', maxCount: 1 },
    ]),
  )
  async registerPackage(
    @Auth() user: users,
    @UploadedFiles()
    files: {
      itinerary?: Express.Multer.File[];
      manasikInvitation?: Express.Multer.File[];
      brochure?: Express.Multer.File[];
      departureInfo?: Express.Multer.File[];
    },
    @Body() body: CreatePackageRequestDto
  ) {
    const result = await this.masterService.registerPackage(user, body, files)
    return result
  }

  @Put('package/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'itinerary', maxCount: 1 },
      { name: 'manasikInvitation', maxCount: 1 },
      { name: 'brochure', maxCount: 1 },
      { name: 'departureInfo', maxCount: 1 },
    ]),
  )
  async updatePackage(
    @Auth() user: users,
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      itinerary?: Express.Multer.File[];
      manasikInvitation?: Express.Multer.File[];
      brochure?: Express.Multer.File[];
      departureInfo?: Express.Multer.File[];
    },
    @Body() body: CreatePackageRequestDto, // atau UpdatePackageRequestDto jika ada
  ) {
    const result = await this.masterService.updatePackage(id, user, body, files);
    return result;
  }

  @Get('packages')
  @HttpCode(HttpStatus.OK)
  async listPackage(
    @Auth() _: users,
    @Query() request: ListPackageRequest,
  ): Promise<WebResponse<PackageResponse[]>> {
    const result = await this.masterService.listPackage(request);
    return result;
  }

  @Get('packages/:packageId')
  @HttpCode(HttpStatus.OK)
  async packageDetail(
    @Auth() _: users,
    @Param('packageId') packageId: string,
  ): Promise<WebResponse<PackageResponse>> {
    const result = await this.masterService.packageDetail(packageId);
    return result;
  }

  @Delete('package/:id')
  async deletePackage(
    @Auth() _: users,
    @Param('id') id: string
  ) {
    const result = await this.masterService.deletePackage(id);
    return result;
  }
}