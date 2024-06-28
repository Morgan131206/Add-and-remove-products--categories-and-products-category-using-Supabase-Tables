// import { Component, inject } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { SupabaseService } from '../../supabase.service';
// import { RouterLink, RouterOutlet } from '@angular/router';

// @Component({
//   standalone: true,
//   selector: 'app-insert-products',
//   templateUrl: './insert-products.component.html',
//   styleUrls: ['./insert-products.component.scss'],
//   imports: [FormsModule, RouterLink] // Import FormsModule and RouterLink here
// })
// export class InsertProductsComponent {
//   service = inject(SupabaseService);

//   formData = {
//     item: '',
//     image: '',
//     price: '',
//   };
//   products: any[] = [];
//   selectedProduct: any;
//   class = "hide";
//   found = "notFound"
//   deleteSpanClass = "hide";

//   ngOnInit (){
//     this.loadData();
//   }

//   async loadData() {
//     const { data, error } = await this.service.supabase.from('products').select('*');
    
//     if(data){
//       this.products = data;
//     }
    
//     if (error) {
//       // TODO: Handle error
//     }
//   }

//   async onSubmit() {
//     const { data } =  await this.service.supabase.from('products').select('*');
      
//       if(this.formData.image != '' && this.formData.item != ''){
          
//           if(this.findProducts(data) == false){
//             this.service.submitProductsForm(this.formData)
//             .then((response) => {
//               this.loadData();
//             })
              
//             // .then((response) => {
//             //   // Handle success (e.g., show a success message)
//             // })
//             // .catch((error) => {
//             //   // Handle error (e.g., show an error message)
//             // });

//           this.formData.item ='';
//           this.formData.image ='';
//           this.class = "inserted";
//           this.found = "notFound";
//           }
//           else  {
//             this.found = "found";
//             this.class = "hide";
//           }

//       }
//       else{
//         this.class = "show";
//         this.found = "notFound";
//       }

//     }

//       findProducts(data :any){
//       // let boolFound = false;
//       if(data){
//         for(let x of data){
//           if(x.item.toLowerCase() == this.formData.item.toLowerCase()){
//             return true;
//             // boolFound = true;
//             // this.found = "found";
//           }
//         } 
//       }
//       return false;
//     }

//   /*onSubmit() {
//     if(this.formData.image != '' && this.formData.item != '' && this.formData.price != ''){
//         this.service.submitProductsForm(this.formData)
//         .then((response) => {
//           this.loadData();
//         })
//         .catch((error) => {
//           // Handle error (e.g., show an error message)
//         });

//       this.formData.item ='';
//       this.formData.price ='';
//       this.formData.image ='';
//       this.class = "inserted";

//       this.loadData();
//     }
//     else{
//       this.class = "show";
//     }  
//   }*/

//   deleteSelectedProduct(id :any): void {
//     this.service.deleteFromProducts(id)
//     .then(response => {
//       this.loadData();
//       this.deleteSpanClass = "deleted"
//     })
//   }

//   changeClass() {
//     this.deleteSpanClass = "hide";
//   }
// }

import {SelectionModel} from '@angular/cdk/collections';
import {Component, inject} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../supabase.service';
export interface PeriodicElement {
 
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

/**
 * @title Table with selection
 */
@Component({
  selector: 'table-selection-example',
  styleUrl: 'insert-products.component.scss',
  templateUrl: 'insert-products.component.html',
  standalone: true,
  imports: [MatTableModule, MatCheckboxModule, RouterLink],
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

  displayedColumns: string[] = ['select', 'position', 'name', 'amount'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }



}
