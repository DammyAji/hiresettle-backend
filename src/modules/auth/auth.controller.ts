// auth.controller.ts
import { Controller, Post, Get, Patch, Body, Query, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('nonce')
  @ApiOperation({ summary: 'Get a challenge nonce for a Stellar address' })
  getNonce(@Query('address') address: string) {
    const nonce = this.authService.generateNonce(address);
    return { nonce, address };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit signed nonce and receive a JWT' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Patch('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update authenticated user configuration profile properties' })
  async updateMe(@Request() req: any, @Body() dto: UpdateProfileDto) {
    // req.user.id comes from the JwtAuthGuard context session injection
    return this.authService.updateProfile(req.user.id, dto);
  }
}
