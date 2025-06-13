import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

// User
export class RegisterUserRequest {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({
    description: 'Username pengguna',
    example: 'JaneDoe',
    minLength: 4,
    maxLength: 20,
  })
  username: string;

  @IsString()
  @MinLength(4)
  @MaxLength(50)
  @ApiProperty({
    description: 'Nama pengguna',
    example: 'Jane Doe',
    minLength: 4,
    maxLength: 50,
  })
  name: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'isActive: true = active, false = Inactive',
    example: true,
  })
  isActive?: boolean;

  @IsOptional()
  @IsIn(['0', '1'])
  @ApiPropertyOptional({
    description: 'Tipe pengguna: 0 = staff, 1 = agent',
    example: 1,
    enum: ['0', '1'],
  })
  type?: string;
}

export class LoginUserRequest {
  @IsString()
  @Length(4, 20)
  @ApiProperty({
    description: 'Username pengguna',
    example: 'JaneDoe',
    minLength: 4,
    maxLength: 20,
  })
  username: string;

  @IsString()
  @Length(8, 100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  @ApiProperty({
    description:
      'Password pengguna dengan huruf besar, kecil, angka, dan simbol',
    example: 'P@ssw0rd123',
    minLength: 8,
    maxLength: 100,
  })
  password: string;
}

export class ListUserRequest {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter username (like)' })
  username?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter name (like)' })
  name?: string;

  @IsOptional()
  @IsIn(['0', '1'])
  @ApiPropertyOptional({
    description: 'Filter type (0=staff, 1=agent)',
    enum: ['0', '1'],
  })
  type?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @ApiPropertyOptional({
    description: 'Filter aktif (true atau false)',
    example: true,
  })
  isActive?: boolean;

  @IsOptional()
  @IsIn(['username', 'name'])
  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: ['username', 'name'],
  })
  sortBy?: 'username' | 'name';

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

export class UserResponse {
  @ApiProperty({
    example: 'Jane_Doe',
  })
  username: string;

  @ApiProperty({
    example: 'Jane Doe',
  })
  name: string;

  @ApiProperty({
    example: 'cvgbhn3jkmkdsf',
    required: false,
  })
  password?: string;

  @ApiProperty({
    example: '1',
    required: false,
  })
  type?: string;
}

// Menu
export class ListMenuRequest {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter name (like)' })
  name?: string;

  @IsOptional()
  @IsIn(['name'])
  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: ['name'],
  })
  sortBy?: 'name';

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

export class MenuResponse {
  @ApiProperty({
    example: 'user|view',
  })
  name: string;

  @ApiProperty({
    example: 'Melihat data users',
  })
  desc: string;
}

// Role
export class RegisterRoleRequest {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({
    description: 'Nama Role',
    example: 'Super Admin',
    minLength: 4,
    maxLength: 50,
  })
  name: string;

  @IsOptional()
  @MaxLength(100)
  @ApiProperty({
    description: 'Deskripsi Role',
    example: 'Semua Menu Akses',
    maxLength: 100,
  })
  description: string;

  @IsIn(['0', '1'])
  @ApiProperty({
    description: 'Platform role: 0 = Travel',
    example: 0,
    enum: ['0'],
  })
  platform: string;

  @IsIn(['0', '1'])
  @ApiProperty({
    description: 'Tipe role: 0 = staff, 1 = agent',
    example: 1,
    enum: ['0', '1'],
  })
  type: string;

  @IsBoolean()
  @ApiProperty({
    description: 'isActive: true = active, false = Inactive',
    example: true,
  })
  isActive?: boolean;
}

export class ListRoleRequest {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter name (like)' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter name (like)' })
  description?: string;

  @IsOptional()
  @IsIn(['0', '1'])
  @ApiPropertyOptional({
    description: 'Filter type (0=staff, 1=agent)',
    enum: ['0', '1'],
  })
  type?: string;

  @IsOptional()
  @IsIn(['0'])
  @ApiPropertyOptional({
    description: 'Filter type (0=Travel)',
    enum: ['0'],
  })
  platform?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @ApiPropertyOptional({
    description: 'Filter aktif (true atau false)',
    example: true,
  })
  isActive?: boolean;

  @IsOptional()
  @IsIn(['name'])
  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: ['name'],
  })
  sortBy?: 'name';

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

