import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from 'angular-auth-oidc-client';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authConfig } from './auth/auth.config';  // Reutiliza configuração simplificada

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    importProvidersFrom(HttpClientModule),

    // Configura o AuthModule aqui
    importProvidersFrom(
      AuthModule.forRoot({
        config: authConfig  // Reutiliza do auth.config.ts
      })
    )
  ]
};
