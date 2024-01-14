import { Component } from '@angular/core';
import {SettingsService} from "../../services/settings.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  settings: any;

  constructor(private settingsService: SettingsService) {
    this.settings = this.settingsService.getSettings();
  }

  saveSettings() {
    this.settingsService.saveSettings(this.settings);
  }
}
