import { Module } from '@nestjs/common';
import { MeetupController } from './meetup.controller';
import { MeetupService } from './meetup.service';
//import { ElasticSearchService } from './elastic/elastic.service';
//import { ElasticsearchModule } from '@nestjs/elasticsearch'; 
@Module({
 /* imports: [ElasticsearchModule],  */
  controllers: [MeetupController],
  providers: [/*ElasticSearchService,*/MeetupService],
})
export class MeetupModule {}
