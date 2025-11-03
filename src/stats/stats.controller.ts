import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('stats')
export class StatsController {
  constructor(private prisma: PrismaService) {}

  // Leaderboard: count victims per slave
  @Get('leaderboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async leaderboard() {
    const groups: any = await this.prisma.victim.groupBy({ by: ['capturedBy'], _count: { id: true }, orderBy: { _count: { id: 'desc' } } });
    // Fetch user info for each capturer
    const results = await Promise.all(groups.map(async (g: any) => {
      const user = await this.prisma.user.findUnique({ where: { id: g.capturedBy } });
      return { user: { id: user?.id, email: user?.email, name: user?.name }, count: g._count.id };
    }));
    return results;
  }
}
