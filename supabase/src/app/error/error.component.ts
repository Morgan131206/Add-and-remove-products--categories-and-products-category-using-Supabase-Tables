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
  selector: 'app-error',
  standalone: true,
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss',
  imports: [RouterLink, ReactiveFormsModule, FormsModule, RouterModule, CommonModule] // Importa ReactiveFormsModule
})
export class ErrorComponent {

}
