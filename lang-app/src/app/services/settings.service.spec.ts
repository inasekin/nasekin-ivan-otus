import { TestBed } from '@angular/core/testing';
import { SettingsService } from './settings.service';
import { PLATFORM_ID } from '@angular/core';

describe('SettingsService', () => {
  let service: SettingsService;
  const mockPlatformBrowserId = 'browser';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: mockPlatformBrowserId }
      ]
    });
    service = TestBed.inject(SettingsService);
  });

  afterEach(() => {
    localStorage.removeItem('settings');
  });

  it('should load settings from local storage when in the browser', () => {
    localStorage.setItem('settings', JSON.stringify({
      language: 'fr',
      wordsPerExercise: 5,
      exerciseDuration: 2,
    }));

    service['settingsSource'].next(service.loadSettings());

    const settings = service.getSettings();

    expect(settings.language).toEqual('fr');
    expect(settings.wordsPerExercise).toEqual(5);
    expect(settings.exerciseDuration).toEqual(2);
  });

  it('should save settings to local storage when in the browser', () => {
    const newSettings = {
      language: 'es',
      wordsPerExercise: 4,
      exerciseDuration: 3,
    };
    service.saveSettings(newSettings);

    const settingsInLocalStorage = JSON.parse(localStorage.getItem('settings') as string);

    expect(settingsInLocalStorage).toEqual(newSettings);
  });
});
