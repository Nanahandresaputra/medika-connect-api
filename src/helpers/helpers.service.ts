import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { config } from 'src/config/config';
import { BcryptText } from './helpers.interface';

@Injectable()
export class HelpersService {
  bcryptEncrypted(pwd: string): string {
    const salt = bcrypt.genSaltSync(10);
    const encrypted = bcrypt.hashSync(pwd, salt);
    return encrypted;
  }

  bcryptComapre(pwd: string, hash: string): boolean {
    const salt = config.key;

    return bcrypt.compareSync(pwd, hash);
  }
}
