import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStockComponent } from './form-stock.component';

describe('FormStockComponent', () => {
  let component: FormStockComponent;
  let fixture: ComponentFixture<FormStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
