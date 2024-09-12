import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadedObjectInfo } from 'minio';
import { MinioService } from 'nestjs-minio-client';
import { Readable } from 'stream';
import { DetailedNotFoundException } from '../common/exceptions/detailed-not-found.exception';
import { DetailedBadRequestException } from '../common/exceptions/detailed-bad-request.exception';
import { HelperService } from '../common/helpers/helpers.utils';

@Injectable()
export class S3Service {
  constructor(
    private readonly s3Service: MinioService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger: Logger = new Logger(S3Service.name);
  private readonly bucket = this.configService.get('S3_BUCKET_NAME');

  /**
   * Checks if an object exists in the specified bucket.
   *
   * @param {string} fileName - The name of the object.
   * @param {string} bucketName - The name of the bucket. Defaults to the bucket of the instance.
   * @return {Promise<boolean>} Returns true if the object exists, false otherwise.
   */
  async isObjectExists(
    fileName: string,
    bucketName: string = this.bucket,
  ): Promise<boolean> {
    this.logger.debug(`isObjectExists('${fileName}', '${bucketName}')`);
    try {
      // throws error if file not found
      await this.s3Service.client.statObject(bucketName, fileName);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Retrieves an object from the specified bucket.
   *
   * @param {string} fileName - the name of the file to retrieve
   * @param {string} bucketName - the name of the bucket (default is the current bucket)
   * @return {Promise<Readable>} the object retrieved from the bucket
   * @throws {DetailedNotFoundException} if the object is not found
   */
  async getObject(
    fileName: string,
    bucketName: string = this.bucket,
  ): Promise<Readable> {
    this.logger.debug(`getObject('${fileName}', '${bucketName}')`);

    if (!(await this.isObjectExists(fileName, bucketName))) {
      throw new DetailedNotFoundException([
        {
          details: `File '${fileName}' not found`,
          resourceId: fileName,
          resourceName: 'File',
        },
      ]);
    }
    return await this.s3Service.client.getObject(bucketName, fileName);
  }

  /**
   * Asynchronously uploads a file to an S3 bucket with optional metadata.
   *
   * @param {string} fileName - The name of the file to be uploaded.
   * @param {Buffer} fileBuffer - The buffer containing the file data.
   * @param {object} metaData - Optional metadata to be associated with the file.
   * @param {string} [bucketName=this.bucket] - The name of the S3 bucket to upload the file to. Defaults to the bucket specified in the class constructor.
   * @return {Promise<UploadedObjectInfo>} A promise that resolves to an object containing information about the uploaded file.
   * @throws {DetailedBadRequestException} If an error occurs while uploading the file.
   */
  async putObject(
    fileName: string,
    fileBuffer: Buffer,
    metaData: object,
    bucketName: string = this.bucket,
  ): Promise<UploadedObjectInfo> {
    this.logger.debug(
      `putObject('${fileName}', buffer, '${HelperService.objectToString(
        metaData,
      )}', '${bucketName}')`,
    );
    try {
      await this.makeBucketIfNotExists(bucketName);

      return this.s3Service.client.putObject(
        bucketName,
        fileName,
        fileBuffer,
        metaData,
      );
    } catch (e) {
      throw new DetailedBadRequestException([
        {
          reason: e.message,
          details: e.detail,
        },
      ]);
    }
  }

  /**
   * Removes an object from the specified bucket.
   *
   * @param {string} fileName - the name of the file to be removed
   * @param {string} [bucketName=this.bucket] - the name of the bucket from which the file should be removed
   * @return {Promise<void>} a promise that resolves once the object has been removed
   * @throws {DetailedNotFoundException} if the object is not found
   */
  async removeObject(
    fileName: string,
    bucketName: string = this.bucket,
  ): Promise<void> {
    this.logger.debug(`removeObject('${fileName}', '${bucketName}')`);
    if (!(await this.isObjectExists(fileName, bucketName))) {
      throw new DetailedNotFoundException([
        {
          details: `File '${fileName}' not found`,
          resourceId: fileName,
          resourceName: 'File',
        },
      ]);
    }
    return this.s3Service.client.removeObject(bucketName, fileName);
  }

  /**
   * Asynchronously creates a new bucket if it does not already exist.
   *
   * @param {string} bucketName - the name of the bucket to be created
   * @return {Promise<void>} a Promise that resolves when the bucket is created
   */
  async makeBucketIfNotExists(bucketName: string = this.bucket): Promise<void> {
    if (!(await this.isBucketExists(bucketName))) {
      await this.s3Service.client.makeBucket(bucketName);
    }
  }

  /**
   * Checks if a bucket exists.
   *
   * @param {string} bucketName - the name of the bucket to check
   * @return {Promise<boolean>} a boolean indicating if the bucket exists
   */
  private async isBucketExists(
    bucketName: string = this.bucket,
  ): Promise<boolean> {
    return await this.s3Service.client.bucketExists(bucketName);
  }
}
