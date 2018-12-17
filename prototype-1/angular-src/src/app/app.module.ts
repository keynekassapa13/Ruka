import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './users/registration/registration.component';
import { LoginComponent } from './users/login/login.component';
import { MainComponent } from './main/main.component';

const appRoutes: Routes = [
  { path: '', component: MainComponent},
  { path: 'home', component: HomeComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegistrationComponent,
    LoginComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
