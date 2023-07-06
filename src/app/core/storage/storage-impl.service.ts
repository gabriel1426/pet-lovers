import { Injectable } from '@angular/core';
import { StorageService } from './storage-service';
import { Storage } from '@ionic/storage-angular';
import { Pet } from '../../services/model/pet.model';

@Injectable()
export class StorageImplService extends StorageService {
  private _storage: Storage | null = null;
  constructor(private storage: Storage) {
    super();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async setItem(key: string, data: any): Promise<void> {
    await this._storage?.set(key, data);
  }

  async clear(): Promise<void> {
    await this._storage?.clear();
  }

  async deleteItem(key: string): Promise<void> {
    await this._storage?.remove(key);
  }

  async getItem<T>(key: string): Promise<T> {
    const dbKey = await this.storage?.get(key);
    return !dbKey ? null : dbKey;
  }

  async getAllItems(): Promise<any> {
    const data: any = [];
    this._storage?.forEach((value) => {
      data.push(value);
    });

    return data;
  }
}
