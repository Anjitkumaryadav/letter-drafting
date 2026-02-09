import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Draft, DraftSchema } from './schemas/draft.schema';
import { DraftsController } from './drafts.controller';
import { DraftsService } from './drafts.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Draft.name, schema: DraftSchema }])],
    controllers: [DraftsController],
    providers: [DraftsService],
})
export class DraftsModule { }
