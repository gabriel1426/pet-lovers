import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private navController: NavController) {}

  async ionViewDidEnter() {
    await SplashScreen.hide();
  }

  goToDashboard() {
    this.navController.navigateRoot('dashboard');
  }
}
