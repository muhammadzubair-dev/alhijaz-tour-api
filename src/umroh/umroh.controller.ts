/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { users } from "@prisma/client";
import { Auth } from "src/common/auth.decorator";
import { WebResponse } from "src/common/dto/web.dto";
import { CreateUmrohRegisterRequest, ListUmrohRequest } from "./umroh.dto";
import { UmrohService } from "./umroh.service";
import { Roles } from "src/common/roles.decorator";
import { MENU_IDS } from "src/common/constants/menu-ids.constant";

@Controller('/api/umroh')
export class UmrohController {
  constructor(private umrohService: UmrohService) { }

  @Post()
  @Roles(MENU_IDS.RegisterUmrahAdd)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photoIdentity', maxCount: 1 },
      { name: 'selfPhoto', maxCount: 1 },
    ]),
  )
  async registerUmroh(
    @Auth() user: users,
    @UploadedFiles()
    files: {
      photoIdentity?: Express.Multer.File[];
      selfPhoto?: Express.Multer.File[];
    },
    @Body() body: CreateUmrohRegisterRequest,
  ) {
    const result = await this.umrohService.createUmroh(user, body, files);
    return result;
  }

  @Get()
  @Roles(MENU_IDS.RegisterUmrahList)
  @HttpCode(HttpStatus.OK)
  async listUmroh(
    @Auth() _: users,
    @Query() request: ListUmrohRequest,
  ): Promise<WebResponse<any[]>> {
    const result = await this.umrohService.listUmroh(request);
    return result;
  }

  @Patch(':umrohCode')
  @Roles(MENU_IDS.RegisterUmrahEdit)
  @HttpCode(HttpStatus.OK)
  async editUmroh(
    @Auth() user: users,
    @Param('umrohCode') umrohCode: string,
    @Body() request: { packageId: string; tourLead: string },
  ): Promise<WebResponse<any>> {
    const result = await this.umrohService.editUmroh(user, umrohCode, request);
    return result
  }

  @Delete(':umrohCode')
  @Roles(MENU_IDS.RegisterUmrahDelete)
  async deleteUmroh(
    @Auth() _: users,
    @Param('umrohCode') umrohCode: string
  ) {
    const result = await this.umrohService.deleteUmroh(umrohCode);
    return {
      data: result
    };
  }

  @Get(':umrohCode/jamaah')
  @Roles(MENU_IDS.RegisterUmrahAddByCode)
  @HttpCode(HttpStatus.OK)
  async listJamaahUmroh(
    @Auth() _: users,
    @Param('umrohCode') umrohCode: string,
    @Query() request: ListUmrohRequest,
  ): Promise<WebResponse<any[]>> {
    const result = await this.umrohService.listJamaahUmroh(umrohCode, request);
    return result;
  }
}