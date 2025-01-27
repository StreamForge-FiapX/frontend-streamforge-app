import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from "../home/home.component";
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, HomeComponent],
  styleUrls: ['./auth.component.scss'],
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  isAuthenticated = false;
  userData$ = this.oidcSecurityService.userData$;

  ngOnInit(): void {
    // Verifica autenticação ao carregar o componente
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated }) => {
      this.isAuthenticated = isAuthenticated;
      console.log('Initial Auth Check - Authenticated:', isAuthenticated);

      if (isAuthenticated) {
        this.router.navigate(['/home']);  // Redireciona para /home após autenticação
      }
    });

    // Monitora se há código de autorização na URL
    this.route.queryParams.subscribe((params) => {
      if (params['code']) {
        console.log('Authorization code detected. Performing token exchange...');
        this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated }) => {
          this.isAuthenticated = isAuthenticated;
          console.log('Callback - Authenticated:', isAuthenticated);
          if (isAuthenticated) {
            this.router.navigate(['/home']);  // Redireciona para home após autenticação
          } else {
            console.error('Token exchange failed. Authentication is still false.');
          }
        });
      }
    });
  }

  login(): void {
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    this.oidcSecurityService.logoff().subscribe(() => {
      window.location.href = `https://sa-east-1q0bjlvpum.auth.sa-east-1.amazoncognito.com/logout?client_id=7a7prg23ec6hv80e4ilt23dn8&logout_uri=${environment.cognitoLogoutUri}`;
    });
  }


}
