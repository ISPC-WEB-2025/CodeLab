import { Component } from '@angular/core';
// RouterOutlet: habilita <router-outlet> para renderizar rutas hijas
// RouterLink: habilita routerLink para navegación SPA sin recargar la página
// RouterLinkActive: agrega clase CSS 'active' al link de la ruta actual
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
