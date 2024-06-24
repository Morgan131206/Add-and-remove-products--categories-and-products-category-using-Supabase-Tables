import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../supabase.service';
import { RouterLink, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-insert-products',
  templateUrl: './change-categories.component.html',
  styleUrls: ['./change-categories.component.scss'],
  imports: [FormsModule, RouterLink, RouterModule, CommonModule] // Import FormsModule and RouterLink here
})
export class ChangeCategoriesComponent {
  service = inject(SupabaseService);
  categories :any;
  products :any;
  categoryProducts :any;
  selectedCategory :any; //id of category selected
  selectedProduct :any;
  selectedProductToDelete :any;
  nonInseriti :any [] = [];
  inseriti :any [] = [];
  isButtonDisabled: boolean = false;
  isDeleteButtonDisabled: boolean = false;
  formData = {
    category: '',
    product: '',
  };

  async ngOnInit() {
    this.downloadCategories();
    this.downloadProduct();
    
    this.downloadCategoryProducts();
    // this.carica();
  }

  async downloadCategoryProducts(){
    const {data}=  await this.service.supabase.from('category_products').select('*');
    this.categoryProducts = data;
  }

  async downloadProduct(){
    const {data}=  await this.service.supabase.from('products').select('*');
    this.products = data;
  }

  async downloadCategories(){
    const {data}=  await this.service.supabase.from('categories').select('*, products(*)');
    this.categories = data;
  }


  categoriaPresente(category : any): Boolean{
      for(let cp of this.categoryProducts){
        if(category == cp.category){
          return true;
        }
      }
    return false;
  }

  prodottoPresente(product : any): Boolean{
      for(let cp of this.categoryProducts){
        if(product.id == cp.product && cp.category == this.selectedCategory){
          return true;
        }
      }

    return false;
  }


  carica(selectElement: any){
  
    this.nonInseriti = [];

    for (let category of this.categories) {
      if(category.id == this.selectedCategory && this.selectedCategory != null){
        for(let p of this.products)
          if(!this.prodottoNellaCategoria(p, category)) this.nonInseriti.push(p);
      }
    }

    /*if (this.nonInseriti.length == 0){
      selectElement.disabled = true;
      this.isButtonDisabled = true;
      this.isDeleteButtonDisabled = false;
    } 
    else {
      selectElement.disabled = false;
      this.isButtonDisabled = false; 

      let c = this.getCategoryById();
      if (c.products.length > 0) this.isDeleteButtonDisabled = false;
      if(c.products.length == this.products.length) this.isButtonDisabled = true;
    } */

    console.log(this.nonInseriti);
  }


  prodottoNellaCategoria(p :any, c :any): Boolean{
    for(let product of c.products){
      if(product.id == p.id)
        return true;
    }
    return false;
  }

  aggiungiProdotto(){
    this.formData.category = this.selectedCategory;
    this.formData.product = this.selectedProduct;
    this.nonInseriti = this.nonInseriti.filter(item => item != this.getProductById());
    this.service.submitNewProductInCategory(this.formData)
    .then (response => {
      return this.downloadCategories();
    })
    .then(response=>{
      this.downloadCategoryProducts();
      this.carica(null)
    })
    
  }

  rimuoviProdotto(){
    this.service.deleteFromCategoryProducts(this.getCategoryProductById())
    
    .then (response => {
      return this.downloadCategories();
    })
    .then(response=>{
      this.downloadCategoryProducts();
      this.carica(null)
    })
  }

  getProductById() :any{
    for(let p of this.products){
      if(p.id == this.selectedProduct)
        return p;
    }
  }

  getCategoryById() :any{
    for(let c of this.categories){
      if(c.id == this.selectedCategory)
        return c;
    }
  }

  getCategoryProductById() :any{
    for(let cp of this.categoryProducts){

      if(cp.category == this.selectedCategory && cp.product == this.selectedProductToDelete){
        return cp.id;
      }
    }
  }
}




