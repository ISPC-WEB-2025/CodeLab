import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserAuthService } from '../../core/services/user-auth.service';

@Component({
  selector: 'app-vendedor',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './vendedor.component.html',
  styleUrl: './vendedor.component.css'
})
export class VendedorComponent {
  private userAuthService: UserAuthService = inject(UserAuthService);
  protected readonly estaLogeado: boolean = this.userAuthService.isLoggedIn();
  protected readonly esAdmin: boolean = this.userAuthService.isAdmin(); 
}