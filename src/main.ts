import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieSession from 'cookie-session';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      name: 'jwt',
      keys: [process.env.SECRET],
      
    }),
  );
  await app.listen(3000);
}
bootstrap();
