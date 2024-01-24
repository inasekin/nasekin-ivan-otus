import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { SettingsComponent } from './settings.component';
import { SettingsService } from "../../services/settings.service";

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let settingsService: SettingsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [{ provide: SettingsService, useValue: mockSettingsService }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    settingsService = TestBed.inject(SettingsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to settings', () => {
    expect(component.settings).toEqual(mockSettings);
  });

  it('should save settings', () => {
    const spy = spyOn(settingsService, 'saveSettings');
    component.saveSettings();
    expect(spy).toHaveBeenCalledWith(mockSettings);
  });

  it('should change language', () => {
    const spy = spyOn(settingsService, 'saveSettings');
    const newLanguage = 'French';
    component.changeLanguage(newLanguage);
    expect(component.settings.language).toBe(newLanguage);
    expect(spy).toHaveBeenCalled();
  });
});

const mockSettings = {
  language: 'English',
};

const mockSettingsService = {
  currentSettings: of(mockSettings),
  saveSettings: (settings: any) => {}
};
