import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http' ;

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor( private http: HttpClient) { }

  connectget(commandurl, header){
    return this.http.get(
      commandurl,
      {headers: header}
    )
  }

  getWeather(body=null){
    const header = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.connectget("https://api.openweathermap.org/data/2.5/weather?q=Brisbane&APPID=bfc18954f0506b5d82f6ca103e7c4a35", body);
  }

  getEntNews(body=null){
    const header = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.connectget("https://newsapi.org/v2/top-headlines?country=au&category=entertainment&apiKey=a1d3907ce1524559ad86b9cbf4177abf", body);
  }

  getTechNews(body=null){
    const header = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.connectget("https://newsapi.org/v2/top-headlines?country=au&category=technology&apiKey=a1d3907ce1524559ad86b9cbf4177abf", body);
  }

  getNews(body=null){
    const header = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.connectget("https://newsapi.org/v2/top-headlines?country=au&apiKey=a1d3907ce1524559ad86b9cbf4177abf", body);
  }
}
