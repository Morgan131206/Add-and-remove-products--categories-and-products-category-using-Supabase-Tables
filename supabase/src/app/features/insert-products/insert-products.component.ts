import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild, inject, AfterViewInit, HostListener } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../supabase.service';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; // Importa MatInputModule

@Component({
  selector: 'app-insert-product',
  styleUrl: 'insert-products.component.scss',
  templateUrl: 'insert-products.component.html',
  standalone: true,
  imports: [MatTableModule, MatCheckboxModule, RouterLink, FormsModule, MatTableModule, MatPaginatorModule, CommonModule, MatFormFieldModule, MatInputModule],
})
export class InsertProductsComponent implements AfterViewInit {
  service = inject(SupabaseService);

  formData = {
    item: '',
    image: '',
    price: '',
  };

  products: any[] = [];
  selectedProduct: any;
  class = "hide";
  found = "notFound";
  deleteSpanClass = "hide";
  displayInsertDiv = "show";
  

  displayedColumns: string[] = ['select', 'position', 'name', 'price', 'image', 'state'];
  dataSource = new MatTableDataSource<any>(this.products);
  selection = new SelectionModel<any>(true, []);

  areButtonsAble: boolean = false;
  isLoadingImgShown: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async loadData() {
    const { data, error } = await this.service.supabase.from('products').select('*');
    if (data) {
      this.products = data;
      this.ordinaArray(this.products);
      this.dataSource.data = this.products;
    }
    if (error) {
      // TODO: Handle error
    }
  }
  
  ordinaArray(array: any): any {
    let a = array [0];
    let b = array [array.length]
    array.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  async deleteSelectedProducts() {
    const selectedProducts = this.selection.selected;
    
    this.isLoadingImgShown = true;
    for (const product of selectedProducts) {
      await this.service.supabase.from('products').delete().eq('id', product.id);
    }
    this.isLoadingImgShown = false;

    this.loadData();
    this.selection.clear();
    this.areButtonsAble = false
  }

  async activateStateSelectedProducts() {
    const selectedProducts = this.selection.selected;

    this.isLoadingImgShown = true;
    for (const product of selectedProducts) {
      await this.service.updateStateInActive(product);
    }
    this.isLoadingImgShown = false;

    this.loadData();
    this.selection.clear();
    this.areButtonsAble = false
  }

  async deactivateStateSelectedProducts() {
    const selectedProducts = this.selection.selected;

    this.isLoadingImgShown = true;
    for (const product of selectedProducts) {
      await this.service.updateStateInDeactive(product);
    }
    this.isLoadingImgShown = false;

    this.loadData();
    this.selection.clear();
    this.areButtonsAble = false
  }

  async onSubmit() {
    const { data } = await this.service.supabase.from('products').select('*');
    if (this.formData.image !== '' && this.formData.item !== '') {
      if (!this.findProducts(data)) {
        await this.service.submitProductsForm(this.formData);
        this.loadData();
        this.formData.item = '';
        this.formData.price = '';
        this.formData.image = '';
        this.class = "inserted";
        this.found = "notFound";
      } else {
        this.found = "found";
        this.class = "hide";
      }
    } else {
      this.class = "show";
      this.found = "notFound";
    }
  }

  findProducts(data: any) {
    if (data) {
      for (let x of data) {
        if (x.item.toLowerCase() === this.formData.item.toLowerCase()) {
          return true;
        }
      }
    }
    return false;
  }

  //is at least one checkbox checked?
  isAnyCheckboxChecked(): void {
    this.areButtonsAble = this.selection.selected.length > 0;
    console.log(this.areButtonsAble)
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
      this.isAnyCheckboxChecked()
  }

  getFormattedPriceOfProduct(cost: number): string {
    return cost.toLocaleString('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    //return '€ ' + x.replace('€', '').trim();
  }
}
