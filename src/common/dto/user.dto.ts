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

// Users
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
  @MaxLength(20)
  @ApiProperty({
    description: 'Nama pengguna',
    example: 'Jane Doe',
    minLength: 4,
    maxLength: 50,
  })
  name: string;

  @IsIn(['0', '1'])
  @ApiProperty({
    description: 'Tipe pengguna: 0 = staff, 1 = agent',
    example: 1,
    enum: ['0', '1'],
  })
  type: string;
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

// Users Menu
export class ListUserMenuRequest {
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

export class UserMenuResponse {
  @ApiProperty({
    example: 'user|view',
  })
  name: string;

  @ApiProperty({
    example: 'Melihat data users',
  })
  desc: string;
}

// Users Roles
export class RegisterUserRoleRequest {
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

export class ListUserRoleRequest {
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

export class UserRoleResponse {
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
