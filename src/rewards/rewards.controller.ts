import { Controller, Post, Body, UseGuards, Get, Param, Put } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateRewardDto } from './create-reward.dto';
import { AssignRewardDto } from './assign-reward.dto';

@Controller('rewards')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RewardsController {
  constructor(private svc: RewardsService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() body: CreateRewardDto) {
    return this.svc.create(body.title);
  }

  @Get()
  @Roles('ADMIN')
  list() {
    return this.svc.list();
  }

  @Put(':id/assign')
  @Roles('ADMIN')
  assign(@Param('id') id: string, @Body() body: AssignRewardDto) {
    return this.svc.assign(Number(id), body.awardedTo);
  }

  @Get('user/:id')
  @Roles('ADMIN')
  history(@Param('id') id: string) {
    return this.svc.historyForUser(Number(id));
  }
}
