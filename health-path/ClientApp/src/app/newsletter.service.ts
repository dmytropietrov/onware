import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, of, throwError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {

  private readonly newsletterUrl: string;

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.newsletterUrl = baseUrl + "api/newsletter";
  }

  subscribe(email: string) {
    var emailWithIgnoredPeriods;
    var nameOfEmail = email.substring(0, email.indexOf("@"));
    var domen = email.substring(email.indexOf("@"),email.length);
    if (domen === "@gmail.com") {
      emailWithIgnoredPeriods = nameOfEmail.replace(/\./g, "") + domen;
    } else {
      emailWithIgnoredPeriods = nameOfEmail + domen;
    }
    return this.http.post(this.newsletterUrl, "", { "params" : {"Email": emailWithIgnoredPeriods}})
      .pipe(
        map(_ => true),
        catchError((err: HttpErrorResponse) => {
          if (err.status == 409) {
            return of(false);
          } else {
            return throwError(() => new Error("Failed to sign up to newsletter; try again later"));
          }
        })
      );
  }
}
