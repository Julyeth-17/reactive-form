import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of, Observable, tap } from 'rxjs';
import { delay, map, catchError } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class EmailValidationService {

  url = 'http://localhost:3000/email'

  constructor( private http: HttpClient) {}

  getEmail(): Observable<any[]> {
    return this.http.get<any[]>(this.url).pipe(
      tap((data: any) => console.log('Datos recibidos:', data)),
      catchError(error => {
        console.error('Error en la solicitud:', error);
        return of([]);
      })
    );
  }

  validateEmail(email: string): Observable<{ [key: string]: boolean } | null> {
    return this.getEmail().pipe(
      delay(500),
      map((emails) => {
        const isEmailTaken = emails.some(e => e.email === email);
        return isEmailTaken ? { emailTaken: true } : null;
      }),
      catchError(() => of(null))
    );
  }
}
