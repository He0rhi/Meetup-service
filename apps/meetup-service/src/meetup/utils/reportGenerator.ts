import PDFDocument from 'pdfkit';
import { createObjectCsvWriter } from 'csv-writer';
import * as fs from 'fs';
import * as path from 'path';

interface Meetup {
  id: string;
  title: string;
  date: string;
  lat: number;
  lng: number;
  tags: { name: string }[];
}

const reportsDir = path.join(__dirname, '../reports');

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

export async function generateCsv(meetups: Meetup[]): Promise<string> {
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

export async function generatePdf(meetups: Meetup[]): Promise<string> {
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
