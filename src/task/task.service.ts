/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { WebResponse } from 'src/common/dto/web.dto';
import { PrismaService } from 'src/common/prisma.service';
import { camelToSnakeCase } from 'src/common/utils/camelToSnakeCase';
import { Logger } from 'winston';
import { ListTaskRequest, TaskResponse } from './task.dto';
import { SseService } from 'src/sse/sse.service';
import { users } from '@prisma/client';

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
      to_user_id: authUser.id
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

  sendTestNotification(userId: string, payload: any) {
    this.sse.sendToUser(userId, payload);
  }
}
