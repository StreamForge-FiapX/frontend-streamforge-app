import { environment } from './../../environments/environment';


export const authConfig = {
  authority: 'https://cognito-idp.sa-east-1.amazonaws.com/sa-east-1_q0bjlvPuM',
  redirectUrl: environment.cognitoRedirectUri,
  postLoginRoute: environment.postLoginRoute,
  clientId: '7a7prg23ec6hv80e4ilt23dn8',
  scope: 'openid email phone',
  responseType: 'code',
  silentRenew: true,
  useRefreshToken: true
};
