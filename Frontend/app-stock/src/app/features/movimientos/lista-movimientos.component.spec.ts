import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMovimientosComponent } from './lista-movimientos.component';

describe('ListaMovimientosComponent', () => {
  let component: ListaMovimientosComponent;
  let fixture: ComponentFixture<ListaMovimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaMovimientosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaMovimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
