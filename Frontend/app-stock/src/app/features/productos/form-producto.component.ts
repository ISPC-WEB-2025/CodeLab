import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../core/services/producto.service';
import { CategoriaService } from '../../core/services/categoria.service';


@Component({
  selector: 'app-form-producto',
  imports: [FormsModule],
  templateUrl: './form-producto.component.html',
  styleUrl: './form-producto.component.css'
})
export class FormProductoComponent implements OnInit {

  categorias: any[] = [];

  producto = {
    nombre: '',
    codigo: '',
    precio_venta: null,
    id_cat: null,
    descripcion: ''
  };

  constructor(private productoService: ProductoService,
              private categoriaService: CategoriaService) {}

  ngOnInit() {
    this.categoriaService.getAll().subscribe(data => {
      this.categorias = data;
    });
  }

  guardar() {
    this.productoService.create(this.producto).subscribe({
      next: () => {
        alert('Producto guardado correctamente');
        this.resetForm();
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        alert('Hubo un error al guardar el producto');
      }
    });
  }

  resetForm() {
    this.producto = {
      nombre: '',
      codigo: '',
      precio_venta: null,
      id_cat: null,
      descripcion: ''
    };
  }
}