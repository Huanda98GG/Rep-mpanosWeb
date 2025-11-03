import { Module } from '@nestjs/common';
import { VictimsService } from './victims.service';
import { VictimsController } from './victims.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [VictimsService, PrismaService],
  controllers: [VictimsController],
  exports: [VictimsService],
})
export class VictimsModule {}
