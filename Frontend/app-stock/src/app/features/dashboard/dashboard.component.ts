import { Component, inject } from '@angular/core';
import { UserAuthService } from '../../core/services/user-auth.service';
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
  private userAuthService: UserAuthService = inject(UserAuthService);
  protected readonly estaLogeado: boolean = this.userAuthService.isLoggedIn();
  protected readonly esAdmin: boolean = this.userAuthService.isAdmin();
  protected readonly nombreUsuario: string = localStorage.getItem('nombre_usuario') ?? '';
}
