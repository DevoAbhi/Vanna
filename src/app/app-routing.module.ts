import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { UserDetailsComponent } from './user-details/user-details.component';

const routes: Routes = [
  {
  path: '',
  component: SignupComponent
},
  {
  path: 'login',
  component: LoginComponent
},
  {
  path: 'user-details',
  component: UserDetailsComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
