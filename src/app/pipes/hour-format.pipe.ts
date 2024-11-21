import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hourFormat',
  standalone: true,
})
export class hourFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    const [hourStr, minuteStr] = value.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    const period = hour >= 12 ? 'pm' : 'am';

    if (hour > 12) {
      hour -= 12;
    } else if (hour === 0) {
      hour = 12;
    }

    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minuteStr.padStart(2, '0');

    return `${formattedHour}:${formattedMinute} ${period}`;
  }
}
