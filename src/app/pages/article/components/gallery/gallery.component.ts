import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Image } from '../../../../services/model/pet.model';
import { PetsService } from '../../../../services/pets.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit, OnChanges {
  @Input() breed: string;
  @Input() type: string;

  public showPagination = true;
  public images: Image[];

  public bulletActive = 1;
  constructor(
    private changeDetector: ChangeDetectorRef,
    private petService: PetsService
  ) {}

  ngOnInit() {
    const swiperEl = document.querySelector('swiper-container');

    this.petService.gePetImages(this.breed, this.type).subscribe((data) => {
      this.images = data;
      this.initSwiper();
    });
  }

  initSwiper() {
    const swiperEl = document.querySelector('swiper-container');

    // swiper parameters
    const swiperParams = {
      virtual: {
        // virtual slides
        slides: this.setSlides(),
      },
    };

    swiperEl?.addEventListener('swiper-slidechange', (event) => {
      const [swiper] = (event as any).detail;
      this.bulletActive = swiper.activeIndex === 0 ? 1 : swiper.isEnd ? 3 : 2;
      this.changeDetector.detectChanges();
    });

    // assign all parameters to Swiper element
    Object.assign(swiperEl as any, swiperParams);

    // and now initialize it
    (swiperEl as any).initialize();
  }

  setSlides() {
    const slides: string[] = [];
    this.showPagination = this.images?.length > 1;
    this.images.forEach((item) => {
      slides.push(
        `<img class="article__image" src="${item.url}" style="width: 100%; height:100%; border-radius: 32px"/>`
      );
    });
    return slides;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.changeDetector.detectChanges();
  }

  test() {
    console.log('test');
  }
}
