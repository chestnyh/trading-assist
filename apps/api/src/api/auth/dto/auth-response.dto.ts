import { ApiProperty } from '@nestjs/swagger';
import { UserProfileDto } from './user-profile.dto';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Non-sensitive user profile. The session credential is delivered only as an HttpOnly cookie.',
    type: UserProfileDto,
  })
  user: UserProfileDto;
}
