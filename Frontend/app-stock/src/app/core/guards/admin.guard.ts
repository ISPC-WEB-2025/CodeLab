import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';

export const adminGuard: CanActivateFn = () => {
    const authService = inject(UserAuthService);
    const router = inject(Router);

    if (authService.isAdmin()) {
        return true;
    }

    router.navigate(['/vendedor/catalogo']);
    return false;
};