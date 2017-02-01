import { AppConfig } from '../src/app/shared/config/app.config';

const ProdConfig: AppConfig = {
    ENV: 'PROD',
    API: 'http://localhost:8000/api/'
};

export = ProdConfig;

