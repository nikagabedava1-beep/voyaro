import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { JwtAuthGuard } from '../common/guards';
import { CurrentUser, Roles } from '../common/decorators';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('auctions')
@UseGuards(JwtAuthGuard)
export class AuctionsController {
  constructor(private auctionsService: AuctionsService) {}

  @Post('trip/:tripId')
  async startAuction(
    @Param('tripId') tripId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.auctionsService.startAuction(tripId, userId);
  }

  @Get()
  async findActiveAuctions(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.auctionsService.findActiveAuctions(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Get('matching')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COMPANY_ADMIN)
  async findMatchingAuctions(@CurrentUser() user: any) {
    const company = await this.auctionsService['prisma'].tourCompany.findUnique({
      where: { adminId: user.id },
    });
    if (!company) {
      return [];
    }
    return this.auctionsService.findMatchingAuctions(company.id);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.auctionsService.findById(id);
  }

  @Post(':id/select-winner')
  async selectWinner(
    @Param('id') auctionId: string,
    @Body('offerId') offerId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.auctionsService.selectWinner(auctionId, offerId, userId);
  }
}
