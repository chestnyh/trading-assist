import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ModelsService } from '@trading-bot/models';
import { CryptoUtilsService } from '@trading-bot/crypto-utils';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersApiService {
  constructor(
    private modelsService: ModelsService,
    private cryptoService: CryptoUtilsService,
  ) {}

  /**
   * Create a new user
   */
  async create(user: CreateUserDto) {
    // Hash the password before storing
    const hashedPassword = await this.cryptoService.hashPassword(user.password);
    
    // Create the user in the database
    const newUser = await this.modelsService.user.create({
      data: {
        nickname: user.nickname,
        email: user.email,
        password: hashedPassword,
        name: user.name,
      },
      select: {
        id: true,
        nickname: true,
        email: true,
        name: true,
      }
    });

    return newUser;
  }

  /**
   * TODO add description
   */
  update(){
    throw new Error('Update Not implemented');
  }

  /**
   * TODO add description
   */
  delete(){
    throw new Error('Update Not implemented');
  }

  /**
   * TODO add description
   */
  getByNickname(){
    throw new Error('Update Not implemented');
  }

  /**
   * TODO add description
   */
  getList(){
    throw new Error('Update Not implemented');
  }

  /**
   * Find user by ID
   */
  async findUserById(id: number) {
    const user = await this.modelsService.user.findUnique({
      where: { id },
      select: {
        id: true,
        nickname: true,
        email: true,
        name: true,
      }
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  /**
   * Validate user credentials
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.modelsService.user.findUnique({
      where: { email },
    });

    if (user && await this.cryptoService.comparePassword(password, user.password)) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }
}