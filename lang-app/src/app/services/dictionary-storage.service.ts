import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DictionaryStorageService {
  private dictionarySource = new BehaviorSubject<string[]>(this.loadDictionary());
  currentDictionary = this.dictionarySource.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private loadDictionary(): string[] {
    if (isPlatformBrowser(this.platformId)) {
      const words = localStorage.getItem('dictionary');
      return words ? JSON.parse(words) : [];
    }
    return [];
  }

  getRecentWords(count: number = -1): string[] {
    if (isPlatformBrowser(this.platformId)) {
      const allWords = localStorage.getItem('dictionary');
      const wordsArray = allWords ? JSON.parse(allWords) : [];
      return count === -1 ? wordsArray : wordsArray.slice(-count);
    }
    return [];
  }

  addWord(word: string) {
    if (isPlatformBrowser(this.platformId)) {
      const currentWords = this.dictionarySource.getValue();
      // Проверка на дублирование слов
      if (currentWords.includes(word)) {
        throw new Error('Слово уже существует.');
      }
      // Добавление слова в словарь
      currentWords.push(word);
      localStorage.setItem('dictionary', JSON.stringify(currentWords));
      this.dictionarySource.next(currentWords);
    }
  }
}
