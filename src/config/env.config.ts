import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    mongodbHost: process.env.MONGODB_HOST,
    appPort: process.env.APP_PORT,
    jwtToken: process.env.JWT_TOKEN,
    wompiApi: process.env.WOMPI_API,
  };
});
