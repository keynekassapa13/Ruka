import { Component, OnInit } from '@angular/core';
import { Gesture } from './gesture';
import { HomeService } from './home.service';
import { ActivatedRoute, Router }  from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';


declare var jquery:any;
declare var $ :any;
declare var ease, TimelineMax,TweenMax,Power4,Power1,Power2,Power3,Bounce, Elastic:any;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public zero: Gesture;
  public one: Gesture;
  public two: Gesture;
  public three: Gesture;
  public four: Gesture;
  public five: Gesture;

  public dataWeather;
  public newsEnter;
  public newsTech;
  public news;
  public temp= "";
  public on=0;

  handGest = [];
  storedGest = [];
  message = '<h3>Welcome to Ruka</h3>';

  animationState = 'inactive';
  toggleState() {
    this.animationState = this.animationState === 'active' ? 'inactive' : 'active';
  }

  constructor(private _home: HomeService, private router: Router) {

    if(!window.location.hash) {
      window.location.href = window.location.href + '#loaded';
      window.location.reload();
    }

    this.zero = new Gesture();
    this.zero.title = "zero";
    this.zero.path = "assets/hand-gest/zero.svg";

    this.one = new Gesture();
    this.one.title = "one";
    this.one.path = "assets/hand-gest/one.svg";

    this.two = new Gesture();
    this.two.title = "two";
    this.two.path = "assets/hand-gest/two.svg";

    this.three = new Gesture();
    this.three.title = "three";
    this.three.path = "assets/hand-gest/three.svg";

    this.four = new Gesture();
    this.four.title = "four";
    this.four.path = "assets/hand-gest/four.svg";

    this.five = new Gesture();
    this.five.title = "five";
    this.five.path = "assets/hand-gest/five.svg";

    this.handGest = [this.zero, this.one, this.two, this.three, this.four, this.five];

  }

  ngOnInit() {
    this.fadeInContent();
    this.getWeatherInfo();
    this.getNewsEnt();
    this.getNewsTechno();
    this.getNews();
  }

  getWeatherInfo(){
    this._home.getWeather()
    .subscribe(
    (data: any) => {
      this.dataWeather = data;
    });
  }

  getNewsEnt(){
    this._home.getEntNews()
    .subscribe(
      (data: any) => {
        this.newsEnter = data;
      }
    );
  }

  getNewsTechno(){
    this._home.getTechNews()
    .subscribe(
      (data: any) => {
        this.newsTech = data;
      }
    );
  }

  getNews(){
    this._home.getNews()
    .subscribe(
      (data:any) => {
        this.news = data;
      }
    );
  }

  fadeInContent(){
    var $desktopContent = $('.message-content');

    var tl = new TimelineMax({delay:0.3});
    tl
    .fromTo($desktopContent, 0.5, {opacity:0}, {opacity:1, ease: Power2.easeOut})
    ;
  }

  fadeOutContent(){
    var $desktopContent = $('.message-content');

    var tl = new TimelineMax();
    tl
    .fromTo($desktopContent, 0.3, {opacity:1}, {opacity:0, ease: Power2.easeOut})
    ;
  }

  addGest(Gest){

    if (Gest.title == "five" && this.on == 0){
      this.on = 1;
      this.changeMessage('<h5>Analyzing your hand gesture...</h5>');
    } else if (this.on){
      if (Gest.title == "five"){
        if (this.storedGest.length >= 2){
          this.checkPath();
          this.on=0;
          this.storedGest = [];
        } else if (this.storedGest.length <= 0){
          this.changeMessage("<h5>Hi There!</h4>");
        }
      } else {
        if (this.storedGest.length >= 2){
          this.changeMessage('<h5>Only two hand gesture allowed! High Five to end the process</h5>');
        } else {
          this.storedGest.push(Gest);
        }
      }
    } else {
      this.changeMessage('<h5>Start Ruka by high-fiving Ruka!</h5>');
    }


    return this;
  }

  changeMessage(mess){
    this.fadeOutContent();
    setTimeout(() => {
      this.message = mess;
      this.fadeInContent();
    },600);
  }

  checkPath(){
    if (this.storedGest[0].title == "zero"){
      if (this.storedGest[1].title == "one"){
        this.changeMessage("<h5>Locking all doors at your house</h5>");
      } else if (this.storedGest[1].title == "two"){
        this.changeMessage("<h5>Turning on your TV<b><br/>Bravia Sony TV</h5>");
      } else {
        this.changeMessage("<h5>Command unkown. Please register your command!!</h5>");
      }


    } else if (this.storedGest[0].title == "one"){
      if (this.storedGest[1].title == "zero"){
        this.changeMessage("<h5>Turning off all lights in this room</h5>");
      } else if (this.storedGest[1].title == "two"){
        this.changeMessage("<h5>Turning on all lights in this room</h5>");
      } else {
        this.changeMessage("<h5>Command unkown. Please register your command!</h5>");
      }

    } else if (this.storedGest[0].title == "two"){
      if (this.storedGest[1].title == "zero"){
        this.changeMessage("<h5>Making an alarm for tomorrow at 6</h5>");
      } else if (this.storedGest[1].title == "one"){
        this.changeMessage("<h5>Making an alarm for tomorrow at 7</h5>");
      } else if (this.storedGest[1].title == "three"){
        this.changeMessage("<h5>Making an alarm for tomorrow at 8</h5>");
      } else if (this.storedGest[1].title == "four"){
        this.changeMessage("<h5>Making an alarm for tomorrow at 9</h5>");
      } else {
        this.changeMessage("<h5>Command unkown. Please register your command!</h5>");
      }

    } else if (this.storedGest[0].title == "three"){
      if (this.storedGest[1].title == "zero"){
        this.temp = "<h5>Weather today for " + this.dataWeather["name"] + ' </h5><br> <img src="http://openweathermap.org/img/w/' + this.dataWeather["weather"][0]["icon"] + '.png"> '+  this.dataWeather["weather"][0]["main"] + ', ' + this.dataWeather["weather"][0]["description"];
        this.changeMessage(this.temp);
      } else if (this.storedGest[1].title == "one"){
        this.changeMessage("<h5>Maps to your work</h5>");
      } else if (this.storedGest[1].title == "two"){
        this.changeMessage("<h5>Notification</h5>");
      } else {
        this.changeMessage("<h5>Command unkown. Please register your command!</h5>");
      }

    } else if (this.storedGest[0].title == "four") {
      console.log('masuk');
      if (this.storedGest[1].title == "zero"){
        this.temp = '<h5>Headline AU News</h5> ' + this.news["articles"][0]["source"]["name"] + ' - ' + this.news["articles"][0]["title"];
        this.changeMessage(this.temp);
      } else if (this.storedGest[1].title == "one"){
        this.temp = '<h5>Entertainment News</h5> ' + this.newsEnter["articles"][0]["source"]["name"] + ' - ' + this.newsEnter["articles"][0]["title"];
        this.changeMessage(this.temp);
      } else if (this.storedGest[1].title == "two"){
        this.temp = '<h5>Technology News </h5>' + this.newsTech["articles"][0]["source"]["name"] + ' - ' + this.newsTech["articles"][0]["title"];
        this.changeMessage(this.temp);
      } else {
        this.changeMessage("<h5>Command unkown. Please register your command!</h5>");
      }
    } else {
      this.changeMessage("<h5>Command unkown. Please register your command!</h5>");
    }

  }

}
