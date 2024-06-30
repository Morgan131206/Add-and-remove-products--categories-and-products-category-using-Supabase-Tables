import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild, inject, AfterViewInit, HostListener } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../supabase.service';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { GlobalState } from '../../../main'
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; // Importa MatInputModule

@Component({
  selector: 'app-insert-category',
  styleUrl: 'insert-categories.component.scss',
  templateUrl: 'insert-categories.component.html',
  standalone: true,
  imports: [MatTableModule, MatCheckboxModule, RouterLink, FormsModule, MatTableModule, MatPaginatorModule, CommonModule, MatFormFieldModule, MatInputModule],
})
export class InsertCategoriesComponent implements AfterViewInit {
  service = inject(SupabaseService);

  formData = {
    name: '',
    image: ''
  };

  categories: any[] = [];
  selectedProduct: any;
  class = "hide";
  found = "notFound";
  deleteSpanClass = "hide";
  displayInsertDiv = "show";

  displayedColumns: string[] = ['select', 'position', 'name', 'link'];
  dataSource = new MatTableDataSource<any>(this.categories);
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
    const { data, error } = await this.service.supabase.from('categories').select('*');
    if (data) {
      this.categories = data;
      this.ordinaArray(this.categories);
      this.dataSource.data = this.categories;
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

  async deleteSelectedCategories() {
    const selectedCategories = this.selection.selected;

    this.isLoadingImgShown = true;
    for (const category of selectedCategories) {
      await this.service.supabase.from('categories').delete().eq('id', category.id);
    }
    this.isLoadingImgShown = false;

    this.loadData();
    this.selection.clear();
    this.areButtonsAble = false

  }

  async onSubmit() {
    const { data } = await this.service.supabase.from('categories').select('*');
    if (this.formData.image !== '' && this.formData.name !== '') {
      if (!this.findCategories(data)) {
        await this.service.submitCategoriesForm(this.formData);
        this.loadData();
        this.formData.name = '';
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

  findCategories(data: any) {
    if (data) {
      for (let x of data) {
        if (x.name.toLowerCase() === this.formData.name.toLowerCase()) {
          return true;
        }
      }
    }
    return false;
  }

  handleCategoryClick(id: number) {
    GlobalState.idOfCategory = id;
    console.log(GlobalState.idOfCategory)
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
}
