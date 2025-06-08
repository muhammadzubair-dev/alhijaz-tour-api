// utils/id-generator.ts

import { PrismaService } from '../prisma.service';

interface IdGeneratorOptions {
  model: keyof PrismaService; // contoh: 'package', 'district', dsb.
  field?: string; // default: 'id'
  prefix?: string; // default: 'ID'
  padding?: number; // default: 4
}

export const generateAutoId = async (
  prisma: PrismaService,
  options: IdGeneratorOptions,
): Promise<string> => {
  const { model, field = 'id', prefix = 'ID', padding = 4 } = options;

  const modelAccessor = prisma[model] as any;

  if (!modelAccessor) {
    throw new Error(`Invalid model name: ${String(model)}`);
  }

  const latest = await modelAccessor.findFirst({
    where: {
      [field]: {
        startsWith: prefix,
      },
    },
    orderBy: {
      [field]: 'desc',
    },
    select: {
      [field]: true,
    },
  });

  let nextNumber = 1;

  if (latest?.[field]) {
    const numericPart = latest[field].slice(prefix.length);
    const parsed = parseInt(numericPart, 10);
    if (!isNaN(parsed)) {
      nextNumber = parsed + 1;
    }
  }

  const paddedNumber = String(nextNumber).padStart(padding, '0');
  return `${prefix}${paddedNumber}`;
};
