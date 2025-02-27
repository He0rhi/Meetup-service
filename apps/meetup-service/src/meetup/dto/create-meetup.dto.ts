import { ApiProperty } from '@nestjs/swagger';

export class CreateMeetupDto {
  @ApiProperty({ example: 'NestJS Meetup', description: 'The title of the meetup' })
  title: string;

  @ApiProperty({ example: '2025-03-01T15:00:00.000Z', description: 'The date and time of the meetup' })
  date: Date;

  @ApiProperty({ example: 52.5200, description: 'Latitude of the meetup location' })
  lat: number;

  @ApiProperty({ example: 13.4050, description: 'Longitude of the meetup location' })
  lng: number;

  @ApiProperty({ example: ['NestJS', 'Backend'], description: 'Tags associated with the meetup', required: false })
  tags?: string[];
}
