import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

// Bank
export class RegisterBankRequest {
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  @ApiProperty({
    description: 'Kode Bank',
    example: '014',
    minLength: 4,
    maxLength: 10,
  })
  bankCode: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty({
    description: 'Nama Bank',
    example: 'BCA',
    minLength: 3,
    maxLength: 20,
  })
  name: string;

  @IsBoolean()
  @ApiProperty({
    description: 'isActive: true = active, false = Inactive',
    example: true,
  })
  isActive?: boolean;
}

export class ListBankRequest {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter bank_code (like)' })
  bankCode?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter name (like)' })
  name?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @ApiPropertyOptional({
    description: 'Filter aktif (true atau false)',
    example: true,
  })
  isActive?: boolean;

  @IsOptional()
  @IsIn([
    'bankCode',
    'name',
    'isActive',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
  ])
  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: [
      'bankCode',
      'name',
      'isActive',
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

export class BankResponse {
  @ApiProperty({
    example: '21',
  })
  id: number;

  @ApiProperty({
    example: '014',
  })
  bankCode: string;

  @ApiProperty({
    example: 'BCA',
  })
  name: string;

  @ApiProperty({
    example: 'true',
  })
  isActive?: boolean;
}

// Sosmed
export class RegisterSosmedRequest {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty({
    description: 'Nama Social Media',
    example: 'Facebook',
    minLength: 3,
    maxLength: 20,
  })
  name: string;

  @IsBoolean()
  @ApiProperty({
    description: 'isActive: true = active, false = Inactive',
    example: true,
  })
  isActive?: boolean;
}

export class ListSosmedRequest {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter name (like)' })
  name?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @ApiPropertyOptional({
    description: 'Filter aktif (true atau false)',
    example: true,
  })
  isActive?: boolean;

  @IsOptional()
  @IsIn([
    'name',
    'isActive',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
  ])
  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: [
      'name',
      'isActive',
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

export class SosmedResponse {
  @ApiProperty({
    example: '21',
  })
  id: number;

  @ApiProperty({
    example: 'BCA',
  })
  name: string;

  @ApiProperty({
    example: true,
  })
  isActive?: boolean;
}

// Tipe Paket
export class RegisterPackageRequest {
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @ApiProperty({
    description: 'ID Paket',
    example: 'ID-2123',
    minLength: 1,
    maxLength: 20,
  })
  id: string;

  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @ApiProperty({
    description: 'Nama paket',
    example: 'Paket A',
    minLength: 4,
    maxLength: 20,
  })
  name: string;

  // @IsString()
  // @MinLength(1)
  // @MaxLength(20)
  // @ApiProperty({
  //   description: 'path gambar itinerary',
  //   example: 'example.img',
  //   minLength: 1,
  //   maxLength: 50,
  // })
  // itinerary: string;

  // @IsString()
  // @MinLength(1)
  // @MaxLength(20)
  // @ApiProperty({
  //   description: 'path gambar manasikInvitation',
  //   example: 'example.img',
  //   minLength: 1,
  //   maxLength: 50,
  // })
  // manasikInvitation: string;

  // @IsString()
  // @MinLength(1)
  // @MaxLength(20)
  // @ApiProperty({
  //   description: 'path gambar itinerary',
  //   example: 'example.img',
  //   minLength: 1,
  //   maxLength: 50,
  // })
  // brochure: string;

  // @IsString()
  // @MinLength(1)
  // @MaxLength(20)
  // @ApiProperty({
  //   description: 'path gambar brochure',
  //   example: 'example.img',
  //   minLength: 1,
  //   maxLength: 50,
  // })
  // departureinfo: string;

  @IsNumber()
  @ApiProperty({
    description: 'ID Ticket',
    example: 40,
  })
  ticket: number;

  @IsNumber()
  @ApiProperty({
    description: 'Seat',
    example: 1000,
  })
  seat: number;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'YYYY-MM-DD',
    example: '2025-12-30',
  })
  maturityPassportDelivery: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'YYYY-MM-DD',
    example: '2025-12-30',
  })
  maturityRepayment: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'YYYY-MM-DD',
    example: '2025-12-30',
  })
  manasikDateTime: Date;

  @IsNumber()
  @ApiProperty({
    description: 'Harga Manasik',
    example: 1000,
  })
  manasikPrice: number;

  @IsNumber()
  @ApiProperty({
    description: 'Harga Administrasi',
    example: 1000,
  })
  adminPrice: number;

  @IsNumber()
  @ApiProperty({
    description: 'Harga Equipment Handling',
    example: 1000,
  })
  equipmentHandlingPrice: number;

  @IsNumber()
  @ApiProperty({
    description: 'Harga PCR',
    example: 1000,
  })
  pcrPrice: number;

  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @ApiProperty({
    description: 'Tempat kumpul di bandara',
    example: 'Terminal 3',
    minLength: 1,
    maxLength: 50,
  })
  airportRallyPoint: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'YYYY-MM-DD HH:mm',
    example: '2025-12-30 12:30',
  })
  gatheringTime: Date;

  @IsString()
  @MinLength(1)
  @MaxLength(25)
  @ApiProperty({
    description: 'ID Jamaah',
    example: 'RD123',
  })
  tourLead: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'YYYY-MM-DD HH:mm',
    example: '2025-12-30 12:30',
  })
  checkInMadinah: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'YYYY-MM-DD HH:mm',
    example: '2025-12-30 12:30',
  })
  checkOutMadinah: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'YYYY-MM-DD HH:mm',
    example: '2025-12-30 12:30',
  })
  checkInMekkah: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'YYYY-MM-DD HH:mm',
    example: '2025-12-30 12:30',
  })
  checkoutMekkah: Date;

  @IsBoolean()
  @ApiProperty({
    description: 'true or false',
    example: true,
  })
  isPromo: boolean;

  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @ApiProperty({
    description: 'Link WA group',
    example: 'wa.me/rtyhs',
    minLength: 1,
    maxLength: 10,
  })
  waGroup: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Notes (Jika ada)' })
  notes?: string;

  @IsIn(['0', '1'])
  @ApiProperty({
    description: 'Tipe status: 0 = Tidak Aktif, 1 = Aktif',
    example: 1,
    enum: ['0', '1'],
  })
  status: string;
}
export class PackageTypeResponse {
  @ApiProperty({
    example: '21',
  })
  id: number;

  @ApiProperty({
    example: 'Standard',
  })
  name: string;

  @ApiProperty({
    example: 'Paket Standard',
  })
  desc?: string;
}

// Cities
export class CityResponse {
  @ApiProperty({
    example: '21',
  })
  id: number;

  @ApiProperty({
    example: 'Madinah',
  })
  name: string;

  @ApiProperty({
    example: '1',
  })
  status?: string;
}

// Tipe Room
export class RoomTypeResponse {
  @ApiProperty({
    example: '45',
  })
  id: number;

  @ApiProperty({
    example: 'Double',
  })
  name: string;

  @ApiProperty({
    example: 'Room Double',
  })
  desc?: string;
}

// Tipe Room
export class HotelResponse {
  @ApiProperty({
    example: '45',
  })
  id: number;

  @ApiProperty({
    example: 'Hotel Brizz',
  })
  name: string;
}

export class PackageRoomResponse {
  @ApiProperty({
    example: '45',
  })
  id: number;

  @ApiProperty({
    example: 'ID Paket',
  })
  packageTypeId: number;

  @ApiProperty({
    example: 'ID Room',
  })
  roomTypeId: number;

  @ApiProperty({
    example: 'Status Paket',
  })
  status: string;
}
