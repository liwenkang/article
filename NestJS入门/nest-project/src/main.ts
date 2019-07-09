// 应用程序入口文件。它使用 NestFactory 用来创建 Nest 应用实例。
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('中心站改造文档')
    .setDescription('这是中心站改造的文档啊!')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(9000);
}

bootstrap();
