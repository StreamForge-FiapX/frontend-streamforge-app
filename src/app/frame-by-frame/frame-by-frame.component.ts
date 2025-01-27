import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AwsUploadService } from '../services/aws-upload.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-frame-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './frame-by-frame.component.html',
  styleUrl: './frame-by-frame.component.scss'
})
export class FrameUploadComponent {
  private awsUploadService = inject(AwsUploadService);
  private oidcSecurityService = inject(OidcSecurityService);

  selectedFile: File | null = null;
  uploadSuccess = false;
  uploadError: string | null = null;

  handleFileInput(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
    this.uploadSuccess = false;
    this.uploadError = null;
  }

  uploadFile() {
    if (this.selectedFile) {
      this.oidcSecurityService.userData$.subscribe((user) => {
        const email = user?.userData?.email;

        this.awsUploadService.uploadVideo(this.selectedFile!, email)
          .then(() => {
            this.uploadSuccess = true;
            this.selectedFile = null;  // Limpa o arquivo após o upload
            (document.getElementById('fileInput') as HTMLInputElement).value = '';  // Reseta o campo file
          })
          .catch((err) => {
            this.uploadError = 'Falha no upload. Tente novamente.';
            console.error('Erro durante o upload:', err);
          });
      });
    }
  }
}
