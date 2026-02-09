import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import type { Response } from 'express';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
    }))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return {
            url: `http://localhost:3000/uploads/${file.filename}`,
        };
    }

    @Get(':filename')
    getFile(@Param('filename') filename: string, @Res() res: Response) {
        const file = createReadStream(join(process.cwd(), 'uploads', filename));
        file.pipe(res);
    }
}
