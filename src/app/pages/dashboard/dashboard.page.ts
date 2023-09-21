import { Component, OnInit } from '@angular/core';
import { PetsService } from '../../services/pets.service';
import { Pet } from '../../services/model/pet.model';
import { NavController, Platform } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/providers/nav-controller';
import { StorageService } from '../../core/storage/storage-service';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  private readonly MILLISECONDS = 86400000;

  public petData: Pet[] = [];
  public catsData: Pet[] = [];
  public dogsData: Pet[] = [];

  public data: Pet[] = [];
  public optionSelected = 0;

  public showSaved = false;
  public showLoader = true;

  constructor(
    private petService: PetsService,
    private navController: NavController,
    private storageService: StorageService,
    private platform: Platform
  ) {}

  async ngOnInit() {
    const { cats, dogs, lastRequest } =
      await this.storageService.getMultipleItems<any>([
        'cats',
        'dogs',
        'lastRequest',
      ]);
    const currentDate: any = new Date();
    const lastDate: any = new Date(lastRequest);
    const difference: any = currentDate - lastDate;
    if (cats && dogs && difference < this.MILLISECONDS) {
      this.initValues(cats, dogs);
      return;
    }

    this.petService.getData().subscribe(({ catsRequest, dogsRequest }) => {
      this.storageService.setItem('cats', catsRequest);
      this.storageService.setItem('dogs', dogsRequest);
      this.storageService.setItem('lastRequest', new Date());
      this.initValues(catsRequest, dogsRequest);
    });
  }

  private initValues(cats: Pet[], dogs: Pet[]) {
    this.catsData = cats;
    this.dogsData = dogs;

    this.petData.push(...this.catsData);
    this.petData.push(...this.dogsData);

    this.petData.sort((pet1, pet2) => {
      if (pet1.name > pet2.name) {
        return 1;
      }
      if (pet1.name < pet2.name) {
        return -1;
      }
      return 0;
    });
    this.data = this.petData || [];
    this.showLoader = false;
  }

  async ionViewDidEnter() {
    if (this.platform.is('capacitor')) {
      await StatusBar.setBackgroundColor({ color: '#FFFFFF' });
      await StatusBar.setStyle({ style: Style.Light });
    }

    if (this.showSaved) {
      await this.showFavorites(false);
    }
  }

  changeFilter(option: number) {
    if (this.optionSelected === option) {
      return;
    }
    this.showSaved = false;
    this.showLoader = true;

    this.optionSelected = option;
    const options = {
      0: this.petData,
      1: this.catsData,
      2: this.dogsData,
    }[option];

    setTimeout(() => {
      this.data = options || [];
      this.showLoader = false;
    }, 300);
  }

  async showFavorites(changeList: boolean) {
    const petSaved: Pet[] = await this.storageService.getItem('favorites') || [];
    this.data =
      changeList && !this.showSaved
        ? petSaved
        : !changeList && this.showSaved
        ? petSaved
        : this.petData;
    this.showSaved =
      changeList && !this.showSaved ? true : !changeList && this.showSaved;

    this.optionSelected = 0;
  }

  async goToDetail(pet: Pet) {
    const options: NavigationOptions = {
      queryParams: {
        pet: pet,
      },
    };
    await this.navController.navigateForward('article', options);
  }

  imagenError(event: any, id: string, pet: Pet) {
    id = pet.id === 'ebur' ? 'GI062lGTf' : id;
    let ruta =
      pet.id !== 'mala'
        ? `https://cdn2.thecatapi.com/images/${id}.png`
        : 'https://www.thegreatcat.org/wp-content/uploads/2020/05/Asian-Cat.jpg';
    event.target.src = ruta;
  }
}
