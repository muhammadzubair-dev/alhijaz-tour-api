import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsIn,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

// Bank
export class RegisterBankRequest {
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  @ApiProperty({
    description: 'Kode Bank',
    example: '014',
    minLength: 3,
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
export class ListPackageRequest {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'ID Paket (equal)' })
  id?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Nama Paket (like)' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'status: 1 = aktif, 0 = tidak aktif' })
  status?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Kode Booking (equal)' })
  bookingCode?: string;

  @IsOptional()
  @IsIn([
    'id',
    'name',
    'status',
    'bookingCode',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
  ])
  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: [
      'id',
      'name',
      'status',
      'bookingCode',
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
  // departureInfo: string;

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

class HotelDto {
  @Expose()
  @IsNumber()
  @ApiProperty()
  cityId: number;

  @Expose()
  @IsString()
  @ApiProperty()
  cityName: string;

  @Expose()
  @IsString()
  @ApiProperty()
  hotelId: string;

  @Expose()
  @IsString()
  @ApiProperty()
  hotelName: string;
}

class RoomDto {
  @Expose()
  @IsNumber()
  @ApiProperty()
  roomId: number;

  @Expose()
  @IsNumber()
  @ApiProperty()
  roomPrice: number;

  @Expose()
  @IsString()
  @ApiProperty()
  roomName: string;
}

export class HotelRoomDto {
  @Expose()
  @IsNumber()
  @ApiProperty()
  packageTypeId: number;

  @Expose()
  @IsString()
  @ApiProperty()
  packageTypeName: string;

  @Expose()
  @Transform(({ value }) => {
    try {
      if (Array.isArray(value)) return value;
      return JSON.parse(value);
    } catch (e) {
      throw new Error('Invalid hotelRooms format. Must be a JSON array.');
    }
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HotelDto)
  @ApiProperty({ type: [HotelDto] })
  hotels: HotelDto[];

  @Expose()
  @Transform(({ value }) => {
    try {
      if (Array.isArray(value)) return value;
      return JSON.parse(value);
    } catch (e) {
      throw new Error('Invalid hotelRooms format. Must be a JSON array.');
    }
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoomDto)
  @ApiProperty({ type: [RoomDto] })
  rooms: RoomDto[];
}

export class CreatePackageRequestDto {
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @ApiProperty()
  name: string;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  ticket: number;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  seat: number;

  @IsISO8601()
  @ApiProperty()
  maturityPassportDelivery: string;

  @IsISO8601()
  @ApiProperty()
  maturityRepayment: string;

  @IsString()
  @ApiProperty()
  manasikDatetime: string;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  manasikPrice: number;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  adminPrice: number;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  pcrPrice: number;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  equipmentHandlingPrice: number;

  @IsISO8601()
  @ApiProperty()
  checkInMadinah: string;

  @IsISO8601()
  @ApiProperty()
  checkInMekkah: string;

  @IsISO8601()
  @ApiProperty()
  checkOutMadinah: string;

  @IsISO8601()
  @ApiProperty()
  checkOutMekkah: string;

  @IsString()
  @ApiProperty()
  isPromo: string;

  @IsString()
  @ApiProperty()
  waGroup: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  notes?: string;

  @IsString()
  @ApiProperty()
  tourLead: string;

  @IsString()
  @ApiProperty()
  gatheringTime: string;

  @IsString()
  @ApiProperty()
  airportRallyPoint: string;

  @IsString()
  @ApiProperty()
  status: string;

  @Expose()
  @Transform(({ value }) => {
    try {
      if (Array.isArray(value)) return value;
      return JSON.parse(value);
    } catch (e) {
      throw new Error('Invalid hotelRooms format. Must be a JSON array.');
    }
  })
  @IsArray()
  // @ValidateNested({ each: true })
  @Type(() => HotelRoomDto)
  @ApiProperty({ type: [HotelRoomDto] })
  hotelRooms: HotelRoomDto[];
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

export class PackageResponse {
  @ApiProperty({ example: '21' })
  id: string;

  @ApiProperty({ example: 'Paket Umroh Berkah' })
  name: string;

  @ApiProperty({ example: 'UMR12345' })
  bookingCode: string;

  @ApiProperty({ example: 'A' })
  status: string;
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

export class JamaahResponse {
  @ApiProperty({
    example: '21',
  })
  jamaahCode: string;

  @ApiProperty({
    example: 'Khalid',
  })
  jamaahName: string;
}

// Airport
export class RegisterAirportRequest {
  @IsString()
  @MinLength(3)
  @MaxLength(5)
  @ApiProperty({
    description: 'Kode Bandara',
    example: 'CGK',
    minLength: 3,
    maxLength: 5,
  })
  code: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({
    description: 'Nama Bandara',
    example: 'BCA',
    minLength: 3,
    maxLength: 100,
  })
  name: string;

  @IsIn(['0', '1'])
  @ApiProperty({
    description: 'Tipe status: 0 = Tidak Aktif, 1 = Aktif',
    example: 1,
    enum: ['0', '1'],
  })
  status: string;
}

export class ListAirportRequest {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter code airport (like)' })
  code?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter name (like)' })
  name?: string;

  @IsOptional()
  @IsIn(['0', '1'])
  @ApiPropertyOptional({
    description: 'Tipe status: 0 = Tidak Aktif, 1 = Aktif',
    example: 1,
    enum: ['0', '1'],
  })
  status: string;

  @IsOptional()
  @IsIn([
    'code',
    'name',
    'status',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
  ])
  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: [
      'code',
      'name',
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

export class AirportResponse {
  @ApiProperty({
    example: 'CGK',
  })
  code: string;

  @ApiProperty({
    example: 'Soekarno Hatta',
  })
  name: string;

  @ApiProperty({
    example: '1',
  })
  status: string;
}

// Airlines
export class RegisterAirlineRequest {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({
    description: 'Nama Pesawat',
    example: 'BCA',
    minLength: 3,
    maxLength: 50,
  })
  name: string;

  @IsIn(['0', '1'])
  @ApiProperty({
    description: 'Tipe status: 0 = Tidak Aktif, 1 = Aktif',
    example: 1,
    enum: ['0', '1'],
  })
  status: string;
}

export class ListAirlineRequest {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter name (like)' })
  name?: string;

  @IsOptional()
  @IsIn(['0', '1'])
  @ApiPropertyOptional({
    description: 'Tipe status: 0 = Tidak Aktif, 1 = Aktif',
    example: 1,
    enum: ['0', '1'],
  })
  status: string;

  @IsOptional()
  @IsIn(['name', 'status', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'])
  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: [
      'name',
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

export class AirlineResponse {
  @ApiProperty({
    example: 22,
  })
  id: number;

  @ApiProperty({
    example: 'Soekarno Hatta',
  })
  name: string;

  @ApiProperty({
    example: '1',
  })
  status: string;
}

// Umroh
export class CreateUmrohRegisterRequest {
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
