import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';
import { JwtAuthGuard } from '../common/guards';
import { CurrentUser, Roles } from '../common/decorators';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Post()
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateCompanyDto) {
    return this.companiesService.create(userId, dto);
  }

  @Get('me')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COMPANY_ADMIN)
  async findMyCompany(@CurrentUser('id') userId: string) {
    return this.companiesService.findByAdmin(userId);
  }

  @Patch('me')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COMPANY_ADMIN)
  async updateMyCompany(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(userId, dto);
  }

  @Get('me/stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COMPANY_ADMIN)
  async getStats(@CurrentUser('id') userId: string) {
    return this.companiesService.getStats(userId);
  }

  @Get('me/won')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COMPANY_ADMIN)
  async getWonTrips(@CurrentUser('id') userId: string) {
    return this.companiesService.getWonTrips(userId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('verified') verified?: string,
  ) {
    return this.companiesService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      verified !== undefined ? verified === 'true' : undefined,
    );
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.companiesService.findById(id);
  }
}
