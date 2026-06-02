import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { UserAuthService } from '../services/user-auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(UserAuthService);
  const token = authService.getToken();

  console.log('🔍 Interceptor - Token:', token);
  console.log('🔍 Interceptor - URL:', req.url);
  console.log('🔍 Interceptor - Method:', req.method);

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Token ${token}`,
      },
    });
    console.log('✅ Token agregado al header');
  } else {
    console.log('❌ No hay token');
  }

  return next(req);
};
