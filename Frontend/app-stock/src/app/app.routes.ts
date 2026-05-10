import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { QuienesSomosComponent } from './features/quienes-somos/quienes-somos.component';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ListaProductosComponent } from './features/productos/lista-productos.component';
import { FormProductoComponent } from './features/productos/form-producto.component';
import { ListaProveedoresComponent } from './features/proveedores/lista-proveedores.component';
import { FormProveedorComponent } from './features/proveedores/form-proveedor.component';
import { StockSucursalComponent } from './features/stock/stock-sucursal.component';
import { ListaMovimientosComponent } from './features/movimientos/lista-movimientos.component';
import { FormMovimientoComponent } from './features/movimientos/form-movimiento.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'quienes-somos', component: QuienesSomosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', 
    component: DashboardComponent,
    children: [  // estas rutas ahora son "HIJAS" del dashboard
      {path: "", redirectTo: "stock", pathMatch: "full"},      
      {path: "stock", component:StockSucursalComponent},
      {path: "productos", component: ListaProductosComponent},
      {path: "productos/nuevo", component: FormProductoComponent},
      {path: "productos/editar/:id", component: FormProductoComponent},
      {path: "proveedores", component: ListaProveedoresComponent},
      {path: "proveedores/nuevo", component: FormProveedorComponent},
      {path: "proveedores/editar/:id", component: FormProveedorComponent},
      {path: "movimientos", component:ListaMovimientosComponent},
      {path: "movimientos/nuevo", component: FormMovimientoComponent},
    ]
   },
   { path: '**', redirectTo: 'home' }  // captura cualquier ruta no definida
];
  