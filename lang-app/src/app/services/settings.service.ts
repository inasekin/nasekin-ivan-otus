import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settingsSource = new BehaviorSubject<any>(this.loadSettings());
  currentSettings = this.settingsSource.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.settingsSource = new BehaviorSubject<any>(this.loadSettings());
  }

  private loadSettings() {
    if (isPlatformBrowser(this.platformId)) {
      const settings = localStorage.getItem('settings');
      return settings ? JSON.parse(settings) : this.getDefaultSettings();
    }
    return {};
  }

  private getDefaultSettings(): any {
    return {
      language: 'en',
      wordsPerExercise: 3,
      exerciseDuration: 1,
    };
  }

  getSettings() {
    return this.settingsSource.getValue();
  }

  saveSettings(newSettings: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('settings', JSON.stringify(newSettings));
      this.settingsSource.next(newSettings);
    }
  }
}
