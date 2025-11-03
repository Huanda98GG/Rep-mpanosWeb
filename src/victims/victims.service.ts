import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class VictimsService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string; skills?: string; lastSeen?: string; status?: string; capturedBy: number }) {
    return this.prisma.victim.create({ data: { ...data, lastSeen: data.lastSeen ? new Date(data.lastSeen) : undefined } as any });
  }

  findAll() {
    return this.prisma.victim.findMany();
  }

  findByCapturer(userId: number) {
    return this.prisma.victim.findMany({ where: { capturedBy: userId } });
  }

  findOne(id: number) {
    return this.prisma.victim.findUnique({ where: { id } });
  }

  update(id: number, data: any) {
    return this.prisma.victim.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.victim.delete({ where: { id } });
  }
}
