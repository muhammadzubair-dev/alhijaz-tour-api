/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { ListBankRequest, ListSosmedRequest, BankResponse, SosmedResponse, RegisterBankRequest, RegisterSosmedRequest, PackageTypeResponse } from "src/common/dto/master.dto";
import { WebResponse } from "src/common/dto/web.dto";
import { MasterService } from "./master.service";
import { Auth } from "src/common/auth.decorator";
import { users } from "@prisma/client";

@Controller('/api/master')
export class MasterController {
  constructor(private masterService: MasterService) { }

  // BANK
  @Post('bank')
  @HttpCode(HttpStatus.CREATED)
  async registerBank(
    @Body() request: RegisterBankRequest,
  ): Promise<WebResponse<BankResponse>> {
    const result = await this.masterService.registerBank(request);
    return {
      data: result,
    };
  }

  @Patch('bank/:id')
  @HttpCode(HttpStatus.OK)
  async updateBank(
    @Param('id') id: number,
    @Body() request: Partial<RegisterBankRequest>,
  ): Promise<WebResponse<BankResponse>> {
    const result = await this.masterService.updateBank(id, request);
    return {
      data: result,
    };
  }

  @Get('banks')
  @HttpCode(HttpStatus.OK)
  async listBanks(
    @Query() request: ListBankRequest,
  ): Promise<WebResponse<BankResponse[]>> {
    const result = await this.masterService.listBank(request);
    return result;
  }

  @Delete('bank/:id')
  @HttpCode(HttpStatus.OK)
  async deleteBank(@Param('id') id: number): Promise<{ message: string }> {
    return this.masterService.deleteBank(id);
  }

  // SOSMED
  @Post('sosmed')
  @HttpCode(HttpStatus.CREATED)
  async registerSosmed(
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
    @Query() request: ListSosmedRequest,
  ): Promise<WebResponse<SosmedResponse[]>> {
    const result = await this.masterService.listSosmed(request);
    return result;
  }

  @Delete('sosmed/:id')
  @HttpCode(HttpStatus.OK)
  async deleteSosmed(@Param('id') id: number): Promise<{ message: string }> {
    return this.masterService.deleteSosmed(id);
  }
}