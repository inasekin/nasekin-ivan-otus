import { TestBed } from '@angular/core/testing';
import { TranslateService } from './translate.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('TranslateService', () => {
  let service: TranslateService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
    });
    service = TestBed.inject(TranslateService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should translate a word correctly', (done) => {
    const testWord = 'hello';
    const fromLang = 'en';
    const toLang = 'es';
    const translatedWord = 'hola';

    service.translateWord(testWord, fromLang, toLang).subscribe(response => {
      expect(response).toEqual(translatedWord);
      done();
    });

    const req = httpTestingController.expectOne('https://libretranslate.de/translate');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ q: testWord, source: fromLang, target: toLang, format: 'text' });
    req.flush({ translatedText: translatedWord });
  });

  it('should handle translation error', (done) => {
    const testWord = 'hello';
    const fromLang = 'en';
    const toLang = 'es';

    service.translateWord(testWord, fromLang, toLang).subscribe(response => {
      expect(response).toEqual('Translation Error');
      done();
    });

    const req = httpTestingController.expectOne('https://libretranslate.de/translate');
    req.error(new ErrorEvent('Network error'), { status: 500 });
  });
});
