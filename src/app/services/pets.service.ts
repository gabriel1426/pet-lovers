import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Image, Pet } from './model/pet.model';
import { forkJoin, map } from 'rxjs';
import { Flag } from './model/flag.model';

@Injectable({
  providedIn: 'root',
})
export class PetsService {
  public flags: Flag[];

  constructor(private http: HttpClient) {}

  getData() {
    this.getFlag();
    return forkJoin({
      catsRequest: this.http
        .get<Pet[]>('https://api.thecatapi.com/v1/breeds')
        .pipe(
          map<Pet[], Pet[]>((res) => {
            res.forEach((item) => (item.type = 'cat'));
            return res;
          })
        ),
      dogsRequest: this.http
        .get<Pet[]>('https://api.thedogapi.com/v1/breeds')
        .pipe(
          map<Pet[], Pet[]>((res) => {
            res.forEach((item) => (item.type = 'dog'));
            return res;
          })
        ),
    });
  }

  gePetImages(id: string, type: string) {
    if (type === 'dog') {
      return this.http.get<Image[]>(
        `https://api.thedogapi.com/v1/images/search?limit=10&breed_ids=${id}`
      );
    }
    return this.http.get<Image[]>(
      `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${id}`
    );
  }

  getFlag() {
    this.http.get<Flag[]>('assets/json/countries.json').subscribe((data) => {
      this.flags = data;
    });
  }
}
