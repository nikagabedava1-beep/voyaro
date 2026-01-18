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
import { OffersService } from './offers.service';
import { CreateOfferDto, UpdateOfferDto } from './dto';
import { JwtAuthGuard } from '../common/guards';
import { CurrentUser, Roles } from '../common/decorators';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('offers')
@UseGuards(JwtAuthGuard)
export class OffersController {
  constructor(private offersService: OffersService) {}

  @Post('auction/:auctionId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COMPANY_ADMIN)
  async create(
    @Param('auctionId') auctionId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateOfferDto,
  ) {
    return this.offersService.create(auctionId, userId, dto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COMPANY_ADMIN)
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateOfferDto,
  ) {
    return this.offersService.update(id, userId, dto);
  }

  @Post(':id/withdraw')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COMPANY_ADMIN)
  async withdraw(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.offersService.withdraw(id, userId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.offersService.findById(id);
  }

  @Get('auction/:auctionId')
  async findByAuction(@Param('auctionId') auctionId: string) {
    return this.offersService.findByAuction(auctionId);
  }

  @Post(':id/vote')
  async vote(
    @Param('id') offerId: string,
    @CurrentUser('id') userId: string,
    @Body('rank') rank?: number,
  ) {
    return this.offersService.vote(offerId, userId, rank || 1);
  }

  @Delete(':id/vote')
  async removeVote(
    @Param('id') offerId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.offersService.removeVote(offerId, userId);
  }
}
