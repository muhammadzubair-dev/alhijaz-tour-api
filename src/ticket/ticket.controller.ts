/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { users } from '@prisma/client';
import { Auth } from 'src/common/auth.decorator';
import { WebResponse } from 'src/common/dto/web.dto';
import { CreateTicketDto, ListTicketRequest, TicketResponse } from './ticket.dto';
import { TicketService } from './ticket.service';

@Controller('api/tickets')
export class TicketController {
  constructor(private ticketService: TicketService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  async listUser(
    @Auth() _: users,
    @Query() request: ListTicketRequest,
  ): Promise<WebResponse<TicketResponse[]>> {
    const result = await this.ticketService.listTicket(request);
    return result;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async ticketDetail(
    @Auth() _: users,
    @Param('id') id: number
  ): Promise<WebResponse<TicketResponse>> {
    const result = await this.ticketService.ticketDetail(id);
    return { data: result };
  }

  @Put(':id')
  async updateTicket(
    @Param('id') id: number,
    @Auth() user: users,
    @Body() body: CreateTicketDto,
  ) {
    const result = await this.ticketService.updateTicket(id, user, body);
    return result;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async registerTicket(
    @Auth() user: users,
    @Body() request: CreateTicketDto,
  ): Promise<WebResponse<{ message: string }>> {
    const result = await this.ticketService.registerTicket(user, request);
    return {
      data: result,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteTicket(
    @Auth() _: users,
    @Param('id') id: number
  ) {
    const result = await this.ticketService.deleteTicket(id);
    return result;
  }
}
