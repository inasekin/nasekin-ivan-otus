import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { DictionaryStorageService } from './dictionary-storage.service';

describe('DictionaryStorageService', () => {
  let service: DictionaryStorageService;
  let getItemSpy: jasmine.Spy;
  let setItemSpy: jasmine.Spy;

  beforeEach(() => {
    getItemSpy = spyOn(localStorage, 'getItem').and.callFake(() => JSON.stringify(['word1', 'word2']));
    setItemSpy = spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      getItemSpy.and.returnValue(value); // Update the getItem spy to return the new value
    });

    TestBed.configureTestingModule({
      providers: [
        DictionaryStorageService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(DictionaryStorageService);
  });

  it('should add a word and update internal state and localStorage', () => {
    service.addWord('word3');
    expect(setItemSpy).toHaveBeenCalledWith('dictionary', JSON.stringify(['word1', 'word2', 'word3']));
    expect(service.getRecentWords()).toContain('word3');
  });

  it('should add another word and update internal state and localStorage', () => {
    service.addWord('word4');
    expect(setItemSpy).toHaveBeenCalledWith('dictionary', JSON.stringify(['word1', 'word2', 'word4']));
    expect(service.getRecentWords()).toContain('word4');
  });

  it('should get recent words limited by count', () => {
    service.addWord('word5');
    const recentWords = service.getRecentWords(2);
    expect(recentWords.length).toBe(2);
    expect(recentWords).toContain('word5');
  });
});
