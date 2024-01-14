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
        this.errorMessage = 'Time\'s up! The test will start again.';
        this.hasErrorOccurred = true; // Установка флага ошибки
        setTimeout(() => this.resetTest(), 2000); // Перезапуск теста через 2 секунды
      }
    }, 1000);
  }
  resetTest() {
    clearInterval(this.timerInterval);
    this.correctAnswersCount = 0;
    this.hasErrorOccurred = false;
    this.currentWordIndex = 0;
    this.remainingTime = this.settings.exerciseDuration; // Сброс времени теста
    this.startTimer();
    this.loadWords();
  }

  ngOnInit() {
    this.settingsService.currentSettings.subscribe(settings => {
      this.settings = settings;
      this.remainingTime = this.settings.exerciseDuration * 60; // Преобразуем минуты в секунды
      this.startTimer();
      this.loadWords();
    });
  }

  getFormattedTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  loadWords() {
    this.words = this.dictionaryStorage.getRecentWords(this.settings.wordsPerExercise);
    this.currentWordIndex = 0; // Сброс индекса при загрузке новых слов
    this.loadNewWord();
  }

  loadNewWord() {
    // Если тест завершен из-за ошибки или истечения времени, не продолжаем дальше
    if (this.hasErrorOccurred) {
      return;
    }

    // Проверяем, остались ли еще слова для теста
    if (this.currentWordIndex < this.words.length) {
      const originalWord = this.words[this.currentWordIndex];
      this.translateService.translateWord(originalWord, 'en', 'ru').subscribe(
        translatedWord => {
          this.currentWordPair = { originalWord, translatedWord };
          this.isCorrect = null;
          this.userTranslation = '';
        },
        error => {
          this.errorMessage = 'Error fetching translation';
        }
      );
    } else {
      // Все слова использованы, завершаем тест
      // Это условие должно выполниться только один раз
      if (!this.hasErrorOccurred && !this.testCompleted) {
        this.testCompleted = true; // Устанавливаем флаг, что тест завершен
        clearInterval(this.timerInterval);
        this.errorMessage = `Test complete! Correct answers: ${this.correctAnswersCount}`;
      }
    }
  }

  checkTranslation() {
    if (this.hasErrorOccurred) {
      return; // Прекращаем обработку, если тест уже завершен
    }

    if (this.userTranslation.trim().toLowerCase() === this.currentWordPair.translatedWord.toLowerCase()) {
      this.correctAnswersCount++;
      this.currentWordIndex++;
      this.loadNewWord();
    } else {
      this.hasErrorOccurred = true;
      clearInterval(this.timerInterval);
      this.errorMessage = 'Translation error! The test will start again.';
      this.resetTest();
    }
  }
}
