import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ModelsService } from '@trading-bot/models';
import { CryptoUtilsService } from '@trading-bot/crypto-utils';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID, randomInt } from 'crypto';

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
    try {
      // Hash the password before storing
      const hashedPassword = await this.cryptoService.hashPassword(user.password);
      
      // Generate email verification token
      const emailVerificationToken = randomUUID();
      const emailVerificationCode = randomInt(100000, 999999).toString();
      
      // Create the user in the database
      const newUser = await this.modelsService.user.create({
        data: {
          nickname: user.nickname,
          email: user.email,
          password: hashedPassword,
          country: user.country,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerificationToken,
          emailVerificationCode,
          tradingExperienceLevel: user.tradingExperienceLevel,
          primaryTradingStrategy: user.primaryTradingStrategy,
          riskTolerance: user.riskTolerance,
          preferredTradingPlatforms: user.preferredTradingPlatforms,
        },
        select: {
          id: true,
          nickname: true,
          email: true,
          country: true,
          firstName: true,
          lastName: true,
          emailVerificationToken: true,
          tradingExperienceLevel: true,
          primaryTradingStrategy: true,
          riskTolerance: true,
          preferredTradingPlatforms: true,
        }
      });

      return newUser;
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: string }).code === 'P2002'
      ) {
        const target = (error as { meta?: { target?: string[] } }).meta?.target;
        const field = target?.[0] ?? 'field';
        const fieldName =
          field === 'nickname' ? 'nickname' : field === 'email' ? 'email' : field;
        throw new BadRequestException(
          `User with this ${fieldName} already exists. Please choose a different ${fieldName}.`,
        );
      }
      throw error;
    }
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
        country: true,
        firstName: true,
        lastName: true,
        role: true,
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