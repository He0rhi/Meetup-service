import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any) {
    console.log('Received value:', value);
    const { error, value: validatedValue } = this.schema.validate(value, { abortEarly: false });

    if (error) {
      console.log('Validation Errors:', error.details);
      throw new BadRequestException(error.details.map(err => err.message).join(', '));
    }

    return validatedValue;
  }
}
