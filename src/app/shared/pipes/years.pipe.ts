import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'years',
})
export class YearsPipe implements PipeTransform {
  transform(value: string): any {
    const hasYears = value.includes('years');
    return hasYears ? value : value + 'years';
  }
}
