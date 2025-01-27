import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';  // Importação necessária
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, HeaderComponent, CommonModule],  // Adicione CommonModule aqui
  templateUrl: './app.component.html'
})
export class AppComponent {
  showHeader = false;
  private oidcSecurityService = inject(OidcSecurityService);
  private router = inject(Router);

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showHeader = !event.url.includes('login');
      }
    });
  }

  logout(): void {
    this.oidcSecurityService.logoff().subscribe(() => {
      window.location.href = `https://sa-east-1q0bjlvpum.auth.sa-east-1.amazoncognito.com/logout?client_id=7a7prg23ec6hv80e4ilt23dn8&logout_uri=${environment.cognitoLogoutUri}`;
    });
  }
}
