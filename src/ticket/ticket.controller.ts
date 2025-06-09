/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
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
}
