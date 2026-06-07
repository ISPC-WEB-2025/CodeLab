import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
    const router = inject(Router);
    const esAdmin = localStorage.getItem('es_admin') === 'true';

    if (esAdmin) {
        return true;
    }

    router.navigate(['/vendedor/catalogo']);
    return false;
};