import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Recipient, RecipientSchema } from './schemas/recipient.schema';
import { RecipientsController } from './recipients.controller';
import { RecipientsService } from './recipients.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Recipient.name, schema: RecipientSchema }])],
    controllers: [RecipientsController],
    providers: [RecipientsService],
})
export class RecipientsModule { }
