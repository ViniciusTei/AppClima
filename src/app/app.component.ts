import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title: string = 'App Clima';
  public temperatura: string = '';
  public subtitle: string = '';
  public minima: string = '';
  public maxima: string = '';
  public labelInfo: string;

  public currentCity: any;
  public currentLatitude: number;

  public arraySearch: any[];
  public searched: boolean = false;
  public LocalizedName: string = "LocalizedName";
  public placeholder: string = 'Search';
  
  @ViewChild('searchAuto') searchAuto;

  constructor (private api: ApiService) {}

  ngOnInit() {
    var user = JSON.parse(localStorage.getItem('user'));
    console.log(user);
    if(user == null) {
      navigator.geolocation.getCurrentPosition(position => {
        let pos = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        localStorage.setItem('user', JSON.stringify(pos));
        this.api.getCityInfo(position.coords.latitude, position.coords.longitude)
          .subscribe(res => {
            this.currentCity = res;
            //console.log(this.currentCity);
            this.labelInfo = `${this.currentCity.LocalizedName} - ${this.currentCity.AdministrativeArea.LocalizedName} - ${this.currentCity.Country.LocalizedName}`;
            this.api.getForecastDaily(this.currentCity.Key)
              .subscribe(
                res => {
                  //console.log(res)
                  this.minima = `${this.convertToCelsius(res.DailyForecasts[0].Temperature.Minimum.Value) + '°C'}`
                  this.maxima = `${this.convertToCelsius(res.DailyForecasts[0].Temperature.Maximum.Value) + '°C'}`
                }
              )
            this.api.getForecast(this.currentCity.Key)
                .subscribe(
                  res => {
                    //console.log(res)
                    this.subtitle = res[0].IconPhrase;
                    this.temperatura = this.convertToCelsius(res[0].Temperature.Value) + '°C'
                  }
                )
          })
      })
    } else {
      this.api.getCityInfo(user.latitude, user.longitude)
          .subscribe(res => {
            this.currentCity = res;
            //console.log(this.currentCity);
            this.labelInfo = `${this.currentCity.LocalizedName} - ${this.currentCity.AdministrativeArea.LocalizedName} - ${this.currentCity.Country.LocalizedName}`;
            this.api.getForecastDaily(res.Key)
              .subscribe(
                res => {
                  //console.log(res)
                  this.minima = `${this.convertToCelsius(res.DailyForecasts[0].Temperature.Minimum.Value) + '°C'}`
                  this.maxima = `${this.convertToCelsius(res.DailyForecasts[0].Temperature.Maximum.Value) + '°C'}`
                }
              )
            this.api.getForecast(res.Key)
                .subscribe(
                  res => {
                    //console.log(res)
                    this.subtitle = res[0].IconPhrase;
                    this.temperatura = this.convertToCelsius(res[0].Temperature.Value) + '°C'
                  }
                )
          })
    }
    
  }

  onChangeSearch(event: any) {
    if(event == '') {
      this.arraySearch = []
      this.searchAuto.close()
    } else {
      this.api.getCityByName(event)
        .subscribe(res => {
          console.log(res);
          this.arraySearch = res;
        })
    }
  }

  selectEvent(event: any){
  console.log(event);
  let pos = {
    latitude: event.GeoPosition.Latitude,
    longitude: event.GeoPosition.Longitude
  }
  localStorage.setItem('user', JSON.stringify(pos));
  this.api.getCityInfo(event.GeoPosition.Latitude, event.GeoPosition.Longitude)
        .subscribe(res => {
          this.currentCity = res;
          //console.log(this.currentCity);
          this.labelInfo = `${this.currentCity.LocalizedName} - ${this.currentCity.AdministrativeArea.LocalizedName} - ${this.currentCity.Country.LocalizedName}`;
          this.api.getForecastDaily(this.currentCity.Key)
            .subscribe(
              res => {
                //console.log(res)
                this.minima = `${this.convertToCelsius(res.DailyForecasts[0].Temperature.Minimum.Value) + '°C'}`
                this.maxima = `${this.convertToCelsius(res.DailyForecasts[0].Temperature.Maximum.Value) + '°C'}`
              }
            )
          this.api.getForecast(this.currentCity.Key)
              .subscribe(
                res => {
                  //console.log(res)
                  this.subtitle = res[0].IconPhrase;
                  this.temperatura = this.convertToCelsius(res[0].Temperature.Value) + '°C'
                }
              )
        })
   
  }

  convertToCelsius(temperature: number) {
    return ((temperature - 32) * (5/9)).toFixed(2);
  }
}
