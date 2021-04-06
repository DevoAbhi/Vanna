import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  userDetails : Array<any> = []

  constructor(private authService : AuthService) { }

  ngOnInit(): void {
    this.getUserDetails()
  }

  async getUserDetails() {
    const response = await this.authService.getUserDetails();

    if(response.success){
      this.userDetails = response.userDetails
    }
    else{
      Swal.fire(`${response.message}`)
    }
  }
}