export class RoleResponse {
  @ApiProperty({
    example: '21',
  })
  id: number;

  @ApiProperty({
    example: 'Super Admin',
  })
  name: string;

  @ApiProperty({
    example: 'Mengakses semua menu',
  })
  description: string;

  @ApiProperty({
    example: 'true',
  })
  isActive?: boolean;

  @ApiProperty({
    example: '0',
  })
  type: string;

  @ApiProperty({
    example: '0',
  })
  platform: string;
}

// Agent
export class RegisterAgentRequest {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({
    description: 'Username pengguna',
    example: 'JaneDoe',
    minLength: 4,
    maxLength: 20,
  })
  username: string;

  @IsString()
  @MinLength(4)
  @MaxLength(50)
  @ApiProperty({
    description: 'Nama pengguna',
    example: 'Jane Doe',
    minLength: 4,
    maxLength: 50,
  })
  name: string;

  @IsString()
  @Length(1, 1)
  @IsIn(['0', '1'])
  @ApiProperty({
    description: 'ID user (UUID)',
    example: '0',
    minLength: 1,
    maxLength: 1,
  })
  identityType: string;

  @IsNumber()
  @ApiProperty({
    description: 'ID Bank',
    example: '76',
  })
  bankId: number;

  @IsString()
  @Length(5, 20)
  @ApiProperty({
    description: 'No Rekening',
    example: '63456732',
  })
  accountNumber: string;

  @IsString()
  @Matches(/^[0-9]+$/)
  @ApiProperty({
    description: 'No Handphone',
    example: '081212071871',
  })
  phone: string;

  @IsEmail()
  @Length(5, 100)
  @ApiProperty({
    description: 'Alamat Email',
    example: 'email@gmail.com',
  })
  email: string;

  @IsString()
  @Length(5, 20)
  @ApiProperty({
    description: 'Alamat Agent',
    example: 'Jl Rasuna Said',
    minLength: 5,
    maxLength: 200,
  })
  address: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Lead Agent',
    example: '21',
  })
  leadId?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Koordinator Agent',
    example: '21',
  })
  coordinatorId?: number;

  @IsBoolean()
  @ApiProperty({
    description: 'isActive: true = active, false = Inactive',
    example: true,
  })
  isActive: boolean;
}

export class ListAgentRequest {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter name (like)' })
  name?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: 'Filter phone (like)' })
  phone?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter email (like)' })
  email?: string;

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
    'username',
    'phone',
    'email',
    'bankName',
    'accountNumber',
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
      'username',
      'phone',
      'email',
      'bankName',
      'accountNumber',
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

export class AgentResponse {
  @ApiProperty({
    example: '21',
  })
  id: number;

  @ApiPropertyOptional({
    example: 'Rizki Setyawan',
  })
  name?: string;

  @ApiProperty({
    example: '0',
  })
  identityType: string;

  @ApiPropertyOptional({
    example: 'BCA',
  })
  bankName?: string;

  @ApiProperty({
    example: '64837324',
  })
  accountNumber: string;

  @ApiProperty({
    example: '081212071871',
  })
  phone: string;

  @ApiProperty({
    example: 'email@gmail.com',
  })
  email: string;

  @ApiProperty({
    example: 0,
  })
  balance: number;

  @ApiProperty({
    example: 'Jl Rasuna Said',
  })
  address: string;

  @ApiPropertyOptional({
    example: 'UUID',
  })
  leadId?: number;

  @ApiPropertyOptional({
    example: 'UUID',
  })
  coordinatorId?: number;

  @ApiProperty({
    example: '5',
  })
  targetRemaining: number;

  @ApiPropertyOptional({
    example: true,
  })
  isActive?: boolean;
}
