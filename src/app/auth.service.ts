import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {CookieService} from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router,
              private http: HttpClient,
              private cookieService:CookieService,
  ) {
  }

  auth(username: any, password: any) { //Client side auth is useless
    this.http.get("http://localhost:3000/loginCheck/" + username + "-" + password)
      .subscribe(
        (response) => {
          // @ts-ignore
          return(response[0]);
        },
        (error) => {
          console.error('Request failed with error')
        },
      )
  }

  // @ts-ignore
  async addPaint(color: any, amount: number, price: number){
    console.log(this.cookieService.get('name') + "-" + this.cookieService.get('password') + "-" + color + "-" + amount + "-" + price);
    this.http.get("http://localhost:3000/addPaint/" + this.cookieService.get('name') + "-" + this.cookieService.get('password') + "-" + color + "-" + amount + "-" + price)
      .subscribe(
        (response) => {
          // @ts-ignore
          window.alert(response);
        },
        (error) => {
          console.error('Request failed with error')
        },
      )
  }

  async ship(id: String){
    //console.log(this.cookieService.get('name') + "-" + this.cookieService.get('password') + "-" + color + "-" + amount);
    this.http.get("http://localhost:3000/shipPaint/" + this.cookieService.get('name') + "-" + this.cookieService.get('password') + "-" + id)
      .subscribe(
        (response) => {
          // @ts-ignore
          window.alert(response);
        },
        (error) => {
          console.error('Request failed with error')
        },
      )
  }

  async buyPaint(color: any, amount: number){
    //console.log(this.cookieService.get('name') + "-" + this.cookieService.get('password') + "-" + color + "-" + amount);
    this.http.get("http://localhost:3000/buyPaint/" + this.cookieService.get('name') + "-" + this.cookieService.get('password') + "-" + color + "-" + amount)
      .subscribe(
        (response) => {
          // @ts-ignore
          window.alert(response);
        },
        (error) => {
          console.error('Request failed with error')
        },
      )
  }
  login(username: any, password: any) {
    this.http.get("http://localhost:3000/loginCheck/" + username + "-" + password)
      .subscribe(
        (response) => {
          // @ts-ignore
          if(response[0][0]){
            this.cookieService.set('name', username);
            this.cookieService.set('password', password);
            // @ts-ignore
            if(response[0][1]){
              this.router.navigateByUrl('/dashboard')
            }
            else{
              this.router.navigateByUrl('/home')
            }
          } else {
            window.alert("Incorrect username or password!")
          }
        },
        (error) => {
          console.error('Request failed with error')
        },
      )
  }
}
