import { Service } from '@angular/core';

@Service()
export class LocalStorage {
  getItem<T>(key: string): T | null {
    const savedValue = localStorage.getItem(key);
    if (!savedValue) {
      return null;
    }
    return JSON.parse(savedValue) as T;
  }

  setItem<T>(key: string, value: T): void {
   localStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
