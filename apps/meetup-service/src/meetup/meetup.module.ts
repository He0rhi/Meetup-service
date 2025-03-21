import { Module } from '@nestjs/common';
import { MeetupController } from './meetup.controller';
import { MeetupService } from './meetup.service';

@Module({
  
  controllers: [MeetupController],
  providers: [MeetupService],
})
export class MeetupModule {}
