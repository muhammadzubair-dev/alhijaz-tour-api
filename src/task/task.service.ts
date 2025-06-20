/* eslint-disable prettier/prettier */
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { users } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { WebResponse } from 'src/common/dto/web.dto';
import { PrismaService } from 'src/common/prisma.service';
import { camelToSnakeCase } from 'src/common/utils/camelToSnakeCase';
import { SseService } from 'src/sse/sse.service';
import { Logger } from 'winston';
import { ListTaskRequest, TaskResponse } from './task.dto';
import { generateAutoId } from 'src/common/utils/generateAutoId';

@Injectable()
export class TaskService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly prisma: PrismaService,
    private readonly sse: SseService,
  ) { }

  async listTask(
    authUser: users,
    request: ListTaskRequest,
    onlyOwn: boolean = true,
  ): Promise<WebResponse<TaskResponse[]>> {
    const {
      id,
      title,
      status,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = request;

    const where: any = {
      ...(id && { id: Number(id) }), // exact match
      ...(title && { title: { contains: title, mode: 'insensitive' } }),
      ...(status && { status }),
      ...(onlyOwn && { to_user_id: authUser.id }), // gunakan hanya jika onlyOwn true
    };

    let orderBy: any = {
      created_at: 'desc',
    };

    if (sortBy) {
      if (sortBy === 'createdBy') {
        orderBy = {
          createdByUser: {
            name: sortOrder ?? 'asc',
          },
        };
      } else if (sortBy === 'updatedBy') {
        orderBy = {
          updatedByUser: {
            name: sortOrder ?? 'asc',
          },
        };
      } else {
        orderBy = {
          [camelToSnakeCase(sortBy)]: sortOrder ?? 'asc',
        };
      }
    }

    const total = await this.prisma.tasks.count({ where });
    const totalPages = Math.ceil(total / limit);

    const tasks = await this.prisma.tasks.findMany({
      where,
      orderBy,
      include: {
        task_type: {
          select: {
            name: true
          }
        },
        from_user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        to_user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Tambahan: hitung total task yang belum dibaca
    const unreadCount = await this.prisma.tasks.count({
      where: {
        ...where,
        is_read: false,
      },
    });

    return {
      data: tasks.map((item) => ({
        id: item.id,
        title: item.title,
        type: item.task_type.name,
        assignedTo: item.to_user.username,
        notes: item.notes,
        status: item.status,
        isRead: item.is_read,
        createdBy: item.from_user.username,
        createdAt: item.created_at,
      })),
      paging: {
        page,
        limit,
        total,
        totalPages,
      },
      summary: {
        unreadCount,
      },
    };
  }

  async getTaskDetail(
    authUser: users,
    taskId: number,
  ): Promise<WebResponse<any>> {
    const task = await this.prisma.tasks.findFirst({
      where: {
        id: taskId,
        to_user_id: authUser.id, // keamanan: hanya boleh lihat task miliknya
      },
      include: {
        task_type: {
          select: {
            name: true,
          },
        },
        from_user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        to_user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task tidak ditemukan atau tidak memiliki akses');
    }

    const baseImage = 'http://localhost:3000/uploads/'

    const parsedData = task.data as {
      selfPhoto?: string;
      photoIdentity?: string;
      [key: string]: any;
    };

    return {
      data: {
        id: task.id,
        title: task.title,
        type: task.task_type_id,
        notes: task.notes,
        data: {
          ...parsedData,
          selfPhoto: parsedData.selfPhoto ? baseImage + parsedData.selfPhoto : null,
          photoIdentity: parsedData.photoIdentity ? baseImage + parsedData.photoIdentity : null,
        },
        status: task.status,
        isRead: task.is_read,
        createdBy: task.from_user.username,
        createdAt: task.created_at,
      },
    };
  }

  async updateTaskStatus(
    authUser: users,
    taskId: number,
    newStatus: string,
  ): Promise<WebResponse<any>> {
    const task = await this.prisma.tasks.findFirst({
      where: {
        id: taskId,
        to_user_id: authUser.id,
      },
    });

    if (!task) {
      throw new NotFoundException('Task tidak ditemukan atau tidak memiliki akses');
    }

    const currentStatus = Number(task.status);
    const targetStatus = Number(newStatus);

    if (isNaN(targetStatus)) {
      throw new BadRequestException('Status tidak valid: bukan angka');
    }

    const allowedTransitions: Record<number, number[]> = {
      0: [1],
      1: [2, 3],
    };

    const allowedNextStatuses = allowedTransitions[currentStatus] || [];
    if (!allowedNextStatuses.includes(targetStatus)) {
      throw new BadRequestException(
        `Transisi status tidak diizinkan. Status saat ini "${currentStatus}" hanya dapat diubah ke: ${allowedNextStatuses.join(', ')}.`
      );
    }

    if (targetStatus !== 2) {
      const updated = await this.prisma.tasks.update({
        where: { id: taskId },
        data: {
          status: targetStatus.toString(),
          updated_at: new Date(),
        },
      });

      return {
        data: {
          id: updated.id,
          status: updated.status,
          updatedAt: updated.updated_at,
        },
      };
    }

    const parsedData = task.data as Record<string, any>;

    return await this.prisma.$transaction(async (tx) => {
      const duplicate = await tx.jamaah.findFirst({
        where: { identity_number: parsedData.identityNumber },
      });

      if (duplicate) {
        throw new BadRequestException('No KTP sudah digunakan oleh jamaah lain');
      }

      const jamaahCode = await generateAutoId(this.prisma, {
        model: 'jamaah',
        field: 'jamaah_code',
        prefix: 'JAM',
        padding: 3,
      });

      await tx.jamaah.create({
        data: {
          jamaah_code: jamaahCode,
          identity_number: parsedData.identityNumber,
          first_name: parsedData.firstName,
          mid_name: parsedData.middleName ?? null,
          last_name: parsedData.lastName ?? null,
          birth_place: parsedData.birthPlace,
          birth_date: new Date(parsedData.birthDate),
          gender: Number(parsedData.gender),
          married_status: Number(parsedData.marriedStatus),
          father_name: parsedData.fatherName,
          mother_name: parsedData.motherName,
          phone_number: parsedData.phoneNumber,
          province: Number(parsedData.province),
          district: Number(parsedData.district),
          sub_district: Number(parsedData.subDistrict),
          neighborhoods: Number(parsedData.neighborhoods),
          address: parsedData.address,
          home_phone_number: parsedData.homePhoneNumber ?? null,
          medical_condition: parsedData.medicalCondition ?? null,
          self_photo: parsedData.selfPhoto ?? null,
          photo_identity: parsedData.photoIdentity ?? null,
          notes: parsedData.notes ?? null,
          status: '1', // atau status default sesuai kebutuhan
          agents_id: parsedData.agentId ? Number(parsedData.agentId) : null,
          staff_id: parsedData.staffId ?? null,
          created_by: authUser.id,
          created_at: new Date(),
        },
      });

      let umrohCode = parsedData.umrohCode;

      if (!umrohCode) {
        umrohCode = await generateAutoId(this.prisma, {
          model: 'umrah',
          field: 'umroh_code',
          prefix: 'UMR',
          padding: 6,
        });

        await tx.umrah.create({
          data: {
            umroh_code: umrohCode,
            pin: Number(parsedData.phoneNumber.slice(-5)),
            package: parsedData.packageId,
            created_by: authUser.id,
            updated_by: null,
            updated_at: null,
          },
        });
      }

      await tx.umrah_registers.create({
        data: {
          umroh_code: umrohCode,
          jamaah: jamaahCode,
          remarks: Number(parsedData.remarks),
          mahram: parsedData.mahram,
          package_room_price: parsedData.packageRoomPrice,
          office_discount: parsedData.officeDiscount ?? 0,
          agent_discount: parsedData.agentDiscount ?? 0,
          other_expenses: parsedData.otherExpenses ?? 0,
          agent_id: parsedData.agentId,
          register_name: parsedData.registerName,
          register_phone: parsedData.registerPhone,
          notes: parsedData.notes,
          status: '1',
          created_by: authUser.id,
          updated_by: null,
          updated_at: null,
        },
      });

      const updated = await tx.tasks.update({
        where: { id: taskId },
        data: {
          status: '2',
          updated_at: new Date(),
        },
      });

      return {
        data: {
          id: updated.id,
          status: updated.status,
          updatedAt: updated.updated_at,
        },
      };
    });
  }

  async markTasksAsRead(
    authUser: users,
    taskId?: number,
  ): Promise<WebResponse<{ updatedCount: number }>> {

    if (taskId) {
      const task = await this.prisma.tasks.findFirst({
        where: {
          id: taskId,
          to_user_id: authUser.id,
        },
      });
      if (!task) {
        throw new NotFoundException('Task tidak ditemukan atau tidak memiliki akses');
      }
      // Hanya update jika belum dibaca
      if (!task.is_read) {
        await this.prisma.tasks.update({
          where: { id: taskId },
          data: {
            is_read: true,
            updated_at: new Date(),
          },
        });
        return {
          data: { updatedCount: 1 },
        };
      }
      return {
        data: { updatedCount: 0 },
      };
    }

    // ✅ Jika tidak ada taskId, update semua
    const result = await this.prisma.tasks.updateMany({
      where: {
        to_user_id: authUser.id,
        is_read: false,
      },
      data: {
        is_read: true,
        updated_at: new Date(),
      },
    });
    return {
      data: { updatedCount: result.count },
    };
  }
}
