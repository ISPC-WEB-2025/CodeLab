import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { UserAuthService } from '../services/user-auth.service';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<any> => {
  const authService = inject(UserAuthService);

  // Endpoints públicos o de autenticación que no deben interceptarse ni adjuntar Bearer
  const isAuthEndpoint =
    req.url.includes('/api/usuarios/login/') ||
    req.url.includes('/api/usuarios/registro/') ||
    req.url.includes('/api/usuarios/token/refresh/');

  let authReq = req;
  const token = authService.getAccessToken();

  // Adjuntamos Bearer token si existe y no es un endpoint de login/registro/refresh
  if (token && !isAuthEndpoint) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el error 401 ocurre en endpoints de autenticación (login o refresh), logout directo
      if (error.status === 401 && isAuthEndpoint) {
        if (req.url.includes('/api/usuarios/token/refresh/')) {
          authService.logout();
        }
        return throwError(() => error);
      }

      // Si es un 401 en cualquier otro endpoint, intentamos auto-renovar con el refresh_token
      if (error.status === 401) {
        const refreshToken = authService.getRefreshToken();
        if (!refreshToken) {
          authService.logout();
          return throwError(() => error);
        }

        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshToken().pipe(
            switchMap((response: any) => {
              isRefreshing = false;
              const newAccessToken = response.access;
              refreshTokenSubject.next(newAccessToken);

              // Reintentar la petición original con el nuevo access token
              return next(
                req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newAccessToken}`
                  }
                })
              );
            }),
            catchError((refreshError) => {
              isRefreshing = false;
              refreshTokenSubject.next(null);
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        } else {
          // Si ya hay una renovación en curso, esperar a que termine y reintentar con el nuevo token
          return refreshTokenSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((newToken) => {
              return next(
                req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`
                  }
                })
              );
            })
          );
        }
      }

      return throwError(() => error);
    })
  );
};
