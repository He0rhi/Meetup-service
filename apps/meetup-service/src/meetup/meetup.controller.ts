import { Controller, Get, Post, Body, Param, Delete, UsePipes, Patch } from '@nestjs/common';
import { MeetupService, Meetup } from './meetup.service';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { CreateMeetupSchema } from './dto/create-meetup.pipe';
import { JoiValidationPipe } from '../pipes/joi-validation.pipe';
import { NotFoundException } from '@nestjs/common';
//import { ElasticSearchService } from './elastic/elastic.service';
@Controller('meetups')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService/*,    private readonly elasticSearchService: ElasticSearchService*/) {}


  @Post()
  @UsePipes(new JoiValidationPipe(CreateMeetupSchema))
  async create(@Body() meetupData: CreateMeetupDto): Promise<Meetup> {
    const createdMeetup = await this.meetupService.create(meetupData);

  console.log('Received data:', meetupData); 
  /*await this.elasticSearchService.indexDocument('meetups',createdMeetup.id, meetupData);*/
  return createdMeetup;
  }


  @Get()
  async findAll(): Promise<Meetup[]> {  
    return this.meetupService.findAll();
  }


  @Get(':id')
async findOne(@Param('id') id: string): Promise<Meetup> {
  const meetup = await this.meetupService.findOne(id);
  if (!meetup) {
    throw new NotFoundException(`Meetup with id ${id} not found`);
  }
  return meetup;
}

@Patch(":id")
async update(@Param('id') id:string, @Body() meetupData: CreateMeetupDto): Promise<Meetup>{
  const updatedMeetup = await this.meetupService.update(id, meetupData);
  if(!updatedMeetup){
    throw new NotFoundException(`Meetup with id ${id} not found`);
  }
  return updatedMeetup;
}
  /*
  @Get('/search/:query')
  async searchMeetups(@Param('query') query:string){
    return this.elasticSearchService.search('meetups', {match:{title:query}})
  }
*/
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {  
   const meetup = await this.meetupService.remove(id);
   if(!meetup){
    throw new NotFoundException(`Meetup with id ${id} not found`);

   }
  }
}
