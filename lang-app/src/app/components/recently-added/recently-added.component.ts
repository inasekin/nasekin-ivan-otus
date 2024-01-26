import { Component } from '@angular/core';
import { DictionaryStorageService } from "../../services/dictionary-storage.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-recently-added',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './recently-added.component.html',
  styleUrls: ['./recently-added.component.scss']
})
export class RecentlyAddedComponent {
  newWord: string = '';
  words: string[] = [];
  errorMessage: string = '';

  constructor(private dictionaryStorage: DictionaryStorageService) {
    this.dictionaryStorage.currentDictionary.subscribe(words => {
      this.words = words;
    });
  }

  addWord() {
    this.errorMessage = '';
    if (this.newWord.trim() !== '' && this.isValidWord(this.newWord)) {
      try {
        this.dictionaryStorage.addWord(this.newWord);
        this.words = this.dictionaryStorage.getRecentWords();
        this.newWord = '';
      } catch (error) {
        // Проверяем, является ли ошибка объектом и имеет ли свойство message
        if (error instanceof Error) {
          this.errorMessage = error.message;
        } else {
          // Если ошибка не является объектом Error, выводим общее сообщение
          this.errorMessage = 'Произошла ошибка при добавлении слова.';
        }
      }
    } else {
      this.errorMessage = 'Введите корректное слово.';
    }
  }

  // Вспомогательный метод для проверки валидности слова
  isValidWord(word: string): boolean {
    // Регулярное выражение для проверки, что ввод состоит из одного слова без специальных символов
    return /^[а-яА-ЯёЁa-zA-Z]+$/.test(word);
  }
}
