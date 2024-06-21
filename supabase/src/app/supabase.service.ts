import { Injectable } from '@angular/core';
import {
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js'
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async submitProductsForm(formData: any) {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .insert([formData]);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async submitCategoriesForm(formData: any) {
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .insert([formData]);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }


  async submitNewProductInCategory(formData: any) {
    try {
      const { data, error } = await this.supabase
        .from('category_products')
        .insert([formData]);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
  
  async deleteFromCategories(id: any) {
    try {
      
    const {data, error} = await this.supabase
      .from('categories')
      .delete()
      .eq("id", id)

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async deleteFromProducts(id: any) {
    try {
      
    const {data, error} = await this.supabase
      .from('products')
      .delete()
      .eq("id", id)

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async deleteFromCategoryProducts(id: any) {
    try {
      
    const {data, error} = await this.supabase
      .from('category_products')
      .delete()
      .eq("id", id)

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
}