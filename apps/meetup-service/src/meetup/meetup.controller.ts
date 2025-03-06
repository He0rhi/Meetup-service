import {
  Body,
  Controller,
  Delete,
  Get,
  Res,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiParam,ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Meetup } from '@prisma/client';
import { Response } from 'express';
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
  @ApiResponse({ status: HTTP_STATUS.OK.code, description: HTTP_STATUS.OK.description, type: CreateMeetupDto })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND.code, description: HTTP_STATUS.NOT_FOUND.description })
  async create(@Body() meetupData: CreateMeetupDto): Promise<Meetup> {
    const createdMeetup = await this.meetupService.create(meetupData);
    console.log('Received data:', meetupData);
    return createdMeetup;
  }

  @Get()
  @ApiOperation({ summary: 'Get all meetups' })
  @ApiResponse({ status: HTTP_STATUS.OK.code, description: HTTP_STATUS.OK.description, type: [CreateMeetupDto] })
  async findAll(): Promise<Meetup[]> {
    return this.meetupService.findAll();
  }
 // @Get('/search/:id')
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
  @ApiResponse({ status: HTTP_STATUS.OK.code, description: HTTP_STATUS.OK.description, type: CreateMeetupDto })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND.code, description:HTTP_STATUS.NOT_FOUND.description })
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
  @ApiResponse({ status: HTTP_STATUS.OK.code, description: HTTP_STATUS.OK.description, type: CreateMeetupDto })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND.code, description: HTTP_STATUS.NOT_FOUND.description, })
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
  @ApiResponse({ status:HTTP_STATUS.NO_CONTENT.code, description: HTTP_STATUS.NO_CONTENT.description })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND.code, description: HTTP_STATUS.NOT_FOUND.description })
  async remove(@Param('id') id: string): Promise<void> {
    const meetup = await this.meetupService.findOne(id);
    if (!meetup) {
      throw new NotFoundException(`Meetup with id ${id} not found`);
    }
    await this.meetupService.remove(id);
  }


  @Get('/export/csv')
  @ApiOperation({ summary: 'Export meetups as CSV' })
  @ApiResponse({
    status: HTTP_STATUS.OK.code,
    description: 'CSV file generated and ready for download',
  })
  @ApiResponse({
    status: HTTP_STATUS.NOT_FOUND.code,
    description: HTTP_STATUS.NOT_FOUND.description,
  })
  @ApiResponse({
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR?.code || 500,
    description: 'Failed to generate CSV file',
  })
  async exportCsv(@Res() res: Response) {
    try {
      const filePath = await this.meetupService.generateCsv();
      res.download(filePath);
    } catch (error) {
      console.error('Error generating CSV:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR?.code || 500).send('Failed to generate CSV file');
    }
  }
  
  @Get('/export/pdf')
  @ApiOperation({ summary: 'Export meetups as PDF' })
  @ApiResponse({
    status: HTTP_STATUS.OK.code,
    description: 'PDF file generated and ready for download',
  })
  @ApiResponse({
    status: HTTP_STATUS.NOT_FOUND.code,
    description: HTTP_STATUS.NOT_FOUND.description,
  })
  @ApiResponse({
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR?.code || 500,
    description: 'Failed to generate PDF file',
  })
  async exportPdf(@Res() res: Response) {
    try {
      const filePath = await this.meetupService.generatePdf();
      res.download(filePath);
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR?.code || 500).send('Failed to generate PDF file');
    }
  }
  
}
