import * as util from 'gulp-util';
import { argv } from 'yargs';
import { join } from 'path';

import Config from '../../../config/config';

const getConfig = (path: string, env: string): any => {
    const configPath = join(path, env);
    let config: any;
    try {
        config = require(configPath);
    } catch (e) {
        config = null;
        util.log(util.colors.red(e.message));
    }

    return config;
};

/**
 * Returns the project configuration (consisting of the base configuration provided by projectConfig.ts)
 */
export function templateLocals() {
    const configEnvName = argv['config-env'] || 'dev';
    const configPath = Config.getPluginConfig('environment-config');
    const baseConfig = getConfig(configPath, 'base');
    if (!baseConfig) {
        throw new Error('Invalid base configuration name');
    }
    const config = getConfig(configPath, configEnvName);

    if (!config) {
        throw new Error('Invalid configuration name');
    }
    return Object.assign(Config, {
        APP_CONFIG: JSON.stringify(Object.assign(baseConfig, config))
    });
}

