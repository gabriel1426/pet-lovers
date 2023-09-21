import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import { Image, Pet } from '../../services/model/pet.model';
import { PetsService } from '../../services/pets.service';
import { OriginsModel } from './model/origins.model';
import { CharacteristicsModel } from './model/characteristics.model';
import { ActionSheetController } from '@ionic/angular';
import { ActionSheetButton } from '@ionic/core/dist/types/components/action-sheet/action-sheet-interface';
import { StorageService } from '../../core/storage/storage-service';

@Component({
  selector: 'app-article',
  templateUrl: './article.page.html',
  styleUrls: ['./article.page.scss'],
})
export class ArticlePage implements OnInit, AfterViewInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('divFacts') factsContainer!: ElementRef;

  public pet: Pet;
  public isFavorite = false;
  public images: Image[];
  public facts: string[];
  public origins: OriginsModel[] = [];
  public characteristics: CharacteristicsModel[] = [];
  public buttons: ActionSheetButton[] = [];
  private favorites: Pet[] = []

  constructor(
    private readonly route: ActivatedRoute,
    private navControl: NavController,
    private petService: PetsService,
    private actionSheetCtrl: ActionSheetController,
    private storage: StorageService
  ) {
    this.route?.queryParams.subscribe( (params) => {
      this.pet = params['pet'];
    });
  }

  private headerEffect() {
    const header = document.getElementById('header');
    const bridgeHeader = document.getElementById('bridge-header');
    this.content.ionScroll.subscribe((event) => {
      const opacity = event.detail.currentY / 100; // Cambia 200 según tus necesidades
      const limitedOpacity = Math.min(1, Math.max(0, opacity));
      header!.style.backgroundColor = `rgba(255, 255, 255, ${limitedOpacity})`;
      bridgeHeader!.style.backgroundColor = `rgba(255, 255, 255, ${limitedOpacity})`;
    });
  }

  async ngOnInit() {
    this.getFacts();
    this.getCharacteristics();
    this.getWebs();
    this.favorites = await this.storage.getItem<Pet[]>('favorites') || [];
    console.log(this.favorites)
    console.log(this.pet)
    this.isFavorite = !!this.favorites.find((elemento) => elemento.id === this.pet.id)

  }

  ngAfterViewInit(): void {
    const childDivs = this.factsContainer.nativeElement.querySelectorAll('div');
    childDivs.forEach((div: HTMLElement) => {
      div.style.background = this.getRandomColor();
    });
    this.headerEffect();
  }

  goBack() {
    this.navControl.pop();
  }

  async saveFavorite() {
    if (!this.isFavorite) {
      this.favorites.push(this.pet)
    } else {
      this.favorites = this.favorites.filter((elemento) => elemento.id !== this.pet.id);
    }
    await this.storage.setItem('favorites', this.favorites);
    this.isFavorite = !this.isFavorite;
  }

  getFacts() {
    const data = this.pet.temperament;
    this.facts = data?.split(', ');

    if (this.pet.origin) {
      this.pet.origin?.split(', ').forEach((item) => {
        const flag = this.petService?.flags.filter(
          (code) => code.country === item
        );
        this.origins.push({ name: item, flag: flag[0]?.code });
      });
    }
  }

  private getRandomColor() {
    const h = Math.floor(Math.random() * 360);
    return `hsl(${h}deg, 100%, 90%)`;
  }

  private getCharacteristics() {
    if (this.pet.affection_level) {
      this.characteristics.push({
        name: 'Affection Level',
        value: (this.pet.affection_level / 10) * 2,
      });
    }

    if (this.pet.adaptability) {
      this.characteristics.push({
        name: 'Adaptability',
        value: (this.pet.adaptability / 10) * 2,
      });
    }

    if (this.pet.child_friendly) {
      this.characteristics.push({
        name: 'Child Friendly',
        value: (this.pet.child_friendly / 10) * 2,
      });
    }

    if (this.pet.dog_friendly) {
      this.characteristics.push({
        name: 'Dog Friendly',
        value: (this.pet.dog_friendly / 10) * 2,
      });
    }

    if (this.pet.energy_level) {
      this.characteristics.push({
        name: 'Energy Level',
        value: (this.pet.energy_level / 10) * 2,
      });
    }

    if (this.pet.grooming) {
      this.characteristics.push({
        name: 'Grooming',
        value: (this.pet.grooming / 10) * 2,
      });
    }

    if (this.pet.health_issues) {
      this.characteristics.push({
        name: 'Health Issues',
        value: (this.pet.health_issues / 10) * 2,
      });
    }

    if (this.pet.intelligence) {
      this.characteristics.push({
        name: 'Intelligence',
        value: (this.pet.intelligence / 10) * 2,
      });
    }

    if (this.pet.shedding_level) {
      this.characteristics.push({
        name: 'Shedding Level',
        value: (this.pet.shedding_level / 10) * 2,
      });
    }

    if (this.pet.social_needs) {
      this.characteristics.push({
        name: 'Social Needs',
        value: (this.pet.social_needs / 10) * 2,
      });
    }

    if (this.pet.stranger_friendly) {
      this.characteristics.push({
        name: 'Stranger Friendly',
        value: (this.pet.stranger_friendly / 10) * 2,
      });
    }

    if (this.pet.vocalisation) {
      this.characteristics.push({
        name: 'Vocalisation',
        value: (this.pet.vocalisation / 10) * 2,
      });
    }
  }

  private getWebs() {
    if (this.pet.wikipedia_url) {
      this.buttons.push({
        text: 'Wikipedia',
        handler: () => {
          this.goTo(this.pet.wikipedia_url);
        },
      });
    }

    if (this.pet.vetstreet_url) {
      this.buttons.push({
        text: 'Vet Street',
        handler: () => {
          this.goTo(this.pet.vetstreet_url);
        },
      });
    }

    if (this.pet.vcahospitals_url) {
      this.buttons.push({
        text: 'VCA Animal Hospital',
        handler: () => {
          this.goTo(this.pet.vcahospitals_url);
        },
      });
    }

    this.buttons.push({
      text: 'Cancel',
      data: {
        action: 'cancel',
      },
    });
  }

  async nowMore() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'More Information',
      buttons: this.buttons,
    });

    await actionSheet.present();
  }

  goTo(url: string) {
    window.open(url, '_system', 'location=yes');
  }
}
