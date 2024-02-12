import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    mongodbHost: process.env.MONGODB_HOST,
    appPort: process.env.APP_PORT,
    jwtToken: process.env.JWT_TOKEN,
    wiApi: process.env.WI_API,
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY
  };
});

