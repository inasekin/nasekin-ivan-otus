import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  constructor(private http: HttpClient) {}

  translateWord(word: string, from: string, to: string): Observable<string> {
    const url = 'https://libretranslate.de/translate';
    const body = { q: word, source: from, target: to, format: 'text' };

    return this.http.post<any>(url, body).pipe(
      map(response => response.translatedText),
      catchError(() => of('Translation Error'))
    );
  }
}
