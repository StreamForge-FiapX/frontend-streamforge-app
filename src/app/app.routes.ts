import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { FrameUploadComponent } from './frame-by-frame/frame-by-frame.component';
import { MyFramesComponent } from './my-frames/my-frames.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'login', component: AuthComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'frame-by-frame', component: FrameUploadComponent, canActivate: [AuthGuard] },
    { path: 'my-frames', component: MyFramesComponent, canActivate: [AuthGuard] },  // Mova para cima
    { path: '**', redirectTo: 'home' }  // Mantenha no final
];
