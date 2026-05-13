import { TestBed } from '@angular/core/testing';

import { StockSucursalService } from './stock-sucursal.service';

describe('StockSucursalService', () => {
  let service: StockSucursalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockSucursalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
