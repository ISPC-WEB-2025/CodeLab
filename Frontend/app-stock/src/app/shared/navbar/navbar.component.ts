import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserAuthService } from '../../core/services/user-auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private userAuthService: UserAuthService = inject(UserAuthService);
  protected readonly nombreUsuario: string | null = this.userAuthService.getUsername();
  protected readonly estaLogeado: boolean = this.userAuthService.isLoggedIn();
  
  logout() {
    this.userAuthService.logout();
  }
}
