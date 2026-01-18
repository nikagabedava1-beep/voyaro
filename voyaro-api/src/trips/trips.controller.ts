import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import {
  CreateTripDto,
  UpdateTripDto,
  SubmitDatesDto,
  SubmitPreferencesDto,
} from './dto';
import { JwtAuthGuard } from '../common/guards';
import { CurrentUser } from '../common/decorators';

@Controller('trips')
@UseGuards(JwtAuthGuard)
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Post()
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateTripDto) {
    return this.tripsService.create(userId, dto);
  }

  @Get()
  async findMyTrips(@CurrentUser('id') userId: string) {
    return this.tripsService.findMyTrips(userId);
  }

  @Get(':id')
  async findById(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.tripsService.findById(id, userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateTripDto,
  ) {
    return this.tripsService.update(id, userId, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.tripsService.delete(id, userId);
  }

  @Post('join/:token')
  async joinByInvite(
    @Param('token') token: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.tripsService.joinByInvite(token, userId);
  }

  @Get('invite/:token')
  async getByInviteToken(@Param('token') token: string) {
    return this.tripsService.findByInviteToken(token);
  }

  @Post(':id/dates')
  async submitDates(
    @Param('id') tripId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: SubmitDatesDto,
  ) {
    return this.tripsService.submitDates(tripId, userId, dto);
  }

  @Post(':id/preferences')
  async submitPreferences(
    @Param('id') tripId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: SubmitPreferencesDto,
  ) {
    return this.tripsService.submitPreferences(tripId, userId, dto);
  }

  @Post(':id/confirm')
  async confirmParticipation(
    @Param('id') tripId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.tripsService.confirmParticipation(tripId, userId);
  }

  @Get(':id/participants')
  async getParticipants(@Param('id') tripId: string) {
    return this.tripsService.getParticipants(tripId);
  }

  @Delete(':id/participants/:userId')
  async removeParticipant(
    @Param('id') tripId: string,
    @Param('userId') participantUserId: string,
    @CurrentUser('id') requesterId: string,
  ) {
    return this.tripsService.removeParticipant(tripId, participantUserId, requesterId);
  }
}
