import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from './storage/storage-service';
import { StorageImplService } from './storage/storage-impl.service';

@NgModule({
  declarations: [],
  providers: [
    {
      provide: StorageService,
      useClass: StorageImplService,
    },
  ],
  imports: [CommonModule],
})
export class CoreModule {}
