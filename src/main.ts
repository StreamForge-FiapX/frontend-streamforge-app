import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

Amplify.configure({
  Auth: {
    Cognito: awsExports.Auth.Cognito
  }
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
