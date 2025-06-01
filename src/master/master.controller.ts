/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { ListBankRequest, ListSosmedRequest, BankResponse, SosmedResponse, RegisterBankRequest, RegisterSosmedRequest } from "src/common/dto/master.dto";
import { WebResponse } from "src/common/dto/web.dto";
import { MasterService } from "./master.service";

@Controller('/api/master')
export class MasterController {
  constructor(private masterService: MasterService) { }

  // MASTER BANK
  @Post('bank')
  @HttpCode(HttpStatus.CREATED)
  async registermasterBank(
    @Body() request: RegisterBankRequest,
  ): Promise<WebResponse<BankResponse>> {
    const result = await this.masterService.registerMasterBank(request);
    return {
      data: result,
    };
  }

  @Patch('bank/:id')
  @HttpCode(HttpStatus.OK)
  async updateMasterBank(
    @Param('id') id: number,
    @Body() request: Partial<RegisterBankRequest>,
  ): Promise<WebResponse<BankResponse>> {
    const result = await this.masterService.updateMasterBank(id, request);
    return {
      data: result,
    };
  }

  @Get('banks')
  @HttpCode(HttpStatus.OK)
  async listMasterBanks(
    @Query() request: ListBankRequest,
  ): Promise<WebResponse<BankResponse[]>> {
    const result = await this.masterService.listMasterBank(request);
    return result;
  }

  @Delete('bank/:id')
  @HttpCode(HttpStatus.OK)
  async deleteBank(@Param('id') id: number): Promise<{ message: string }> {
    return this.masterService.deleteMasterBank(id);
  }

  // MASTER SOSMED
  @Post('sosmed')
  @HttpCode(HttpStatus.CREATED)
  async registerMasterSosmed(
    @Body() request: RegisterSosmedRequest,
  ): Promise<WebResponse<SosmedResponse>> {
    const result = await this.masterService.registerMasterSosmed(request);
    return {
      data: result,
    };
  }

  @Patch('sosmed/:id')
  @HttpCode(HttpStatus.OK)
  async updateMasterSosmed(
    @Param('id') id: number,
    @Body() request: Partial<RegisterSosmedRequest>,
  ): Promise<WebResponse<SosmedResponse>> {
    const result = await this.masterService.updateMasterSosmed(id, request);
    return {
      data: result,
    };
  }

  @Get('sosmeds')
  @HttpCode(HttpStatus.OK)
  async listMasterSosmed(
    @Query() request: ListSosmedRequest,
  ): Promise<WebResponse<SosmedResponse[]>> {
    const result = await this.masterService.listMasterSosmed(request);
    return result;
  }

  @Delete('sosmed/:id')
  @HttpCode(HttpStatus.OK)
  deleteRole(@Param('id') id: number): Promise<{ message: string }> {
    return this.masterService.deleteMasterSosmed(id);
  }
}