import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendedorService } from '../../../core/services/vendedor.service';

@Component({
  selector: 'app-catalogo',
  imports: [CommonModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent implements OnInit {
  productos: any[] = [];

  constructor(private vendedorService: VendedorService) {}

  ngOnInit(): void {
    this.vendedorService.getProductos().subscribe(data => {
      this.productos = data;
    });
  }
}