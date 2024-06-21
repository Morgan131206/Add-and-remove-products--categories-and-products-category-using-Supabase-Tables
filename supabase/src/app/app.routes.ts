import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsertCategoriesComponent } from './features/insert-categories/insert-categories.component';
import { InsertProductsComponent } from './features/insert-products/insert-products.component';
import { ChangeCategoriesComponent } from './features/change-categories/change-categories.component';
import { HomeComponent } from './home/home.component';
export const routes: Routes = [
    { path: 'categories', component: InsertCategoriesComponent },
    { path: 'change', component: ChangeCategoriesComponent },
    { path: 'products', component: InsertProductsComponent },
    { path: '', component: HomeComponent },
];
