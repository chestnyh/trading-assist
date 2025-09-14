import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

}
