import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';

import { RecentlyAddedComponent } from './recently-added.component';
import { DictionaryStorageService } from "../../services/dictionary-storage.service";

describe('RecentlyAddedComponent', () => {
  let component: RecentlyAddedComponent;
  let fixture: ComponentFixture<RecentlyAddedComponent>;
  let dictionaryStorageService: DictionaryStorageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule],
      providers: [{ provide: DictionaryStorageService, useValue: mockDictionaryStorageService }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RecentlyAddedComponent);
    component = fixture.componentInstance;
    dictionaryStorageService = TestBed.inject(DictionaryStorageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

const mockDictionaryStorageService = {
  currentDictionary: of(['testWord1', 'testWord2']),
  addWord: () => {},
  getRecentWords: () => ['testWord1', 'testWord2']
};
