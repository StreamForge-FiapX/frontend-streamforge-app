import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-my-frames',
  templateUrl: './my-frames.component.html',
  styleUrls: ['./my-frames.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class MyFramesComponent implements OnInit {
  frames: any[] = [];
  nextPageToken: string | null = null;

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
    this.loadFrames();
  }

  async loadFrames(): Promise<void> {
    const payload = {
      queryStringParameters: {
        UserEmail: 'raul.de.souza@oracle.com',
        Limit: '5',
        ...(this.nextPageToken && { LastEvaluatedKey: this.nextPageToken })
      }
    };

    const params = new InvokeCommand({
      FunctionName: 'arn:aws:lambda:sa-east-1:307946636040:function:getVideo2FrameHist',
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
        S3Bucket: "bucket-chunk-frame",
        S3Path: frame.S3ObjectKey.replace("@", "%40").replace(frame.FileName, ""), // Caminho base
        FileName: frame.FileName.replace(".mp4", "") // Nome base do ZIP
      }
    };

    const params = new InvokeCommand({
      FunctionName: 'arn:aws:lambda:sa-east-1:307946636040:function:generateZipDownload',
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
    const year = timestamp.substring(0, 4);
    const month = timestamp.substring(4, 6);
    const day = timestamp.substring(6, 8);
    const hours = timestamp.substring(9, 11);
    const minutes = timestamp.substring(11, 13);

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  translateStatus(status: string): string {
    if (status === 'frames_ready') {
      return 'Pronto';
    } else if (status === 'uploaded') {
      return 'Em Processamento';
    } else {
      return 'Desconhecido';
    }
  }
}
