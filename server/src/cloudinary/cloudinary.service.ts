import { Injectable } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse, v2 } from 'cloudinary';
import * as toStream from 'streamifier';

@Injectable()
export class CloudinaryService {
    async uploadImage(
        file: Express.Multer.File,
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream(
                { folder: 'bharat-business' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result as UploadApiResponse);
                },
            );
            toStream.createReadStream(file.buffer).pipe(upload);
        });
    }
}
