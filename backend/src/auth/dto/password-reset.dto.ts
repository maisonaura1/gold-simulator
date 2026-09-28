import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordTokenDto {
  // 32 random bytes, hex-encoded (see AuthService.forgotPassword)
  @Matches(/^[0-9a-f]{64}$/, { message: 'Invalid or expired token' })
  token: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  newPassword: string;
}

export class AdminResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  newPassword: string;

  @IsString()
  adminKey: string;
}
