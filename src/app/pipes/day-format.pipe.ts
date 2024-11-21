import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayFormat',
  standalone: true,
})
export class DayFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    const [day, month, year] = value.split('/');
    if (!day || !month || !year) {
      console.error('Formato de fecha inválido: ', value);
      return value;
    }

    return `${year}-${month}-${day}`;
  }
}
