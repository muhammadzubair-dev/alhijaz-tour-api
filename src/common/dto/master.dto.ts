import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
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
