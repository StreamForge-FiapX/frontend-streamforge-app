import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    private readonly oidcSecurityService = inject(OidcSecurityService);
    private readonly router = inject(Router);

    canActivate(): Observable<boolean> {
        return this.oidcSecurityService.checkAuth().pipe(
            map(({ isAuthenticated }) => {
                if (!isAuthenticated) {
                    this.router.navigate(['/login']);  // Redireciona para login se não autenticado
                }
                return isAuthenticated;
            }),
            tap(isAuthenticated => {
                console.log('AuthGuard - Authenticated:', isAuthenticated);
            })
        );
    }
}
