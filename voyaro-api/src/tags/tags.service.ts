import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto, UpdateTagDto } from './dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  // Public: Get all active tags
  async findAllActive() {
    return this.prisma.tripTag.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      select: {
        id: true,
        slug: true,
        emoji: true,
        labelEn: true,
        labelKa: true,
      },
    });
  }

  // Admin: Get all tags (including inactive)
  async findAll() {
    return this.prisma.tripTag.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  // Admin: Get single tag
  async findById(id: string) {
    const tag = await this.prisma.tripTag.findUnique({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return tag;
  }

  // Admin: Create tag
  async create(dto: CreateTagDto) {
    // Check if slug already exists
    const existing = await this.prisma.tripTag.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException('Tag with this slug already exists');
    }

    return this.prisma.tripTag.create({
      data: {
        slug: dto.slug,
        emoji: dto.emoji,
        labelEn: dto.labelEn,
        labelKa: dto.labelKa,
        isActive: dto.isActive ?? true,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  // Admin: Update tag
  async update(id: string, dto: UpdateTagDto) {
    const existing = await this.prisma.tripTag.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Tag not found');
    }

    // Check if new slug conflicts
    if (dto.slug && dto.slug !== existing.slug) {
      const conflict = await this.prisma.tripTag.findUnique({
        where: { slug: dto.slug },
      });

      if (conflict) {
        throw new ConflictException('Tag with this slug already exists');
      }
    }

    return this.prisma.tripTag.update({
      where: { id },
      data: dto,
    });
  }

  // Admin: Delete tag
  async delete(id: string) {
    const existing = await this.prisma.tripTag.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Tag not found');
    }

    await this.prisma.tripTag.delete({
      where: { id },
    });

    return { message: 'Tag deleted successfully' };
  }

  // Validate tag slugs exist and are active
  async validateTags(slugs: string[]): Promise<boolean> {
    if (!slugs || slugs.length === 0) return true;

    const validTags = await this.prisma.tripTag.findMany({
      where: {
        slug: { in: slugs },
        isActive: true,
      },
    });

    return validTags.length === slugs.length;
  }
}
