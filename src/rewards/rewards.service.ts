import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RewardsService {
  constructor(private prisma: PrismaService) {}

  create(title: string) {
    return this.prisma.reward.create({ data: { title } });
  }

  list() {
    return this.prisma.reward.findMany({ orderBy: { createdAt: 'desc' } });
  }

  assign(id: number, awardedTo: number) {
    return this.prisma.reward.update({ where: { id }, data: { awardedTo } });
  }

  historyForUser(userId: number) {
    return this.prisma.reward.findMany({ where: { awardedTo: userId }, orderBy: { createdAt: 'desc' } });
  }
}
