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
  Headers,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Meetup } from '@prisma/client';
import { Response } from 'express';
import { HTTP_STATUS } from '../constants/http-status';
import { JoiValidationPipe } from '../pipes/joi-validation.pipe';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';

import { CreateMeetupSchema } from './dto/create-meetup.pipe';
import { registrationSchema, loginSchema } from './dto/user.pipe';
import { MeetupService } from './meetup.service';

@ApiTags('meetups')
@Controller('meetups')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @Post('/register')
  @UsePipes(new JoiValidationPipe(registrationSchema))
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: HTTP_STATUS.OK.code, description: HTTP_STATUS.OK.description, type: CreateUserDto })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND.code, description: HTTP_STATUS.NOT_FOUND.description })
  async register(@Body() userData: CreateUserDto) {
    const createdUser = await this.meetupService.register(userData);
    console.log('Registered user:', createdUser);
    return createdUser;
  }

  @Post('/login')
  @UsePipes(new JoiValidationPipe(loginSchema))
  @ApiOperation({ summary: 'Login to account' })
  @ApiResponse({ status: HTTP_STATUS.OK.code, description: HTTP_STATUS.OK.description, type: LoginUserDto })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND.code, description: HTTP_STATUS.NOT_FOUND.description })
  async login(@Body() userData: LoginUserDto) {
    const loggedInUser = await this.meetupService.login(userData);
    console.log('Logged in user:', loggedInUser);
    return loggedInUser;
  }

  @Post()
  @UsePipes(new JoiValidationPipe(CreateMeetupSchema))
  @ApiOperation({ summary: 'Create a new meetup' })
  @ApiResponse({ status: HTTP_STATUS.OK.code, description: HTTP_STATUS.OK.description, type: CreateMeetupDto })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND.code, description: HTTP_STATUS.NOT_FOUND.description })
  async create(@Body() meetupData: CreateMeetupDto, @Headers('authorization') token: string): Promise<Meetup> {
    

    const createdMeetup = await this.meetupService.create(meetupData, token);
    console.log('Created meetup:', createdMeetup);
    return createdMeetup;
  }

  @Get()
  @ApiOperation({ summary: 'Get all meetups' })
  @ApiResponse({ status: HTTP_STATUS.OK.code, description: HTTP_STATUS.OK.description, type: [CreateMeetupDto] })
  async findAll(@Headers('authorization') token: string): Promise<Meetup[]> {
  
    return this.meetupService.findAll(token);
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
    @Headers('authorization') token?: string
  ): Promise<Meetup[]> {
    const searchParams = {
      title,
      tag,
      lat: lat ? Number(lat) : undefined,
      lng: lng ? Number(lng) : undefined,
      radius: radius ? Number(radius) : 100,
    };

    return this.meetupService.search(searchParams, token??'');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a meetup by its ID' })
  @ApiParam({ name: 'id', description: 'Meetup ID', type: 'string' })
  @ApiResponse({ status: HTTP_STATUS.OK.code, description: HTTP_STATUS.OK.description, type: CreateMeetupDto })
  @ApiResponse({ status: HTTP_STATUS.NOT_FOUND.code, description: HTTP_STATUS.NOT_FOUND.description })
  async findOne(@Param('id') id: string, @Headers('authorization') token: string): Promise<Meetup> {
    
    const meetup = await this.meetupService.findOne(id, token);
    if (!meetup) {
      throw new NotFoundException(`Meetup with id ${id} not found`);
    }
    return meetup;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a meetup' })
  @ApiParam({ name: 'id', description: 'Meetup ID', type: 'string' })
  async update(
    @Param('id') id: string,
    @Body() meetupData: CreateMeetupDto,
    @Headers('authorization') token: string,
  ): Promise<Meetup> {
  
    return this.meetupService.update(id, meetupData, token);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a meetup' })
  @ApiParam({ name: 'id', description: 'Meetup ID', type: 'string' })
  async remove(@Param('id') id: string, @Headers('authorization') token: string) {
 
    return this.meetupService.remove(id, token);
  }

  @Get('/report/csv')
  @ApiOperation({ summary: 'Generate CSV report of meetups' })
  async generateCsv(@Headers('authorization') token: string, @Res() res: Response) {
  
    const filePath = await this.meetupService.generateCsv(token);
    res.download(filePath);
  }

  @Get('/report/pdf')
  @ApiOperation({ summary: 'Generate PDF report of meetups' })
  async generatePdf(@Headers('authorization') token: string, @Res() res: Response) {
   
    const filePath = await this.meetupService.generatePdf(token);
    res.download(filePath);
  }
}
