import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  form!: FormGroup;
  cities: Array<string> = ['Dhanbad', 'Kolkata', 'Ranchi', 'Jaipur']
  states: Array<string> = ['Jharkhand', 'West Bengal', 'Gujarat', 'Rajastham']

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      'name' : new FormControl(null, {validators: [Validators.required]}),
      'email' : new FormControl(null, {validators: [Validators.required, Validators.email]}),
      'phone' : new FormControl(null, {validators: [Validators.required, Validators.minLength(10)]}),
      'address1' : new FormControl(null, {validators: [Validators.required]}),
      'address2' : new FormControl(null, {validators: [Validators.required]}),
      'city' : new FormControl(null, {validators: [Validators.required]}),
      'state' : new FormControl(null, {validators: [Validators.required]}),
      'pin' : new FormControl(null, {validators: [Validators.required, Validators.minLength(6)]}),
      'password' : new FormControl(null, {validators: [Validators.required, Validators.minLength(6)]}),
      'confirmPassword' : new FormControl(null, {validators: [Validators.required, Validators.minLength(6)]})
    })
  }

  async onSignup(){

    if(this.form.invalid){
      Swal.fire({
        icon: 'error',
        title: 'Please fill valid details!'
      })
      return
    }

    if(this.form.value.password !== this.form.value.confirmPassword){
      Swal.fire({
        icon: 'error',
        title: 'Password and Confirm password do not match!'
      })
      return
    }

    this.authService.signupReqObj = {}
    this.authService.signupReqObj.name = this.form.value.name;
    this.authService.signupReqObj.email = this.form.value.email;
    this.authService.signupReqObj.phone = this.form.value.phone;
    this.authService.signupReqObj.address1 = this.form.value.address1;
    this.authService.signupReqObj.address2 = this.form.value.address2;
    this.authService.signupReqObj.city = this.form.value.city;
    this.authService.signupReqObj.state = this.form.value.state;
    this.authService.signupReqObj.pin = this.form.value.pin;
    this.authService.signupReqObj.password = this.form.value.password;

    const response = await this.authService.signup();

    if(response.success) {
      console.log(response.message)
      this.router.navigate(['login'])
      this.form.reset();
    }
    else{
      Swal.fire(`${response.message}`)
    }
  }

}
