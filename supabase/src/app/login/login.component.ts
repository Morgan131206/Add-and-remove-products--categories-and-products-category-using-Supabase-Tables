import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SupabaseService } from '../supabase.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { routes } from '../app.routes';
import { GlobalState } from '../../main';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [RouterLink, ReactiveFormsModule, FormsModule, RouterModule, CommonModule] // Importa ReactiveFormsModule
})
export class LoginComponent {
  service = inject(SupabaseService);
  username: string = '';
  password: string = '';
  isAuthenticated: boolean = false;
  tables: any[] = [];
  invalidLogin = false;
  
  constructor(private router: Router) { }

  async login() {
    try {
      const user = await this.service.login(this.username, this.password);
      if (user.length > 0) {
        GlobalState.areRoutesEnable = true;
        this.router.navigate(["home"]);
      } else {
        this.invalidLogin = true;
      }
    } catch (error) {
      console.error('Error logging in', error);
    }

    this.password = ""
  }

}
