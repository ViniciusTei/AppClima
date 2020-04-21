import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = 'http://dataservice.accuweather.com/';
  private key: string = 'keckW8GVZx87IJaGNDpQxFMzKopmSYMv';

  constructor(private http: HttpClient) { }

  getCityInfo(latitude: number, longitude: number) : Observable<any> {
    return this.http.get(`${this.baseUrl}locations/v1/cities/geoposition/search?apikey=${this.key}&q=${latitude},${longitude}`)
  }

  getForecast(locationKey: number): Observable<any> {
    return this.http.get(`${this.baseUrl}forecasts/v1/hourly/1hour/${locationKey}?apikey=${this.key}&language=pt-br`)
  }

  getForecastDaily(locationKey: number): Observable<any> {
    return this.http.get(`${this.baseUrl}forecasts/v1/daily/1day/${locationKey}?apikey=${this.key}&language=pt-br`)
  }

  getCityByName(city: string): Observable<any> {
    return this.http.get(`${this.baseUrl}locations/v1/cities/search?apikey=${this.key}&q=${city}`)
  }
}
