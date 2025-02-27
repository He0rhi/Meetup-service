import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { CreateMeetupDto } from './dto/create-meetup.dto';

@Injectable()
export class MeetupService {
  private prisma = new PrismaClient();

  // Создание митапа
  async create(meetupData: CreateMeetupDto) {
    const { tags, ...meetupInfo } = meetupData;

    const createdMeetup = await this.prisma.meetup.create({
      data: {
        ...meetupInfo,
        date: new Date(meetupData.date).toISOString(),
        tags: {
          connectOrCreate: tags?.map(tag => ({
            where: { name: tag },
            create: { name: tag },
          })) || [],
        },
      },
      include: { tags: true },
    });

    return createdMeetup;
  }

  // Получение всех митапов
  async findAll() {
    return this.prisma.meetup.findMany({
      include: { tags: true },
    });
  }

  // Поиск по параметрам
  async search(searchParams: { title?: string; tag?: string; lat?: number; lng?: number; radius?: number }) {
    const { title, tag, lat, lng, radius = 100 } = searchParams;

    const radiusInDegreesLat = radius / 111.32;
    const radiusInDegreesLng = radius / (111.32 * Math.cos((lat ?? 0) * Math.PI / 180));

    return this.prisma.meetup.findMany({
      where: {
        AND: [
          title ? { title: { contains: title, mode: 'insensitive' } } : {},
          tag ? { tags: { some: { name: { equals: tag, mode: 'insensitive' } } } } : {},
          lat !== undefined && lng !== undefined
            ? {
                lat: { gte: lat - radiusInDegreesLat, lte: lat + radiusInDegreesLat },
                lng: { gte: lng - radiusInDegreesLng, lte: lng + radiusInDegreesLng },
              }
            : {},
        ],
      },
      include: { tags: true },
    });
  }

  // Получение митапа по id
  async findOne(id: string) {
    return this.prisma.meetup.findUnique({
      where: { id },
      include: { tags: true },
    });
  }

  // Обновление митапа
  async update(id: string, meetupData: CreateMeetupDto) {
    const { tags, ...meetupInfo } = meetupData;

    return this.prisma.meetup.update({
      where: { id },
      data: {
        ...meetupInfo,
        date: meetupData.date ? new Date(meetupData.date).toISOString() : undefined,
        tags: {
          // Очищаем старые связи через промежуточную модель
          set: [], // очищаем старые связи
          connectOrCreate: tags?.map(tag => ({
            where: { name: tag },
            create: { name: tag },
          })) || [],
        },
      },
      include: { tags: true },
    });
  }

  // Удаление митапа
  async remove(id: string) {
    return this.prisma.meetup.delete({
      where: { id },
    });
  }
}
