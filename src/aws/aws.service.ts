
import { Injectable } from "@nestjs/common";

import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import { randomUUID } from "crypto";

@Injectable()
export class AwsService {
  private readonly s3: S3Client;

  private readonly bucket = process.env.bucket!;

  private readonly endpoint = "http://localhost:8333";

  constructor() {
    this.s3 = new S3Client({
      region: "us-east-1",

      endpoint: this.endpoint,

      credentials: {
        accessKeyId: process.env.accesskey_bucket!,
        secretAccessKey: process.env.secretkey_bucket!,
      },

      forcePathStyle: true,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const key = `${randomUUID()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Key: key,
      Body: file.buffer,
      Bucket: this.bucket,
      ContentType: file.mimetype,
    });

    await this.s3.send(command);

    const url = `${this.endpoint}/${this.bucket}/${encodeURIComponent(key)}`;

    return url;
  }
}
