import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiParam,ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Meetup } from '@prisma/client';

import { HTTP_STATUS } from '../constants/http-status';
import { JoiValidationPipe } from '../pipes/joi-validation.pipe';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { CreateMeetupSchema } from './dto/create-meetup.pipe';
import { MeetupService } from './meetup.service';

@ApiTags('meetups')
@Controller('meetups')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(CreateMeetupSchema))
  @ApiOperation({ summary: 'Create a new meetup' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Meetup created successfully', type: CreateMeetupDto })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Invalid input data' })
  async create(@Body() meetupData: CreateMeetupDto): Promise<Meetup> {
    const createdMeetup = await this.meetupService.create(meetupData);
    console.log('Received data:', meetupData);
    return createdMeetup;
  }

  @Get()
  @ApiOperation({ summary: 'Get all meetups' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'List of meetups', type: [CreateMeetupDto] })
  async findAll(): Promise<Meetup[]> {
    return this.meetupService.findAll();
  }

  @Get('/search')
  @ApiOperation({ summary: 'Search meetups by parameters' })
  @ApiQuery({ name: 'title', required: false, description: 'Title of the meetup' })
  @ApiQuery({ name: 'tag', required: false, description: 'Tag associated with the meetup' })
  @ApiQuery({ name: 'lat', required: false, description: 'Latitude of the location' })
  @ApiQuery({ name: 'lng', required: false, description: 'Longitude of the location' })
  @ApiQuery({ name: 'radius', required: false, description: 'Search radius in km' })
  async search(
    @Query('title') title?: string,
    @Query('tag') tag?: string,
    @Query('lat') lat?: number,
    @Query('lng') lng?: number,
    @Query('radius') radius?: number,
  ): Promise<Meetup[]> {
    const searchParams = {
      title,
      tag,
      lat: lat ? Number(lat) : undefined,
      lng: lng ? Number(lng) : undefined,
      radius: radius ? Number(radius) : 100,
    };

    if (lat !== undefined && isNaN(lat)) {
      throw new Error('Invalid latitude');
    }
    if (lng !== undefined && isNaN(lng)) {
      throw new Error('Invalid longitude');
    }
    if (radius !== undefined && isNaN(radius)) {
      throw new Error('Invalid radius');
    }

    return this.meetupService.search(searchParams);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a meetup by its ID' })
  @ApiParam({ name: 'id', description: 'Meetup ID', type: 'string' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Meetup found', type: CreateMeetupDto })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Meetup not found' })
  async findOne(@Param('id') id: string): Promise<Meetup> {
    const meetup = await this.meetupService.findOne(id);
    if (!meetup) {
      throw new NotFoundException(`Meetup with id ${id} not found`);
    }
    return meetup;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a meetup' })
  @ApiParam({ name: 'id', description: 'Meetup ID', type: 'string' })
  @ApiResponse({ status: HTTP_STATUS.OK, description: 'Meetup updated', type: CreateMeetupDto })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Meetup not found' })
  async update(
    @Param('id') id: string,
    @Body() meetupData: CreateMeetupDto,
  ): Promise<Meetup> {
    const updatedMeetup = await this.meetupService.update(id, meetupData);
    if (!updatedMeetup) {
      throw new NotFoundException(`Meetup with id ${id} not found`);
    }
    return updatedMeetup;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a meetup' })
  @ApiParam({ name: 'id', description: 'Meetup ID', type: 'string' })
  @ApiResponse({ status:HTTP_STATUS.NO_CONTENT, description: 'Meetup deleted successfully' })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND, description: 'Meetup not found' })
  async remove(@Param('id') id: string): Promise<void> {
    const meetup = await this.meetupService.findOne(id);
    if (!meetup) {
      throw new NotFoundException(`Meetup with id ${id} not found`);
    }
    await this.meetupService.remove(id);
  }
}
