import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'truncate'})
export class TruncatePipe implements PipeTransform {
    transform(value: string, length: string): string {
        let length_num = Number(length);

        if (value.length > length_num) {
            value = value.substr(0, length_num - 1);
            return value.substr(0, value.lastIndexOf(' ')) + '&hellip;';
        } else {
            return value;
        }
    }
}
