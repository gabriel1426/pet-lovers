export abstract class StorageService {
  abstract init(): Promise<any>;
  abstract getItem<T>(key: string): Promise<T>;
  abstract getAllItems(): Promise<any>;
  abstract setItem(key: string, data: any): void;
  abstract deleteItem(key: string): Promise<void>;
  abstract clear(): void;
}
