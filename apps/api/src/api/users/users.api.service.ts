import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ModelsService } from '@trading-bot/models';
import { CryptoUtilsService } from '@trading-bot/crypto-utils';

@Injectable()
export class UsersApiService {
  constructor(
    private modelsService: ModelsService,
    private cryptoService: CryptoUtilsService,
  ) {}

  /**
   * TODO add description
   */
  async create(user: any){
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

    console.log("user = ", user);

    if (user && await this.cryptoService.comparePassword(password, user.password)) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }
}