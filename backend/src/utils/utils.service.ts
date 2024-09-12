import { Injectable } from '@nestjs/common';
import { S3Service } from '../s3/s3.service';
import { Readable } from 'stream';
import { UploadedObjectInfo } from 'minio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UtilsService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
  ) {}

  private readonly clientFileName = 'openapi-client.tar.gz';
  private readonly bucketName = this.configService.get('S3_BUCKET_NAME_CLIENT');

  /**
   * Asynchronously retrieves the openapi-client stream.
   *
   * @return {Promise<{stream: Readable}>} An object containing the client stream.
   */
  async getClient(): Promise<{ stream: Readable }> {
    const stream = await this.s3Service.getObject(
      this.clientFileName,
      this.bucketName,
    );

    return { stream };
  }

  /**
   * Uploads a client file to the server.
   *
   * @param {Express.Multer.File} file - the file to be uploaded
   * @return {Promise<UploadedObjectInfo>} information about the uploaded object
   */
  async uploadClient(file: Express.Multer.File): Promise<UploadedObjectInfo> {
    const metaData = {
      'Content-Type': file.mimetype,
    };
    return this.s3Service.putObject(
      this.clientFileName,
      file.buffer,
      metaData,
      this.bucketName,
    );
  }
}
