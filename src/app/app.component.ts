import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { StorageService } from './core/storage/storage-service';
import {
  ScreenOrientation,
  OrientationType,
} from '@capawesome/capacitor-screen-orientation';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';

register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private storageService: StorageService,
    private platform: Platform
  ) {
    this._initializeApp();
  }

  async _initializeApp() {
    await this.platform.ready();
    await this.storageService.init();
    if (this.platform.is('capacitor')) {
      await StatusBar.setBackgroundColor({ color: '#000000' });
      await StatusBar.setStyle({ style: Style.Dark });
      await ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
    }
  }
}
