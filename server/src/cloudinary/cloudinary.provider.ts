import { v2 } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
    provide: 'CLOUDINARY',
    useFactory: (configService: ConfigService) => {
        return v2.config({
            cloud_name: configService.get('CLOUDINARY_CLOUD_NAME') || 'dtcfyvj1q',
            api_key: configService.get('CLOUDINARY_API_KEY') || '136877124942394',
            api_secret:
                configService.get('CLOUDINARY_API_SECRET') ||
                'OvXvTiw3y3xc75w9G4t0c8Oq_VI',
        });
    },
    inject: [ConfigService],
};
