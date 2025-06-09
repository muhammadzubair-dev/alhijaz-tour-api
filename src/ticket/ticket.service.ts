/* eslint-disable prettier/prettier */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { WebResponse } from 'src/common/dto/web.dto';
import { PrismaService } from 'src/common/prisma.service';
import { Logger } from 'winston';
import { CreateTicketDto, ListTicketRequest, TicketResponse } from './ticket.dto';
import { camelToSnakeCase } from 'src/common/utils/camelToSnakeCase';
import { users } from '@prisma/client';

@Injectable()
export class TicketService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly prisma: PrismaService,
  ) { }

  // Ticket
  async registerTicket(authUser: users, request: CreateTicketDto) {
    const {
      transactionDate,
      partnerId,
      bookingCode,
      dayPack,
      seatPack,
      flight,
    } = request;

    return await this.prisma.$transaction(async (tx) => {
      // Insert tiket utama
      const ticket = await tx.tickets.create({
        data: {
          transaction_date: new Date(transactionDate),
          partner_id: partnerId,
          booking_code: bookingCode,
          day_pack: dayPack,
          seat_pack: seatPack,
          materialisasi: 0,
          cancel: 0,
          status: '1',
          created_by: authUser.id,
          updated_by: null,
          updated_at: null,
        },
      });
      // Mapping detail penerbangan
      const detailData = flight.map((item) => ({
        ticket_id: ticket.id,
        type: item.type,
        ticket_date: new Date(item.ticketDate),
        ticket_airline: item.ticketAirline,
        flight_no: item.flightNo,
        ticket_from: item.ticketFrom,
        ticket_etd: item.ticketEtd,
        ticket_to: item.ticketTo,
        ticket_eta: item.ticketEta,
        created_by: authUser.id,
        updated_by: null,
        updated_at: null,
      }));

      // Insert semua detail
      await tx.ticket_details.createMany({
        data: detailData,
      });

      return {
        message: `Ticket registered successfully ${ticket.id}`,
      };
    });
  }

  async updateTicket(
    ticketId: number,
    authUser: users,
    request: CreateTicketDto
  ): Promise<{ message: string }> {
    const {
      transactionDate,
      partnerId,
      bookingCode,
      dayPack,
      seatPack,
      flight,
    } = request;

    return await this.prisma.$transaction(async (tx) => {
      // Validasi bahwa ticket ada
      const existingTicket = await tx.tickets.findUnique({
        where: { id: ticketId },
      });

      if (!existingTicket) {
        throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
      }

      // Update tabel tickets
      await tx.tickets.update({
        where: { id: ticketId },
        data: {
          transaction_date: new Date(transactionDate),
          partner_id: partnerId,
          booking_code: bookingCode,
          day_pack: dayPack,
          seat_pack: seatPack,
          updated_by: authUser.id,
          updated_at: new Date(),
        },
      });

      // Hapus detail lama
      await tx.ticket_details.deleteMany({
        where: { ticket_id: ticketId },
      });

      // Buat ulang detail baru
      const newDetails = flight.map((item) => ({
        ticket_id: ticketId,
        type: item.type,
        ticket_date: new Date(item.ticketDate),
        ticket_airline: item.ticketAirline,
        flight_no: item.flightNo,
        ticket_from: item.ticketFrom,
        ticket_etd: item.ticketEtd,
        ticket_to: item.ticketTo,
        ticket_eta: item.ticketEta,
        created_by: authUser.id,
        updated_by: null,
        updated_at: null,
      }));

      await tx.ticket_details.createMany({
        data: newDetails,
      });

      return {
        message: `Ticket updated successfully (ID: ${ticketId})`,
      };
    });
  }

  async deleteTicket(ticketId: number): Promise<{ message: string }> {
    const ticket = await this.prisma.tickets.findUnique({
      where: { id: ticketId },
      include: { ticket_details: true },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket tidak ditemukan');
    }

    return await this.prisma.$transaction(async (tx) => {
      // Hapus detail penerbangan terlebih dahulu
      await tx.ticket_details.deleteMany({
        where: { ticket_id: ticketId },
      });

      // Hapus tiket utama
      await tx.tickets.delete({
        where: { id: ticketId },
      });

      return {
        message: `Ticket dengan ID ${ticketId} berhasil dihapus.`,
      };
    });
  }

  async ticketDetail(ticketId: number): Promise<TicketResponse> {
    const ticket = await this.prisma.tickets.findUnique({
      where: { id: ticketId },
      include: {
        ticket_details: {
          orderBy: { ticket_date: 'asc' },
          include: {
            airline: {
              select: { name: true },
            },
            airport_from: {
              select: { name: true },
            },
            airport_to: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    const response = {
      id: ticket.id,
      transactionDate: ticket.transaction_date,
      partnerId: ticket.partner_id,
      bookingCode: ticket.booking_code,
      dayPack: ticket.day_pack,
      seatPack: ticket.seat_pack,
      flight: ticket.ticket_details.map((detail) => ({
        id: detail.id,
        type: detail.type,
        ticketDate: detail.ticket_date,
        ticketAirline: detail.ticket_airline,
        flightNo: detail.flight_no,
        ticketFrom: detail.ticket_from,
        ticketEtd: detail.ticket_etd,
        ticketTo: detail.ticket_to,
        ticketEta: detail.ticket_eta,
        ticketAirlineName: detail.airline?.name ?? null,
        ticketFromName: detail.airport_from?.name ?? null,
        ticketToName: detail.airport_to?.name ?? null,
      })),
    };

    return response
  }

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

    let orderBy: any = {
      created_at: 'desc', // default jika tidak ada sortBy
    };

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
        updatedBy: ticket.updatedByUser?.name ?? null,
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
