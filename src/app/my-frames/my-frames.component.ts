import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { environment } from '../../environments/environment';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-my-frames',
  templateUrl: './my-frames.component.html',
  styleUrls: ['./my-frames.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class MyFramesComponent implements OnInit {
  private oidcSecurityService = inject(OidcSecurityService);
  frames: any[] = [];
  nextPageToken: string | null = null;
  userEmail: string | null = null;  // Armazena o e-mail do usuário autenticado

  lambdaClient: LambdaClient;

  constructor() {
    this.lambdaClient = new LambdaClient({
      region: 'sa-east-1',
      credentials: {
        accessKeyId: environment.myFramesaccessKeyId,
        secretAccessKey: environment.myFramessecretAccessKey,
      }
    });
  }

  ngOnInit(): void {
    this.oidcSecurityService.userData$.subscribe((user) => {
      if (user?.userData?.email) {
        this.userEmail = user.userData.email;
        this.loadFrames(); // Só carrega os frames após obter o e-mail do usuário
      } else {
        console.error('Usuário não autenticado ou e-mail não encontrado.');
      }
    });
  }

  async loadFrames(): Promise<void> {
    if (!this.userEmail) {
      console.warn("Tentativa de carregar frames sem e-mail do usuário.");
      return;
    }

    const payload = {
      queryStringParameters: {
        UserEmail: this.userEmail,  // Usa o e-mail do usuário autenticado
        Limit: '5',
        ...(this.nextPageToken && { LastEvaluatedKey: this.nextPageToken })
      }
    };

    const params = new InvokeCommand({
      FunctionName: 'arn:aws:lambda:sa-east-1:307946636040:function:ms-video2framehist-app',
      Payload: JSON.stringify(payload)
    });

    try {
      const { Payload } = await this.lambdaClient.send(params);
      const result = JSON.parse(new TextDecoder().decode(Payload));

      if (result.body) {
        const responseBody = JSON.parse(result.body);
        console.log('Frames recebidos:', responseBody.Items);
        this.frames = [...this.frames, ...responseBody.Items];
        this.nextPageToken = responseBody.NextPageToken || null;
      }
    } catch (err) {
      console.error('Erro ao invocar Lambda:', err);
    }
  }

  async downloadZip(frame: any): Promise<void> {
    const payload = {
      queryStringParameters: {
        S3Bucket: "frames-chunks-video",
        S3Path: `dev.raulsouza@gmail.com/${frame.UploadTimestamp.split("T")[0]}/${frame.FileName}/`, // Adicionando corretamente o título do vídeo
        FileName: frame.FileName.replace(".mp4", "") // Nome base do ZIP
      }
    };

    const params = new InvokeCommand({
      FunctionName: 'arn:aws:lambda:sa-east-1:307946636040:function:ms-generatezipdownload-app',
      Payload: JSON.stringify(payload),
    });

    try {
      const { Payload } = await this.lambdaClient.send(params);
      const result = JSON.parse(new TextDecoder().decode(Payload));

      if (result.statusCode === 200) {
        // Realiza o download via URL gerada
        const presignedUrl = result.body;
        window.location.href = presignedUrl;
      } else {
        console.error('Erro ao gerar o ZIP:', result.body);
      }
    } catch (err) {
      console.error('Erro ao chamar Lambda:', err);
    }
  }

  loadMore(): void {
    this.loadFrames();
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
      console.warn("Data inválida recebida:", timestamp);
      return "Data inválida";
    }

    // Formata diretamente para o fuso horário de Brasília (America/Sao_Paulo)
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }




  translateStatus(status: string): string {
    if (status === 'FINALIZADO') {
      return 'Pronto';
    } else if (status === 'EM PROGRESSO') {
      return 'Em Processamento';
    } else if (status === 'INICIADO') {
      return 'Iniciado';
    } else {
      return 'Desconhecido';
    }
  }
}
