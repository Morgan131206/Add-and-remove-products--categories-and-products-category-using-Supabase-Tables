import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../supabase.service';
import { RouterLink, RouterOutlet, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-insert-products',
  templateUrl: './insert-categories.component.html',
  styleUrls: ['./insert-categories.component.scss'],
  imports: [FormsModule, RouterLink, RouterModule] // Import FormsModule and RouterLink here
})
export class InsertCategoriesComponent {
  service = inject(SupabaseService);
  data :any;

  formData = {
    name: '',
    image: '',
  };

  categories: any[] = [];
  selectedCategory: any;

  class = "hide";
  found = "notFound";
  async ngOnInit() {
    this.loadData();
  }

  async loadData() {
    const { data, error } = await this.service.supabase.from('categories').select('*');
    
    if(data){
      this.categories = data;
    }
    
    if (error) {
      // TODO: Handle error
    }
  }


async onSubmit() {
  const { data } =  await this.service.supabase.from('categories').select('*');
    
    if(this.formData.image != '' && this.formData.name != ''){
        
        if(this.findCategories(data) == false){
          this.service.submitCategoriesForm(this.formData)
          .then((response) => {
            this.loadData();
          })
            
          // .then((response) => {
          //   // Handle success (e.g., show a success message)
          // })
          // .catch((error) => {
          //   // Handle error (e.g., show an error message)
          // });

        this.formData.name ='';
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

    //this.service.deleteFromCategories(this.findIndex);
  }

   findCategories(data :any){
   // let boolFound = false;
    if(data){
      for(let x of data){
        if(x.name == this.formData.name){
          return true;
          // boolFound = true;
          // this.found = "found";
        }
      } 
    }
    return false;
    // if(!boolFound) this.found = "notFound";
  }

  deleteSelectedCategory(id :any): void {
    alert(id)
    this.service.deleteFromCategories(id)
    .then(response => {
      this.loadData();
    })
    
  }

}
