import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsertCategoriesComponent } from './features/insert-categories/insert-categories.component';
import { InsertProductsComponent } from './features/insert-products/insert-products.component';
import { ChangeCategoriesComponent } from './features/change-categories/change-categories.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { GlobalState } from '../main';

export const routes: Routes = [
    { path: 'categories', component: InsertCategoriesComponent, canActivate: [() => GlobalState.areRoutesEnable]},
    { path: 'change', component: ChangeCategoriesComponent, canActivate: [() => GlobalState.areRoutesEnable ]},
    { path: 'products', component: InsertProductsComponent, canActivate: [() => GlobalState.areRoutesEnable ]},
    { path: 'home', component: HomeComponent, canActivate: [() => GlobalState.areRoutesEnable ]},
    { path: '', component: LoginComponent},
    { path: '**', component: ErrorComponent},
];
