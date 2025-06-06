import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
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

  @ApiProperty({
    example: 'Joe Dhoe',
  })
  partnerName: string;

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

  @ApiProperty({
    example: '1',
  })
  status: string;
}
