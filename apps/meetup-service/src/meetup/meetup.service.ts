import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateMeetupDto } from './dto/create-meetup.dto';
import PDFDocument from 'pdfkit';
import { createObjectCsvWriter } from 'csv-writer';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class MeetupService {
  
  private prisma = new PrismaClient();


async generateCsv(): Promise<string> {
  const meetups = await this.findAll();

  const reportsDir = path.join(__dirname, '../reports');
  
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const csvWriter = createObjectCsvWriter({
    path: path.join(reportsDir, 'meetups.csv'),
    header: [
      { id: 'id', title: 'ID' },
      { id: 'title', title: 'Title' },
      { id: 'date', title: 'Date' },
      { id: 'lat', title: 'Latitude' },
      { id: 'lng', title: 'Longitude' },
      { id: 'tags', title: 'Tags' },
    ],
  });

  const records = meetups.map(meetup => ({
    id: meetup.id,
    title: meetup.title,
    date: meetup.date,
    lat: meetup.lat,
    lng: meetup.lng,
    tags: meetup.tags.map(tag => tag.name).join(', '),
  }));

  await csvWriter.writeRecords(records);

  return path.join(reportsDir, 'meetups.csv');
}

async generatePdf(): Promise<string> {
  const meetups = await this.findAll();
  const reportsDir = path.join(__dirname, '../reports');

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const filePath = path.join(reportsDir, 'meetups.pdf');
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text('Available Meetups', { align: 'center' });

  meetups.forEach(meetup => {
    doc
      .moveDown()
      .fontSize(14)
      .text(`Title: ${meetup.title}`)
      .text(`Date: ${meetup.date}`)
      .text(`Location: ${meetup.lat}, ${meetup.lng}`)
      .text(`Tags: ${meetup.tags.map(tag => tag.name).join(', ')}`);
  });

  doc.end();

  return filePath;
}

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


  async findAll() {
    return this.prisma.meetup.findMany({
      include: { tags: true },
    });
  }async search(searchParams: { title?: string; tag?: string; lat?: number; lng?: number; radius?: number }) {
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
  
    if (lat !== undefined && lng !== undefined && radius !== undefined) {
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
  

  async findOne(id: string) {
    return this.prisma.meetup.findUnique({
      where: { id },
      include: { tags: true },
    });
  }

  async update(id: string, meetupData: CreateMeetupDto) {
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

  async remove(id: string) {
    return this.prisma.meetup.delete({
      where: { id },
    });
  }
}
