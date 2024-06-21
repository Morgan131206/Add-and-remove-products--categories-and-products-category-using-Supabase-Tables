import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InsertCategoriesComponent } from './features/insert-categories/insert-categories.component';
import { InsertProductsComponent } from './features/insert-products/insert-products.component';
import { ChangeCategoriesComponent } from './features/change-categories/change-categories.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InsertCategoriesComponent, InsertProductsComponent, ChangeCategoriesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'mcdonalds-kiosk';
}
