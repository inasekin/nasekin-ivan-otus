import { Component } from '@angular/core';
import {DictionaryStorageService} from "../../services/dictionary-storage.service";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-recently-added',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './recently-added.component.html',
  styleUrl: './recently-added.component.scss'
})
export class RecentlyAddedComponent {
  newWord: string = '';
  words: string[] = [];

  constructor(private dictionaryStorage: DictionaryStorageService) {
    this.dictionaryStorage.currentDictionary.subscribe(words => {
      this.words = words;
    });
  }

  addWord() {
    if (this.newWord.trim() !== '') {
      this.dictionaryStorage.addWord(this.newWord);
      this.words = this.dictionaryStorage.getRecentWords();
      this.newWord = '';
    }
  }
}
