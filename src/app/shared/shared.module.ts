import { NgModule } from '@angular/core';
import { YearsPipe } from './pipes/years.pipe';

const pipes = [YearsPipe];

@NgModule({
  declarations: [...pipes],
  exports: [...pipes],
})
export class SharedModule {}
