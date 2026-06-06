import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { UserAuthService } from '../../core/services/user-auth.service';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, FooterComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = 'app-stock';

  private userAuthService: UserAuthService = inject(UserAuthService);
  protected readonly nombreUsuario: string | null = this.userAuthService.getUsername();
  protected readonly estaLogeado: boolean = this.userAuthService.isLoggedIn();
}
