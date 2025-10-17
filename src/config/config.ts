import * as dotenv from 'dotenv';
dotenv.config({ path: process.cwd() + `/.env.${process.env.NODE_ENV}` });

export const config = {
  key: process.env.SECRET_KEY as string,
};
