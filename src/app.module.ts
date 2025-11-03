import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { VictimsModule } from './victims/victims.module';
import { FeedbackModule } from './feedback/feedback.module';
import { StatsController } from './stats/stats.controller';
import { RewardsModule } from './rewards/rewards.module';

@Module({
  imports: [UsersModule, AuthModule, VictimsModule, FeedbackModule, RewardsModule],
  controllers: [HealthController, StatsController],
  providers: [PrismaService],
})
export class AppModule {}
