import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ListTaskRequest {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: 'ID Task (equal)' })
  id?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter title (like)' })
  title?: string;

  @IsOptional()
  @IsIn(['0', '1', '2', '3', '4'])
  @ApiPropertyOptional({
    description: '0: Pending, 1: In Progress, 3: Done, 4: Rejected. Default: 0',
    example: 1,
    enum: ['0', '1', '2', '3', '4'],
  })
  status: string;

  @IsOptional()
  @IsIn([
    'id',
    'title',
    'status',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
  ])
  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: [
      'id',
      'title',
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

export class TaskResponse {
  @ApiProperty({
    example: 20,
  })
  id: number;

  @ApiProperty({
    example: 'Validasi Data',
  })
  title: string;

  @ApiProperty({
    example: '1',
  })
  status: string;
}
