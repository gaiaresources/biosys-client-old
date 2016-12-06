import { AppConfig } from '../src/app/shared/config/app.config';

const ProdConfig: AppConfig = {
    ENV: 'PROD',
    API: 'https://api.biosys.dpaw.wa.gov.au/api/'
};

export = ProdConfig;

