import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Image, Pet } from './model/pet.model';
import { forkJoin, map } from 'rxjs';
import { Flag } from './model/flag.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PetsService {
  public flags: Flag[];

  constructor(private http: HttpClient) {
    this.getFlag();
  }

  getData() {
    this.getFlag();
    const header = new HttpHeaders({ 'x-api-key': environment.apiKey });
    return forkJoin({
      catsRequest: this.http
        .get<Pet[]>('https://api.thecatapi.com/v1/breeds', { headers: header })
        .pipe(
          map<Pet[], Pet[]>((res) => {
            res.forEach((item) => (item.type = 'cat'));
            return res;
          })
        ),
      dogsRequest: this.http
        .get<Pet[]>('https://api.thedogapi.com/v1/breeds', { headers: header })
        .pipe(
          map<Pet[], Pet[]>((res) => {
            res.forEach((item) => (item.type = 'dog'));
            return res;
          })
        ),
    });
  }

  gePetImages(id: string, type: string) {
    const header = new HttpHeaders({ 'x-api-key': environment.apiKey });
    if (type === 'dog') {
      return this.http.get<Image[]>(
        `https://api.thedogapi.com/v1/images/search?limit=10&breed_ids=${id}`, { headers: header }
      );
    }
    return this.http.get<Image[]>(
      `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${id}`, { headers: header }
    );
  }

  getFlag() {
    this.http.get<Flag[]>('assets/json/countries.json').subscribe((data) => {
      this.flags = data;
    });
  }
}
