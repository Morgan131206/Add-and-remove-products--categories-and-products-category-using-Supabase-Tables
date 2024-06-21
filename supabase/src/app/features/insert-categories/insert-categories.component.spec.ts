import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertCategoriesComponent } from './insert-categories.component';

describe('InsertCategoriesComponent', () => {
  let component: InsertCategoriesComponent;
  let fixture: ComponentFixture<InsertCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsertCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsertCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
