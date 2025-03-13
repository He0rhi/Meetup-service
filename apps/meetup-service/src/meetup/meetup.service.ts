import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { generateCsv, generatePdf } from './utils/reportGenerator';

@Injectable()
export class MeetupService {
  private readonly prisma = new PrismaClient(); 

  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rabbitmq:5672'],
        queue: 'auth_queue',
        queueOptions: {
          durable: true,
        },
      },
    });
  }

   // Универсальный метод авторизации
   private async authorizeUser(token: string) {
    const user = await this.client.send('verify-token', token).toPromise();
    if (!user || !user.userId) {
      throw new Error('Invalid token');
    }
    return user;
  }


  async register(userData: CreateUserDto) {
    const user = await this.client.send('register', userData).toPromise();
    if (!user) {
      throw new Error('Error Registration');
    }

    console.log("Registered user:", user);
    return user;
  }

  async login(userData: LoginUserDto) {
    const user = await this.client.send('login', userData).toPromise();
    if (!user) {
      throw new Error('Error Registration');
    }

    console.log("Logged in user:", user);
    return user;
  }

  async create(meetupData: CreateMeetupDto, token: string) {
    const user = await this.authorizeUser(token);

    const { tags, ...meetupInfo } = meetupData;
    console.log("create: meetup -", meetupData, "; userId -", user.userId);

    const createdMeetup = await this.prisma.meetup.create({
      data: {
        ...meetupInfo,
        date: new Date(meetupData.date).toISOString(),
        userId: user.userId, 
        tags: {
          connectOrCreate: tags?.map(tag => ({
            where: { name: tag },
            create: { name: tag },
          })) || [],
        },
      },
      include: { tags: true },
    });

    console.log("createdMeetup:", createdMeetup);
    return createdMeetup;
  }

  async findAll(token: string) {
    await this.authorizeUser(token);
    return this.prisma.meetup.findMany({
      include: { tags: true },
    });
  }

  async search(searchParams: { title?: string; tag?: string; lat?: number; lng?: number; radius?: number }, token: string) {
    await this.authorizeUser(token);
    const { title, tag, lat, lng, radius = 100 } = searchParams;

    if (title) {
      return this.prisma.meetup.findMany({
        where: { title: { contains: title, mode: 'insensitive' } },
        include: { tags: true },
      });
    }

    if (tag) {
      return this.prisma.meetup.findMany({
        where: { tags: { some: { name: { equals: tag, mode: 'insensitive' } } } },
        include: { tags: true },
      });
    }

    if (lat !== undefined && lng !== undefined) {
      const radiusInDegreesLat = radius / 111.32;
      const radiusInDegreesLng = radius / (111.32 * Math.cos((lat ?? 0) * Math.PI / 180));

      return this.prisma.meetup.findMany({
        where: {
          lat: { gte: lat - radiusInDegreesLat, lte: lat + radiusInDegreesLat },
          lng: { gte: lng - radiusInDegreesLng, lte: lng + radiusInDegreesLng },
        },
        include: { tags: true },
      });
    }

    return [];
  }

  async findOne(id: string, token: string) {
    await this.authorizeUser(token);
    return this.prisma.meetup.findUnique({
      where: { id },
      include: { tags: true },
    });
  }

  async update(id: string, meetupData: CreateMeetupDto, token: string) {
    await this.authorizeUser(token);
    const { tags, ...meetupInfo } = meetupData;

    return this.prisma.meetup.update({
      where: { id },
      data: {
        ...meetupInfo,
        date: meetupData.date ? new Date(meetupData.date).toISOString() : undefined,
        tags: {
          set: [],
          connectOrCreate: tags?.map(tag => ({
            where: { name: tag },
            create: { name: tag },
          })) || [],
        },
      },
      include: { tags: true },
    });
  }

  async remove(id: string, token: string) {
    await this.authorizeUser(token);
    return this.prisma.meetup.delete({
      where: { id },
    });
  }

  async generateCsv(token: string): Promise<string> {
    const meetups = await this.findAll(token);
    const formattedMeetups = meetups.map(meetup => ({
      ...meetup,
      date: meetup.date.toISOString(), // Преобразуем дату в строку
    }));
  
    return generateCsv(formattedMeetups);
  }
  
  async generatePdf(token: string): Promise<string> {
    const meetups = await this.findAll(token);
    const formattedMeetups = meetups.map(meetup => ({
      ...meetup,
      date: meetup.date.toISOString(), // Преобразуем дату в строку
    }));
  
    return generatePdf(formattedMeetups);
  }
  
}
