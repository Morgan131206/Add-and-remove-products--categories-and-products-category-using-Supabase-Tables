import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { InsertProductsComponent } from './app/features/insert-products/insert-products.component';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { NgModule } from '@angular/core';

bootstrapApplication(InsertProductsComponent, appConfig)
  .catch((err) => console.error(err));

export class AppModule { }

export const GlobalState = {
  idOfCategory: 0,
  areRoutesEnable: false
} 

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

  bootstrapApplication(LoginComponent, appConfig)
  .catch((err) => console.error(err));
