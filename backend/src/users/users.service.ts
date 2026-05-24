import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, UserRole } from '@prisma/client';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const existingUser = await this.findOneByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    return this.prisma.user.create({
      data,
    });
  }

  async update(id: string, data: any): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async resetPassword(userId: string, newPassword: string): Promise<void> {
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
  }

  async removeUser(userId: string): Promise<void> {
    try {
      // This will cascade-delete the linked Member due to onDelete: Cascade
      await this.prisma.user.delete({ where: { id: userId } });
    } catch (error) {
      console.error('Remove user error:', error);
      throw error;
    }
  }
}
