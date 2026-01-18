import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards';
import { Roles } from '../common/decorators';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PLATFORM_ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('companies/pending')
  async getPendingVerifications() {
    return this.adminService.getPendingVerifications();
  }

  @Get('companies')
  async getAllCompanies(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('verified') verified?: string,
  ) {
    const verifiedBool = verified === 'true' ? true : verified === 'false' ? false : undefined;
    return this.adminService.getAllCompanies(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 100,
      verifiedBool,
    );
  }

  @Post('companies/:id/verify')
  async verifyCompany(@Param('id') id: string) {
    return this.adminService.verifyCompany(id);
  }

  @Post('companies/:id/reject')
  async rejectCompany(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.adminService.rejectCompany(id, reason);
  }

  @Get('auctions')
  async getAllAuctions(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAllAuctions(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      status,
    );
  }

  @Get('users')
  async getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('role') role?: string,
  ) {
    return this.adminService.getAllUsers(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      role,
    );
  }

  @Patch('users/:id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body('role') role: string,
  ) {
    return this.adminService.updateUserRole(id, role);
  }
}
