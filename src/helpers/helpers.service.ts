import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { config } from 'src/config/config';
import { BcryptText } from './helpers.interface';

@Injectable()
export class HelpersService {
  async bcryptEncrypted({ text }: BcryptText) {
    const salt = config.key;
    return await bcrypt.hash(text, salt);
  }

  async bcryptComapre({ text }: BcryptText) {
    const salt = config.key;
    const hash = await bcrypt.hash(text, salt);

    return await bcrypt.compare(text, hash);
  }
}
