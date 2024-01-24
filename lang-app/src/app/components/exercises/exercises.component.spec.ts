import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { ExercisesComponent } from './exercises.component';
import { DictionaryStorageService } from "../../services/dictionary-storage.service";
import { TranslateService } from "../../services/translate.service";
import { SettingsService } from "../../services/settings.service";
import { of } from 'rxjs';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('ExercisesComponent', () => {
  let component: ExercisesComponent;
  let fixture: ComponentFixture<ExercisesComponent>;
  let dictionaryStorageServiceMock: any;
  let translateServiceMock: any;
  let settingsServiceMock: any;

  beforeEach(async () => {
    // Определение моков для сервисов
    dictionaryStorageServiceMock = {
      getRecentWords: jasmine.createSpy('getRecentWords').and.returnValue(['word1', 'word2', 'word3']),
    };
    translateServiceMock = {
      translateWord: jasmine.createSpy('translateWord').and.returnValue(of('translatedWord')),
    };
    settingsServiceMock = {
      currentSettings: of({
        exerciseDuration: 1,
        wordsPerExercise: 3,
        language: 'en'
      }),
    };

    await TestBed.configureTestingModule({
      imports: [
        ExercisesComponent, // Добавляем компонент в imports
        HttpClientTestingModule
      ],
      providers: [
        { provide: DictionaryStorageService, useValue: dictionaryStorageServiceMock },
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: SettingsService, useValue: settingsServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExercisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load new word correctly', () => {
    component.loadNewWord();
    expect(component.words.includes(component.currentWordPair.originalWord)).toBeTrue();
  });

  it('should initialize with default values', () => {
    expect(component.currentWordIndex).toBe(0);
    expect(component.correctAnswersCount).toBe(0);
    expect(component.testCompleted).toBeFalse();
    expect(component.hasErrorOccurred).toBeFalse();
  });

  it('should reset test correctly', () => {
    component.resetTest();
    expect(component.currentWordIndex).toBe(0);
    expect(component.correctAnswersCount).toBe(0);
    expect(component.testCompleted).toBeFalse();
    expect(component.hasErrorOccurred).toBeFalse();
    expect(component.words.length).toBeGreaterThan(0);
  });
});
