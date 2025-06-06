/* eslint-disable prettier/prettier */
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { users } from '@prisma/client';
import { Auth } from 'src/common/auth.decorator';
import { WebResponse } from 'src/common/dto/web.dto';
import { ListTicketRequest, TicketResponse } from './ticket.dto';
import { TicketService } from './ticket.service';

@Controller('api/tickets')
export class TicketController {
  constructor(private ticketService: TicketService) { }

  // Ticket
  @Get()
  @HttpCode(HttpStatus.OK)
  async listUser(
    @Auth() _: users,
    @Query() request: ListTicketRequest,
  ): Promise<WebResponse<TicketResponse[]>> {
    const result = await this.ticketService.listTicket(request);
    return result;
  }
}
