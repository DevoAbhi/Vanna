import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form! : FormGroup;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      'email' : new FormControl(null, {validators: [Validators.required, Validators.email]}),
      'password' : new FormControl(null, {validators: [Validators.required, Validators.minLength(6)]}),
    })
  }

  async onLogin() {
    if(this.form.invalid){
      Swal.fire({
        icon: 'error',
        title: 'Please fill valid details!'
      })
      return
    }

    this.authService.loginReqObj = {}
    this.authService.loginReqObj.email = this.form.value.email;
    this.authService.loginReqObj.password = this.form.value.password;

    const response = await this.authService.login()

    if(response.success) {
      console.log(response.message)
      this.router.navigate(['user-details'])
    }
    else{
      Swal.fire(`${response.message}`)
    }
  }

}
