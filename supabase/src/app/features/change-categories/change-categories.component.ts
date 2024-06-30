import { Component, ViewChild, AfterViewInit, inject, NgModule, HostListener, input, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../supabase.service';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GlobalState } from '../../../main';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; // Importa MatInputModule

@Component({
  standalone: true,
  selector: 'app-insert-products',
  templateUrl: './change-categories.component.html',
  styleUrls: ['./change-categories.component.scss'],
  imports: [FormsModule, RouterLink, RouterModule, CommonModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, MatFormFieldModule, MatInputModule]
})
export class ChangeCategoriesComponent implements AfterViewInit {
  service = inject(SupabaseService);
  categories: any;
  products: any;
  categoryProducts: any;
  selectedCategory: any;
  selectedProduct: any;
  selectedProductToDelete: any;
  nonInseriti: any[] = [];
  inseriti: any;
  formData = {
    category: '',
    product: '',
  };
  pointerOfSelectedCategory: any;

  areButtonsAble: boolean = false;
  isLoadingImgShown: boolean = false;
  filterValue: any;

  displayedColumns: string[] = ['select', 'id', 'name', 'price', 'image', 'state'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  constructor(private router: Router) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async ngOnInit() {
    this.loadAll()
  }

  async loadAll(){
    await this.downloadProduct();
    this.inseriti = []
    this.nonInseriti= []
    this.selectedCategory = GlobalState.idOfCategory;
    
    if (GlobalState.idOfCategory == 0) {
      this.router.navigate(["../categories"]);
      return;
    }

    await this.downloadCategoryProducts();
    this.inserisciInseritiENon();
    this.ordinaArray(this.inseriti);
    this.ordinaArrayInOrdineAlfabetico(this.nonInseriti);

    await this.downloadCategories();
    this.pointerOfSelectedCategory = this.getCategoryById();

    await this.downloadProduct();
    this.dataSource = new MatTableDataSource<any>(this.inseriti);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = this.filterValue;
  }

  ordinaArray(array: any): any {
    let a = array [0];
    let b = array [array.length]
    array.sort((a: { id: number; }, b: { id: number; }) => this.getConnectionIdByProductId(b.id) - this.getConnectionIdByProductId(a.id));
  }

  ordinaArrayInOrdineAlfabetico(array: { item: string }[]): { item: string }[] {
    array.sort((a, b) => {
        return a.item.localeCompare(b.item);
    });
    return array;
}

  inserisciInseritiENon(): void {
    this.inseriti = [];
    this.nonInseriti = []
    for (let element of this.categoryProducts) {
      if (element.category == this.selectedCategory) this.inseriti.push(this.getProductByIdWithPar(element.product));
    }

    for (let product of this.products) {
      if (!this.prodottoPresenteInInseriti(product)) this.nonInseriti.push(product);
    }
  }

  prodottoPresenteInInseriti(product: any): boolean {
    for (let element of this.inseriti) {
      if (product.id == element.id) return true;
    }
    return false;
  }

  async downloadProduct() {
    const { data } = await this.service.supabase.from('products').select('*');
    this.products = data;
  }

  async downloadCategories() {
    const { data } = await this.service.supabase.from('categories').select('*, products(*)');
    this.categories = data;
  }

  async downloadCategoryProducts() {
    const { data } = await this.service.supabase.from('category_products').select('*');
    this.categoryProducts = data;
  }

  categoriaPresente(category: any): boolean {
    for (let cp of this.categoryProducts) {
      if (category == cp.category) {
        return true;
      }
    }
    return false;
  }

  prodottoPresente(product: any): boolean {
    for (let cp of this.categoryProducts) {
      if (product.id == cp.product && cp.category == this.selectedCategory) {
        return true;
      }
    }
    return false;
  }

  carica(selectElement: any) {
    this.nonInseriti = [];

    for (let category of this.categories) {
      if (category.id == this.selectedCategory && this.selectedCategory != null) {
        for (let p of this.products)
          if (!this.prodottoNellaCategoria(p, category)) this.nonInseriti.push(p);
      }
    }
  }

  prodottoNellaCategoria(p: any, c: any): boolean {
    for (let product of c.products) {
      if (product.id == p.id)
        return true;
    }
    return false;
  }

  // aggiungiProdotto() {
  //   this.formData.category = this.selectedCategory;
  //   this.formData.product = this.selectedProduct;
  //   this.nonInseriti = this.nonInseriti.filter(item => item != this.getProductById());
  //   this.service.submitNewProductInCategory(this.formData)
  //     .then(response => {
  //       return this.downloadCategories();
  //     })
  //     .then(response => {
  //       this.downloadCategoryProducts();
  //       this.carica(null)
  //     })
  // }

  // rimuoviProdotto() {
  //   this.service.deleteFromCategoryProducts(this.getCategoryProductById())
  //     .then(response => {
  //       return this.downloadCategories();
  //     })
  //     .then(response => {
  //       this.downloadCategoryProducts();
  //       this.carica(null)
  //     })
  // }

  getProductById(): any {
    for (let p of this.products) {
      if (p.id == this.selectedProduct)
        return p;
    }
  }

  getProductByIdWithPar(id: number): any {
    for (let p of this.products) {
      if (p.id == id)
        return p;
    }
  }

  getCategoryById(): any {
    if (this.categories) {
      for (let c of this.categories) {
        if (c.id == this.selectedCategory)
          return c;
      }
    }
    return null;
  }

  getCategoryProductById(): any {
    for (let cp of this.categoryProducts) {
      if (cp.category == this.selectedCategory && cp.product == this.selectedProductToDelete) {
        return cp.id;
      }
    }
  }

  getSelectedProductIds(): any[] {
    return this.selection.selected.map(product => product.id);
  }

  onSubmit() {
    if (!this.selectedProduct) {
        console.error('No product selected');
        return;
    }

    this.formData.category = this.selectedCategory;
    this.formData.product = this.selectedProduct;
    this.service.submitNewProductInCategory(this.formData)
    .then(response => {
        this.loadAll()
        this.input.nativeElement.value = ""
    })
  }

  async deleteSelectedProducts(){
    const selectedElements = this.selection.selected;

    this.isLoadingImgShown = true;
    for (const element of selectedElements) {
      await this.service.supabase.from('category_products').delete().eq('id', this.getConnectionIdByProductId(element.id));
    }
    this.isLoadingImgShown = false;

    this.loadAll();
    this.input.nativeElement.value = ""

    this.selection.clear();
    this.areButtonsAble = false;
  }

  //gestione tabella
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

      //is at least one checkbox checked?
      isAnyCheckboxChecked(): void {
        this.areButtonsAble = this.selection.selected.length > 0;
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

  getConnectionIdByProductId(productId: number) {
    for (let connect of this.categoryProducts) 
      if (connect.product == productId && connect.category == this.selectedCategory)   
        return connect.id;

    return null;
  }
}
