import { ApiProperty } from '@nestjs/swagger';
import { UserProfileDto } from './user-profile.dto';

export class RefreshResponseDto {
  @ApiProperty({
    description: 'Non-sensitive user profile. New session credentials are delivered only as HttpOnly cookies.',
    type: UserProfileDto,
  })
  user: UserProfileDto;
}
