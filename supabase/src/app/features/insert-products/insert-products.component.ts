import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../supabase.service';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-insert-products',
  templateUrl: './insert-products.component.html',
  styleUrls: ['./insert-products.component.scss'],
  imports: [FormsModule, RouterLink] // Import FormsModule and RouterLink here
})
export class InsertProductsComponent {
  service = inject(SupabaseService);

  formData = {
    item: '',
    image: '',
    price: '',
  };
  products: any[] = [];
  selectedProduct: any;
  class = "hide";

  ngOnInit (){
    this.loadData();
  }

  async loadData() {
    const { data, error } = await this.service.supabase.from('products').select('*');
    
    if(data){
      this.products = data;
    }
    
    if (error) {
      // TODO: Handle error
    }
  }

  onSubmit() {
    if(this.formData.image != '' && this.formData.item != '' && this.formData.price != ''){
        this.service.submitProductsForm(this.formData)
        .then((response) => {
          this.loadData();
        })
        .catch((error) => {
          // Handle error (e.g., show an error message)
        });

      this.formData.item ='';
      this.formData.price ='';
      this.formData.image ='';
      this.class = "inserted";

      this.loadData();
    }
    else{
      this.class = "show";
    }  
  }

  deleteSelectedProduct(id :any): void {
    this.service.deleteFromProducts(id)
    .then(response => {
      this.loadData();
    })
    
  }
}
