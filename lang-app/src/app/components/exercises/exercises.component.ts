import {Component, OnInit} from '@angular/core';
import {TranslateService} from "../../services/translate.service";
import {FormsModule} from "@angular/forms";
import {DictionaryStorageService} from "../../services/dictionary-storage.service";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {SettingsService} from "../../services/settings.service";

interface WordPair {
  originalWord: string;
  translatedWord: string;
}

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.scss'
})
export class ExercisesComponent implements OnInit {
  currentWordPair!: WordPair;
  userTranslation: string = '';
  isCorrect: boolean | null = null;
  errorMessage: string = '';
  settings: any;
  words: string[] = [];
  currentWordIndex: number = 0;
  correctAnswersCount = 0;
  hasErrorOccurred = false;
  remainingTime: number = 0;
  timerInterval: any;
  testCompleted = false;

  constructor(
    private dictionaryStorage: DictionaryStorageService,
    private translateService: TranslateService,
    private settingsService: SettingsService
  ) {}

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.errorMessage = 'Time\'s up! The test will start again.';
        this.testCompleted = true; // Указываем, что тест завершен
        this.hasErrorOccurred = true;
        setTimeout(() => this.resetTest(), 2000); // Перезапуск теста через 2 секунды
      }
    }, 1000);
  }
  resetTest() {
    if (this.settings && this.settings.exerciseDuration) {
      this.testCompleted = false;
      this.hasErrorOccurred = false;
      this.correctAnswersCount = 0;
      this.currentWordIndex = 0;
      this.remainingTime = this.settings.exerciseDuration * 60; // Установить оставшееся время
      this.loadWords(); // Загрузить новые слова
      this.startTimer(); // Запустить таймер заново
    }
  }

  ngOnInit() {
    this.settingsService.currentSettings.subscribe(settings => {
      this.settings = settings;
      this.remainingTime = this.settings.exerciseDuration * 60; // Установить оставшееся время
      this.resetTest(); // Сбросить тест с новыми настройками
    });
  }

  getFormattedTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  loadWords() {
    let words = this.dictionaryStorage.getRecentWords(this.settings.wordsPerExercise);
    // Перемешивание массива слов для получения случайного порядка
    this.words = this.shuffleArray(words);
    this.currentWordIndex = 0; // Сброс индекса при загрузке новых слов
    this.loadNewWord();
  }

  // Вспомогательный метод для перемешивания массива
  private shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  loadNewWord() {
    // Если тест завершен из-за ошибки или истечения времени, не продолжаем дальше
    if (this.hasErrorOccurred || this.testCompleted) {
      return;
    }
    // Сброс сообщения об ошибке перед загрузкой нового слова
    this.testCompleted = false;
    this.errorMessage = '';
    const sourceLanguage = this.settings.language;
    const targetLanguage = sourceLanguage === 'en' ? 'ru' : 'en'; // Переключаемся между английским и русским

    // Проверяем, остались ли еще слова для теста
    if (this.currentWordIndex < this.words.length) {
      const originalWord = this.words[this.currentWordIndex];
      this.translateService.translateWord(originalWord, sourceLanguage, targetLanguage).subscribe(
        translatedWord => {
          this.currentWordPair = { originalWord, translatedWord };
          this.isCorrect = null;
          this.userTranslation = '';
        },
        error => {
          this.errorMessage = 'Error fetching translation';
          this.hasErrorOccurred = true;
          clearInterval(this.timerInterval);
        }
      );
    } else {
      // Все слова использованы, завершаем тест
      this.finishTest();
    }
  }

  finishTest() {
    // Установка флага завершения теста и вывод сообщения о завершении
    this.testCompleted = true;
    this.errorMessage = `Test complete! Correct answers: ${this.correctAnswersCount}`;
    clearInterval(this.timerInterval); // Останавливаем таймер, тест завершен
  }

  checkTranslation() {
    if (this.hasErrorOccurred || this.testCompleted) {
      return; // Если тест завершен или произошла ошибка, выходим из функции
    }

    if (this.userTranslation.trim().toLowerCase() === this.currentWordPair.translatedWord.toLowerCase()) {
      this.correctAnswersCount++;
      this.errorMessage = ''; // Очищаем сообщение об ошибке при правильном ответе
    } else {
      this.errorMessage = 'Incorrect translation. Try again.';
      this.hasErrorOccurred = true; // Флаг ошибки для блокировки дальнейших попыток
    }

    this.currentWordIndex++;
    if (this.currentWordIndex >= this.words.length) {
      this.finishTest(); // Если слова закончились, завершаем тест
    } else {
      this.loadNewWord(); // Загружаем новое слово
    }
  }
}
