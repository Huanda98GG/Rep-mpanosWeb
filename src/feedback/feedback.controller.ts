import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('feedback')
export class FeedbackController {
  constructor(private svc: FeedbackService) {}

  @Post()
  // public endpoint
  create(@Body() body: any) {
    return this.svc.create(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  list() {
    return this.svc.findAll();
  }
}
