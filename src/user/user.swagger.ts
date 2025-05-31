import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ListUserRequest, RegisterUserRequest } from 'src/common/dto/user.dto';

export function UserSwaggerRegister() {
  return applyDecorators(
    ApiOperation({ summary: 'Membuat user baru' }),
    ApiBody({ type: RegisterUserRequest }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Pengguna berhasil dibuat.',
      schema: {
        example: {
          data: {
            username: 'testing',
            name: 'testing',
            password: 'BYhcOCZ4gD',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Username sudah ada',
      schema: {
        example: {
          message: 'Username already exists',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    }),
  );
}

export function UserSwaggerList() {
  return applyDecorators(
    ApiOperation({ summary: 'Mendapatkan List user' }),
    ApiQuery({ type: ListUserRequest }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Pengguna berhasil dibuat.',
      schema: {
        example: {
          data: [
            {
              id: 'e52c00aa-9e06-4330-a9c1-cfc3615551c9',
              username: 'testing',
              name: 'testing',
              bannedUntil: null,
              isDefaultPassword: true,
              isActive: true,
              type: '1',
              createdBy: 'system',
              createdAt: '2025-05-30T10:46:06.993Z',
              updatedBy: 'system',
              updatedAt: '2025-05-30T12:56:38.703Z',
            },
          ],
        },
      },
    }),
  );
}

export function UserSwaggerDeactivate() {
  return applyDecorators(
    ApiOperation({ summary: 'Menonaktifkan user berdasarkan ID' }),
    ApiParam({
      name: 'id',
      description: 'ID user yang ingin dinonaktifkan',
      example: 'e52c00aa-9e06-4330-a9c1-cfc3615551c9',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User berhasil dinonaktifkan.',
      schema: {
        example: {
          message:
            'User with ID e52c00aa-9e06-4330-a9c1-cfc3615551c9 has been deactivated',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User tidak ditemukan.',
      schema: {
        example: {
          statusCode: 404,
          message:
            'User with ID e52c00aa-9e06-4330-a9c1-cfc3615551c9 not found',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'User sudah tidak aktif.',
      schema: {
        example: {
          statusCode: 400,
          message: 'User is already inactive',
          error: 'Bad Request',
        },
      },
    }),
  );
}

export function UserSwaggerUpdate() {
  return applyDecorators(
    ApiOperation({ summary: 'Memperbarui data user berdasarkan ID' }),
    ApiParam({
      name: 'id',
      description: 'ID user yang ingin diperbarui',
      example: 'e52c00aa-9e06-4330-a9c1-cfc3615551c9',
    }),
    ApiBody({ type: RegisterUserRequest }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User berhasil diperbarui.',
      schema: {
        example: {
          data: {
            username: 'updatedUser',
            name: 'Updated Name',
            type: '1',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'User tidak ditemukan.',
      schema: {
        example: {
          statusCode: 404,
          message:
            'User with ID e52c00aa-9e06-4330-a9c1-cfc3615551c9 not found',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Username sudah digunakan oleh user lain.',
      schema: {
        example: {
          statusCode: 400,
          message: 'Username already in use by another user',
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Data update sama dengan data lama.',
      schema: {
        example: {
          statusCode: 400,
          message: 'No changes detected in the update request',
          error: 'Bad Request',
        },
      },
    }),
  );
}
