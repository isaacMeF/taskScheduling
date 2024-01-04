import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exceptions/all-exceptions.filter';
import { TasksModule } from './tasks/tasks.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env',
      }),
      
      MongooseModule.forRootAsync({
        useFactory: () => ({
          uri: process.env.MONGO_URL,
          dbName: process.env.MONGO_DB_NAME,
        }),
      }),
      MailerModule.forRoot({
        transport: `smtps://${process.env.NO_REPLY_EMAIL}:${process.env.NO_REPLY_PASSWORD_APP}@smtp.gmail.com`,
        defaults: {
          from: `"Task Manager" < ${process.env.NO_REPLY_EMAIL} >`,
        },
        template: {
          dir: 'src/templates',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      
      UserModule,
      TasksModule
    ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
