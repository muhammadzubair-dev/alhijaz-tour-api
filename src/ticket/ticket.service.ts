/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { WebResponse } from 'src/common/dto/web.dto';
import { PrismaService } from 'src/common/prisma.service';
import { Logger } from 'winston';
import { ListTicketRequest, TicketResponse } from './ticket.dto';
import { camelToSnakeCase } from 'src/common/utils/camelToSnakeCase';

@Injectable()
export class TicketService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly prisma: PrismaService,
  ) { }

  // Ticket
  async listTicket(
    request: ListTicketRequest,
  ): Promise<WebResponse<TicketResponse[]>> {
    const {
      bookingCode,
      partnerName,
      dayPack,
      seatPack,
      transactionDateStart,
      transactionDateEnd,
      status,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = request;

    const where: any = {
      ...(bookingCode && { booking_code: bookingCode }),
      ...(dayPack && { day_pack: dayPack }),
      ...(seatPack && { seat_pack: seatPack }),
      ...(status && { status }),

      ...(partnerName && {
        partner: {
          name: {
            contains: partnerName,
            mode: 'insensitive',
          },
        },
      }),

      ...(transactionDateStart || transactionDateEnd
        ? {
          transaction_date: {
            ...(transactionDateStart && { gte: transactionDateStart }),
            ...(transactionDateEnd && { lte: transactionDateEnd }),
          },
        }
        : {}),
    };

    const total = await this.prisma.tickets.count({ where });
    const totalPages = Math.ceil(total / limit);

    let orderBy: any = undefined;

    if (sortBy) {
      if (sortBy === 'partnerName') {
        orderBy = {
          partner: {
            name: sortOrder ?? 'asc',
          },
        };
      } else if (sortBy === 'createdBy') {
        orderBy = {
          createdByUser: {
            name: sortOrder ?? 'asc',
          },
        };
      } else if (sortBy === 'updatedBy') {
        orderBy = {
          updatedByUser: {
            name: sortOrder ?? 'asc',
          },
        };
      } else {
        orderBy = {
          [camelToSnakeCase(sortBy)]: sortOrder ?? 'asc',
        };
      }
    }

    const tickets = await this.prisma.tickets.findMany({
      where,
      include: {
        partner: {
          select: {
            id: true,
            name: true,
          },
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
          },
        },
        updatedByUser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: tickets.map((ticket) => ({
        id: ticket.id,
        bookingCode: ticket.booking_code,
        partnerName: ticket.partner.name,
        dayPack: ticket.day_pack,
        seatPack: ticket.seat_pack,
        transactionDate: ticket.transaction_date,
        status: ticket.status,
        createdBy: ticket.createdByUser.name,
        createdAt: ticket.created_at,
        updatedBy: ticket.updatedByUser.name,
        updatedAt: ticket.updated_at,
      })),
      paging: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}
