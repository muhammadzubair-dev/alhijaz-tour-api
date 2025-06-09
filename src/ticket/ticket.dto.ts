import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class RegisterTicketRequest {
  @IsString()
  @Length(3, 10)
  @ApiProperty({
    description: 'Kode Booking',
    example: 'GH87213',
    minLength: 3,
    maxLength: 10,
  })
  bookingCode: string;

  @IsNumber()
  @ApiProperty({
    description: 'ID partner / supplier',
    example: 27,
  })
  partnerId: number;

  @IsNumber()
  @ApiProperty({
    description: 'Jumlah hari dalam tiket',
    example: 40,
  })
  dayPack: number;

  @IsNumber()
  @ApiProperty({
    description: 'Jumlah seat / tempat duduk',
    example: 200,
  })
  seatPack: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Jumlah kursi yang free / bebas biaya',
    example: 20,
  })
  materialisasi: number;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'Tanggal transaksi',
    example: '2020-12-30',
  })
  transactionDate: Date;

  @IsIn(['0', '1'])
  @ApiProperty({
    description: 'Status: 0 = Tidak Aktif, 1 = Aktif',
    example: 1,
    enum: ['0', '1'],
  })
  status: string;
}

export class ListTicketRequest {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter booking_code (like)' })
  bookingCode?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter partners.name (like)' })
  partnerName?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: 'Filter day_pack (equal)' })
  dayPack?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: 'Filter seat_pack (equal)' })
  seatPack?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'status: 1 = aktif, 0 = tidak aktif' })
  status?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({
    description: 'Tanggal transaksi mulai',
    example: '2024-01-01',
  })
  transactionDateStart?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({
    description: 'Tanggal transaksi sampai',
    example: '2024-12-31',
  })
  transactionDateEnd?: Date;

  @IsOptional()
  @IsIn([
    'bookingCode',
    'partnerName',
    'dayPack',
    'seatPack',
    'transactionDate',
    'status',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
  ])
  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: [
      'bookingCode',
      'partnerName',
      'dayPack',
      'seatPack',
      'transactionDate',
      'status',
      'createdBy',
      'createdAt',
      'updatedBy',
      'updatedAt',
    ],
  })
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  @ApiPropertyOptional({ description: 'Sort direction', enum: ['asc', 'desc'] })
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({ default: 1, description: 'Halaman ke-' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({ default: 10, description: 'Jumlah data per halaman' })
  limit?: number;
}

export class TicketResponse {
  @ApiProperty({
    example: '21',
  })
  id: number;

  @ApiProperty({
    example: 'GH345672',
  })
  bookingCode?: string;

  @ApiPropertyOptional({
    example: 'Joe Dhoe',
  })
  partnerName?: string;

  @ApiProperty({
    example: '40',
  })
  dayPack: number;

  @ApiProperty({
    example: '1000',
  })
  seatPack: number;

  @ApiProperty({
    example: '2020-12-30',
  })
  transactionDate: Date;

  @ApiPropertyOptional({
    example: '1',
  })
  status?: string;
}

export class CreateTicketDetailDto {
  @ApiProperty({
    example: '2025-06-09',
    description: 'Tanggal penerbangan (YYYY-MM-DD)',
  })
  @IsDateString()
  ticketDate: string;

  @ApiProperty({
    example: 3,
    description: 'ID maskapai penerbangan (relasi ke airlines)',
  })
  @IsInt()
  ticketAirline: number;

  @ApiProperty({ example: 'SD-5678', description: 'Nomor penerbangan' })
  @IsString()
  @Length(1, 20)
  flightNo: string;

  @ApiProperty({
    example: 'SUB',
    description: 'Kode bandara asal (max 5 huruf)',
  })
  @IsString()
  @Length(3, 5)
  ticketFrom: string;

  @ApiProperty({
    example: '12:18',
    description: 'ETD (Estimated Time of Departure) dalam format HH:mm',
  })
  @IsString()
  @Length(4, 5)
  ticketEtd: string;

  @ApiProperty({
    example: 'MED',
    description: 'Kode bandara tujuan (max 5 huruf)',
  })
  @IsString()
  @Length(3, 5)
  ticketTo: string;

  @ApiProperty({
    example: '12:18',
    description: 'ETA (Estimated Time of Arrival) dalam format HH:mm',
  })
  @IsString()
  @Length(4, 5)
  ticketEta: string;

  @ApiProperty({
    example: 0,
    description: 'Jenis penerbangan: 0 = Departure, 1 = Return',
  })
  @IsInt()
  type: number;
}

export class CreateTicketDto {
  @ApiProperty({
    example: '2025-06-09T05:26:47.900Z',
    description: 'Tanggal transaksi tiket (ISO format)',
  })
  @IsDateString()
  transactionDate: string;

  @ApiProperty({ example: 1, description: 'ID mitra (partner)' })
  @IsInt()
  partnerId: number;

  @ApiProperty({
    example: 'GH1234567',
    description: 'Kode booking unik (maksimal 10 karakter)',
  })
  @IsString()
  @Length(3, 10)
  bookingCode: string;

  @ApiProperty({ example: 100, description: 'Jumlah hari dalam paket' })
  @IsInt()
  dayPack: number;

  @ApiProperty({ example: 200, description: 'Jumlah kursi dalam paket' })
  @IsInt()
  seatPack: number;

  @ApiProperty({
    description: 'Daftar penerbangan (departure & return)',
    type: [CreateTicketDetailDto],
  })
  @IsArray()
  @Type(() => CreateTicketDetailDto)
  flight: CreateTicketDetailDto[];
}
