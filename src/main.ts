import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieSession from 'cookie-session';
import cookieParser from 'cookie-parser';
async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      name: 'jwt',
      keys: [process.env.SECRET],
    }),
  );
  app.use(cookieParser(process.env.SECRET));
  await app.listen(3000);
}
bootstrap();
