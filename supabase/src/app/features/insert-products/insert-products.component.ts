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
  found = "notFound"
  deleteSpanClass = "hide";

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

  async onSubmit() {
    const { data } =  await this.service.supabase.from('products').select('*');
      
      if(this.formData.image != '' && this.formData.item != ''){
          
          if(this.findProducts(data) == false){
            this.service.submitProductsForm(this.formData)
            .then((response) => {
              this.loadData();
            })
              
            // .then((response) => {
            //   // Handle success (e.g., show a success message)
            // })
            // .catch((error) => {
            //   // Handle error (e.g., show an error message)
            // });

          this.formData.item ='';
          this.formData.image ='';
          this.class = "inserted";
          this.found = "notFound";
          }
          else  {
            this.found = "found";
            this.class = "hide";
          }

      }
      else{
        this.class = "show";
        this.found = "notFound";
      }

    }

      findProducts(data :any){
      // let boolFound = false;
      if(data){
        for(let x of data){
          if(x.item.toLowerCase() == this.formData.item.toLowerCase()){
            return true;
            // boolFound = true;
            // this.found = "found";
          }
        } 
      }
      return false;
    }

  /*onSubmit() {
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
  }*/

  deleteSelectedProduct(id :any): void {
    this.service.deleteFromProducts(id)
    .then(response => {
      this.loadData();
      this.deleteSpanClass = "deleted"
    })
  }

  changeClass() {
    this.deleteSpanClass = "hide";
  }
}
