import { Module } from '@nestjs/common';

//import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { MeetupModule } from './meetup/meetup.module';

@Module({
  imports: [
   /* ElasticsearchModule.register({
      node: 'http://localhost:9200',  
    }),*/
    MeetupModule,
  ],
})
export class AppModule {}
