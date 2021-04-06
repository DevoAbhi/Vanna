import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiURL + '/user';

@Injectable({providedIn:"root"})

export class AuthService implements OnInit{


  signupReqObj:any;
  signupResObj:any;
  loginReqObj:any;
  loginResObj:any;
  loginErrorResObj:any;
  userResObj:any;
  private token: any;
  private tokenTimer: any;
  private isAuthStatusListener = new Subject<boolean>()

  constructor(private http: HttpClient, private route: Router) {}

  ngOnInit() {}

  getToken() {
    const token = this.token;
    return token;
  }

  getAuthStatusListener() {
    return this.isAuthStatusListener.asObservable();
  }

  async signup() {

    await this.http.post(BACKEND_URL + '/signup', this.signupReqObj)
    .toPromise()
    .then(response => {
      this.signupResObj = response
    })
    .catch(err => {
      this.signupResObj = err.error;
      console.log(this.signupResObj.error)
    })

    return this.signupResObj;
  }

  async login() {

    await this.http.post(BACKEND_URL + '/login', this.loginReqObj)
    .toPromise()
    .then(response => {
      this.loginResObj = response;
      const token = this.loginResObj.token;

    if(token) {
      this.token = token;
      const expiresInDuration = this.loginResObj.expiresIn;
      console.log(expiresInDuration)
      this.setAuthTimer(expiresInDuration);

      this.isAuthStatusListener.next(true);

      const nowTime = new Date();
      const expirationDate = new Date(nowTime.getTime() + expiresInDuration * 1000)
      this.saveAuth(token, expirationDate)
    }

    })
    .catch(err => {
      this.loginResObj = err.error;
      console.log(this.loginResObj.error)
    })

    return this.loginResObj;


  }

  async getUserDetails() {

    await this.http.get(BACKEND_URL + '/user-details')
    .toPromise()
    .then(response => {
      this.userResObj = response
    })
    .catch(err => {
      this.userResObj = err.error;
      console.log(this.userResObj.error)
    })
    return this.userResObj;
  }

  saveAuth(token: string, expirationDate: Date) {
    localStorage.setItem('token', token)
    localStorage.setItem('expiration', expirationDate.toISOString())
  }

  removeAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  logout(){
    this.token = null;
    clearTimeout(this.tokenTimer);
    this.isAuthStatusListener.next(false);
    this.removeAuth();
    this.route.navigate(['login'])
  }

  setAuthTimer(duration : number) {
    console.log("You will be logged out in --> " + duration/60 + ' minutes')
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration  * 1000)
  }

  isUserLoggedIn() {
    if (localStorage.getItem('token') !== null) {
      this.token = localStorage.getItem('token');
      return true;
    } else {
      return false;
    }
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();

    console.log(authInformation)

    if(!authInformation){
      return
    }
    const nowTime = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - nowTime.getTime();

    if(expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthStatusListener.next(true);
      this.setAuthTimer(expiresIn/1000)
    }
  }

  getAuthData() {

    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration')

    if(!token || !expirationDate){
      return
    }

    return {
      token : token,
      expirationDate : new Date(expirationDate)
    }

  }


}


