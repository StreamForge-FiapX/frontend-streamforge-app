import { Injectable } from '@angular/core';
import { S3Client, PutObjectCommand, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand } from '@aws-sdk/client-s3';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'  // Disponibiliza o serviço para toda a aplicação
})
export class AwsUploadService {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: 'sa-east-1',  // Sua região da AWS
      credentials: {
        accessKeyId: environment.awsUploadaccessKeyId,
        secretAccessKey: environment.awsUploadsecretAccessKey,
      }
    });
  }

  async uploadVideo(file: File, email: string): Promise<void> {
    const bucketName = 'uploaded-video-bckt';
    const datePath = new Date().toISOString().split('T')[0];
    const key = `${email}/${datePath}/${file.name}`;

    if (file.size > 100 * 1024 * 1024) {
      console.log('Iniciando Multipart Upload...');
      await this.multipartUpload(bucketName, key, file);
    } else {
      console.log('Iniciando Upload Normal...');
      await this.simpleUpload(bucketName, key, file);
    }
  }

  private async simpleUpload(bucket: string, key: string, file: File): Promise<void> {
    const params = {
      Bucket: bucket,
      Key: key,
      Body: file
    };

    const command = new PutObjectCommand(params);
    await this.s3.send(command);
    console.log('Upload completo!');
  }

  private async multipartUpload(bucket: string, key: string, file: File): Promise<void> {
    const createCommand = new CreateMultipartUploadCommand({ Bucket: bucket, Key: key });
    const createResponse = await this.s3.send(createCommand);
    const uploadId = createResponse.UploadId;

    const partSize = 10 * 1024 * 1024;
    const parts: any[] = [];

    for (let i = 0; i < Math.ceil(file.size / partSize); i++) {
      const start = i * partSize;
      const end = Math.min(start + partSize, file.size);
      const blob = file.slice(start, end);

      const uploadPartCommand = new UploadPartCommand({
        Bucket: bucket,
        Key: key,
        PartNumber: i + 1,
        UploadId: uploadId,
        Body: blob,
      });

      const response = await this.s3.send(uploadPartCommand);
      parts.push({
        ETag: response.ETag,
        PartNumber: i + 1,
      });
    }

    const completeCommand = new CompleteMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts }
    });

    await this.s3.send(completeCommand);
    console.log('Multipart Upload Completo!');
  }
}
