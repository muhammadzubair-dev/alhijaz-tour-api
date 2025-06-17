import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUmrohRegisterRequest {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'ID Umroh register' })
  id?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @ApiPropertyOptional({ description: 'Kode Umroh', example: 'UMR000001' })
  umrohCode?: string;

  @IsString()
  @MinLength(16)
  @MaxLength(16)
  @ApiProperty({
    description: 'Nomor Identitas (KTP)',
    example: '1234567891234567',
    minLength: 16,
    maxLength: 16,
  })
  identityNumber: string;

  @IsString()
  @MinLength(1)
  @MaxLength(25)
  @ApiProperty({ description: 'Nama Depan', example: 'Khalid' })
  firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  @ApiProperty({ description: 'Nama Tengah', example: 'van', required: false })
  middleName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  @ApiProperty({
    description: 'Nama Belakang',
    example: 'Basalamah',
    required: false,
  })
  lastName?: string;

  @IsString()
  @MaxLength(10)
  @ApiProperty({ description: 'Tempat Lahir', example: 'Arab Saudi' })
  birthPlace: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'Tanggal Lahir (YYYY-MM-DD)',
    example: '2025-06-01',
  })
  birthDate: Date;

  @IsString()
  @ApiProperty({
    description: 'Jenis Kelamin (0: Perempuan, 1: Laki-laki)',
    example: '0',
  })
  gender: string;

  @IsString()
  @MinLength(10)
  @MaxLength(13)
  @ApiProperty({ description: 'Nomor HP', example: '08123456789' })
  phoneNumber: string;

  @IsString()
  @ApiProperty({
    description: 'Status Menikah (0: Menikah, 1: Belum, 2: Janda, 3: Duda)',
    example: '0',
  })
  marriedStatus: string;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ description: 'ID Provinsi', example: 17 })
  province: number;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ description: 'ID Kabupaten/Kota', example: 4 })
  district: number;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ description: 'ID Kecamatan', example: 2 })
  subDistrict: number;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ description: 'ID Kelurahan', example: 1 })
  neighborhoods: number;

  @IsString()
  @MaxLength(100)
  @ApiProperty({ description: 'Alamat Lengkap', example: 'Jl Taman Syurga' })
  address: string;

  @IsString()
  @MaxLength(20)
  @ApiProperty({ description: 'ID Paket', example: 'JBU0001' })
  packageId: string;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ description: 'ID Harga Kamar Paket', example: 26 })
  packageRoomPrice: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Potongan Diskon Kantor (default 0)',
    example: 50000,
    required: false,
  })
  officeDiscount?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Potongan Diskon Agen (default 0)',
    example: 50000,
    required: false,
  })
  agentDiscount?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Biaya Lainnya (default 0)',
    example: 50000,
    required: false,
  })
  otherExpenses?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'ID Agen', example: 4, required: false })
  agentId?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'ID Staff',
    example: '2bf62241-5e45-40d4-b31b-e819ecc5db87',
    required: false,
  })
  staffId?: string;

  @IsString()
  @MaxLength(20)
  @ApiProperty({ description: 'Nama Pendaftar', example: 'Ahmad' })
  registerName: string;

  @IsString()
  @MaxLength(20)
  @ApiProperty({ description: 'Nomor HP Pendaftar', example: '08123123123' })
  registerPhone: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiProperty({
    description: 'Catatan Tambahan',
    example: 'Tak de',
    required: false,
  })
  notes?: string;

  @IsString()
  @ApiProperty({ description: 'Status Keberangkatan (0 = Umum)', example: '0' })
  remarks: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiProperty({
    description: 'Nama Mahram',
    example: 'Sukidi',
    required: false,
  })
  mahram?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Kondisi Medis',
    example: 'Sehat',
    required: false,
  })
  medicalCondition?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Biaya Penanganan Perlengkapan',
    example: 1000000,
    required: false,
  })
  equipmentHandlingPrice?: number;
}

export class ListUmrohRequest {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiPropertyOptional({ description: 'Nama Pendaftar (like)' })
  registerName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  @ApiPropertyOptional({ description: 'No. Tlp/Hp Pendaftar (like)' })
  registerPhone?: string;

  // @IsOptional()
  // @IsString()
  // @MaxLength(20)
  // @ApiPropertyOptional({ description: 'Nama Paket Umroh (like)' })
  // packageName?: string;

  @IsOptional()
  @IsIn([
    'registerName',
    'registerPhone',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
  ])
  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: [
      'registerName',
      'registerPhone',
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
