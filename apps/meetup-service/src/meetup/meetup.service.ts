import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateMeetupDto } from './dto/create-meetup.dto';

export interface Meetup {
  id: string;
  title: string;
  date: string;
  location: string;
}

@Injectable()
export class MeetupService {
  private prisma = new PrismaClient();

  async create(meetupData: CreateMeetupDto) {
    return this.prisma.meetup.create({
      data: {
        title: meetupData.title,
        location: meetupData.location,
        date: meetupData.date, 
      },
    });
  }
  
  

  async findAll() {
    return this.prisma.meetup.findMany();
  }

  async findOne(id: string) {
    return this.prisma.meetup.findUnique({ where: { id } });
  }

  async remove(id: string) {
    return this.prisma.meetup.delete({ where: { id } });
  }
  async update(id: string, meetupData: CreateMeetupDto) {
    return this.prisma.meetup.update({ where: { id }, data:{
      ...meetupData,
      date: meetupData.date ? new Date(meetupData.date).toISOString() : undefined,
    }, });
  }
}
