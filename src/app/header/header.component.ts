import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isUserAuthenticated = false;
  isAuthSub!: Subscription;

  constructor(private authService : AuthService) { }

  ngOnInit(): void {
    this.navSlider();
    this.isUserAuthenticated = this.authService.isUserLoggedIn();
    this.isAuthSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuth: boolean) => {
        this.isUserAuthenticated = isAuth;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  navSlider = () => {
    const burger = <HTMLElement>document.querySelector('.burger');
    const nav = <HTMLElement>document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll<HTMLElement>('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle nav class
        nav.classList.toggle('nav-active');

        // Toggle animation
        navLinks.forEach((link, index) => {
            if(link.style.animation){
                link.style.animation = ''
            }
            else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index/7 + 0.4}s`;
            }
        })
        burger.classList.toggle('toggle');
    })
}

}
