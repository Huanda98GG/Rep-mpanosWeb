import { Controller, Post, Body, UseGuards, Get, Param, Put, Delete, Request } from '@nestjs/common';
import { VictimsService } from './victims.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateVictimDto } from './dto/create-victim.dto';
import { UpdateVictimDto } from './dto/update-victim.dto';

@Controller('victims')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VictimsController {
  constructor(private svc: VictimsService) {}

  // Slaves can create victims
  @Post()
  @Roles('SLAVE')
  create(@Body() body: CreateVictimDto, @Request() req: any) {
    const user = req.user;
    return this.svc.create({ ...body, capturedBy: user.sub });
  }

  // Admin can list all
  @Get()
  @Roles('ADMIN')
  listAll() {
    return this.svc.findAll();
  }

  // Slave can list their own victims
  @Get('me')
  @Roles('SLAVE')
  myVictims(@Request() req: any) {
    return this.svc.findByCapturer(req.user.sub);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.findOne(Number(id));
  }

  // Admin can update or delete
  @Put(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() body: UpdateVictimDto) {
    return this.svc.update(Number(id), body);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.svc.remove(Number(id));
  }
}
