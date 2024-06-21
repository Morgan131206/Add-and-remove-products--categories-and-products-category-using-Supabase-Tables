import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeCategoriesComponent } from './change-categories.component';

describe('ChangeCategoriesComponent', () => {
  let component: ChangeCategoriesComponent;
  let fixture: ComponentFixture<ChangeCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
