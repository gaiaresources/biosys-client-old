import { join } from 'path';
import * as slash from 'slash';
import { argv } from 'yargs';

import { Environments, InjectableDependency } from './project.config.interfaces';

/**
 * The enumeration of available environments.
 * @type {Environments}
 */
export const ENVIRONMENTS: Environments = {
    DEVELOPMENT: 'dev',
    UAT: 'uat',
    PRODUCTION: 'prod'
};


/**
 * This class represents the basic configuration of biosys.
 * It provides the following:
 * - Constants for directories, ports, versions etc.
 * - Injectable NPM dependencies
 * - Injectable application assets
 * - Temporary editor files to be ignored by the watcher and asset builder
 * - SystemJS configuration
 * - Autoprefixer configuration
 * - BrowserSync configuration
 * - Utilities
 */
export class ProjectConfig {

    /**
     * The port where the application will run.
     * The default port is `5555`, which can be overriden by the  `--port` flag when running `npm start`.
     * @type {number}
     */
    PORT = argv['port'] || 5555;

    /**
     * The root folder of the project (up two levels from the current directory).
     */
    PROJECT_ROOT = join(__dirname, '..');

    /**
     * The current environment.
     * The default environment is `dev`, which can be overriden by the `--projectConfig-env ENV_NAME` flag when running `npm start`.
     */
    ENV = getEnvironment();

    /**
     * The flag for the debug option of the application.
     * The default value is `false`, which can be overriden by the `--debug` flag when running `npm start`.
     * @type {boolean}
     */
    DEBUG = argv['debug'] || false;

    /**
     * The port where the documentation application will run.
     * The default docs port is `4003`, which can be overriden by the `--docs-port` flag when running `npm start`.
     * @type {number}
     */
    DOCS_PORT = argv['docs-port'] || 4003;

    /**
     * The port where the unit test coverage report application will run.
     * The default coverage port is `4004`, which can by overriden by the `--coverage-port` flag when running `npm start`.
     * @type {number}
     */
    COVERAGE_PORT = argv['coverage-port'] || 4004;

    /**
     * The path to the coverage output
     * NB: this must match what is configured in ./karma.conf.js
     */
    COVERAGE_DIR = 'coverage';

    /**
     * Karma reporter configuration
     */
    KARMA_REPORTERS: any = {
        preprocessors: {
            'dist/**/!(*spec).js': ['coverage']
        },
        reporters: ['mocha', 'coverage'],
        coverageReporter: {
            dir: this.COVERAGE_DIR + '/',
            reporters: [
                {type: 'json', subdir: '.', file: 'coverage-final.json'}
            ]
        }
    };

    /**
     * The path for the base of the application at runtime.
     * The default path is based on the environment '/',
     * which can be overriden by the `--base` flag when running `npm start`.
     * @type {string}
     */
    APP_BASE = argv['base'] || '/';

    /**
     * The base path of node modules.
     * @type {string}
     */
    NPM_BASE = slash(join(this.APP_BASE, 'node_modules/'));

    /**
     * The build interval which will force the TypeScript compiler to perform a typed compile run.
     * Between the typed runs, a typeless compile is run, which is typically much faster.
     * For example, if set to 5, the initial compile will be typed, followed by 5 typeless runs,
     * then another typed run, and so on.
     * If a compile error is encountered, the build will use typed compilation until the error is resolved.
     * The default value is `0`, meaning typed compilation will always be performed.
     * @type {number}
     */
    TYPED_COMPILE_INTERVAL = 0;

    /**
     * The directory where the bootstrap file is located.
     * The default directory is `app`.
     * @type {string}
     */
    BOOTSTRAP_DIR = argv['app'] || 'app';

    /**
     * The bootstrap file to be used to boot the application. The file to be used is dependent if the hot-loader option is
     * used or not.
     * Per default (non hot-loader mode) the `main.ts` file will be used, with the hot-loader option enabled, the
     * `hot_loader_main.ts` file will be used.
     * @type {string}
     */
    BOOTSTRAP_MODULE = `${this.BOOTSTRAP_DIR}/main`;

    BOOTSTRAP_PROD_MODULE = `${this.BOOTSTRAP_DIR}/` + 'main';

    NG_FACTORY_FILE = 'main-prod';

    BOOTSTRAP_FACTORY_PROD_MODULE = `${this.BOOTSTRAP_DIR}/${this.NG_FACTORY_FILE}`;
    /**
     * The default title of the application as used in the `<title>` tag of the
     * `index.html`.
     * @type {string}
     */
    APP_TITLE = 'Welcome to Biosys!';

    /**
     * The base folder of the applications source files.
     * @type {string}
     */
    APP_SRC = 'src';

    /**
     * The folder of the applications asset files.
     * @type {string}
     */
    ASSETS_SRC = `${this.APP_SRC}/assets`;

    /**
     * The folder of the applications css files.
     * @type {string}
     */
    CSS_SRC = `${this.APP_SRC}/css`;

    /**
     * The directory of the applications tools
     * @type {string}
     */
    TOOLS_DIR = 'tools';

    /**
     * The directory of the tasks provided by the biosys.
     */
    BIOSYS_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'biosys');

    /**
     * The destination folder for the generated documentation.
     * @type {string}
     */
    DOCS_DEST = 'docs';

    /**
     * The base folder for built files.
     * @type {string}
     */
    DIST_DIR = 'dist';

    /**
     * The folder for built files in the `dev` environment.
     * @type {string}
     */
    DEV_DEST = `${this.DIST_DIR}/dev`;

    /**
     * The folder for the built files in the `prod` environment.
     * @type {string}
     */
    UAT_DEST = `${this.DIST_DIR}/uat`;

    /**
     * The folder for the built files in the `prod` environment.
     * @type {string}
     */
    PROD_DEST = `${this.DIST_DIR}/prod`;

    /**
     * The folder for temporary files.
     * @type {string}
     */
    TMP_DIR = `${this.DIST_DIR}/tmp`;

    /**
     * The folder for the built files, corresponding to the current environment.
     * @type {string}
     */
    APP_DEST = this.ENV === ENVIRONMENTS.PRODUCTION ? this.PROD_DEST : this.ENV === ENVIRONMENTS.UAT ? this.UAT_DEST : this.DEV_DEST;

    /**
     * The folder for the built CSS files.
     * @type {strings}
     */
    CSS_DEST = `${this.APP_DEST}/css`;

    /**
     * The folder for the built JavaScript files.
     * @type {string}
     */
    JS_DEST = `${this.APP_DEST}/js`;

    /**
     * The version of the application as defined in the `package.json`.
     */
    VERSION = appVersion();

    /**
     * The name of the bundle file to includes all CSS files.
     * @type {string}
     */
    CSS_PROD_BUNDLE = 'main.css';

    /**
     * The name of the bundle file to include all JavaScript shims.
     * @type {string}
     */
    JS_PROD_SHIMS_BUNDLE = 'shims.js';

    /**
     * The name of the bundle file to include all JavaScript application files.
     * @type {string}
     */
    JS_PROD_APP_BUNDLE = 'app.js';

    /**
     * The required NPM version to run the application.
     * @type {string}
     */
    VERSION_NPM = '2.14.2';

    /**
     * The required NodeJS version to run the application.
     * @type {string}
     */
    VERSION_NODE = '4.0.0';

    /**
     * The ruleset to be used by `codelyzer` for linting the TypeScript files.
     */
    CODELYZER_RULES = customRules();

    /**
     * The flag to enable handling of SCSS files
     * The default value is false. Override with the '--scss' flag.
     * @type {boolean}
     */
    ENABLE_SCSS = argv['scss'] || false;

    FONTS_DEST = `${this.APP_DEST}/fonts`;

    FONTS_SRC = ['node_modules/font-awesome/fonts/**'];

    PRIME_NG_THEME = 'cupertino';

    CSS_IMAGE_DEST = `${this.CSS_DEST}/images`;
    CSS_IMAGE_SRC = [
        'node_modules/primeng/resources/themes/' + this.PRIME_NG_THEME + '/images/**'
    ];

    /**
     * The list of NPM dependencies to be injected in the `index.html`.
     * @type {InjectableDependency[]}
     */
    NPM_DEPENDENCIES: InjectableDependency[] = [
        {src: 'zone.js/dist/zone.js', inject: 'libs'},
        {src: 'core-js/client/shim.min.js', inject: 'shims'},
        {src: 'systemjs/dist/system.src.js', inject: 'shims', env: ENVIRONMENTS.DEVELOPMENT},
        {src: 'rxjs/bundles/Rx.min.js', inject: 'libs', env: ENVIRONMENTS.DEVELOPMENT},
        {src: 'ng2-bootstrap/ng2-bootstrap', inject: 'lib'},
        {src: 'bootstrap/dist/css/bootstrap.css', inject: true},
        {src: 'font-awesome/css/font-awesome.min.css', inject: true},
        {src: 'primeng/resources/primeng.min.css', inject: true},
        {src: 'primeng/resources/themes/' + this.PRIME_NG_THEME + '/theme.css', inject: true},
        {src: 'leaflet/dist/leaflet.css', inject: true},
        {src: 'leaflet-draw/dist/leaflet.draw.css', inject: true},
    ];

    /**
     * The list of local files to be injected in the `index.html`.
     * @type {InjectableDependency[]}
     */
    APP_ASSETS: InjectableDependency[] = [
        {src: `${this.CSS_SRC}/main.${this.getInjectableStyleExtension()}`, inject: true, vendor: false},
    ];

    /**
     * The list of editor temporary files to ignore in watcher and asset builder.
     * @type {string[]}
     */
    TEMP_FILES: string[] = [
        '**/*___jb_tmp___',
        '**/*~',
    ];

    /**
     * Returns the array of injectable dependencies (npm dependencies and assets).
     * @return {InjectableDependency[]} The array of npm dependencies and assets.
     */
    get DEPENDENCIES(): InjectableDependency[] {
        return normalizeDependencies(this.NPM_DEPENDENCIES.filter(filterDependency.bind(null, this.ENV)))
            .concat(this.APP_ASSETS.filter(filterDependency.bind(null, this.ENV)));
    }

    /**
     * The configuration of SystemJS for the `dev` environment.
     * @type {any}
     */
    SYSTEM_CONFIG_DEV: any = {
        defaultJSExtensions: true,
        packageConfigPaths: [
            `/node_modules/*/package.json`,
            `/node_modules/**/package.json`,
            `/node_modules/@angular/*/package.json`
        ],
        paths: {
            [this.BOOTSTRAP_MODULE]: `${this.APP_BASE}${this.BOOTSTRAP_MODULE}`,
            'css': 'node_modules/systemjs-plugin-css/css.js',
            '@angular/animations': 'node_modules/@angular/animations/bundles/animations.umd.js',
            '@angular/platform-browser/animations': 'node_modules/@angular/platform-browser/bundles/platform-browser-animations.umd.js',
            '@angular/common': 'node_modules/@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'node_modules/@angular/compiler/bundles/compiler.umd.js',
            '@angular/core': 'node_modules/@angular/core/bundles/core.umd.js',
            '@angular/forms': 'node_modules/@angular/forms/bundles/forms.umd.js',
            '@angular/http': 'node_modules/@angular/http/bundles/http.umd.js',
            '@angular/platform-browser': 'node_modules/@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/router': 'node_modules/@angular/router/bundles/router.umd.js',
            '@angular/animations/browser': 'node_modules/@angular/animations/bundles/animations-browser.umd.js',
            '@angular/common/testing': 'node_modules/@angular/common/bundles/common-testing.umd.js',
            '@angular/compiler/testing': 'node_modules/@angular/compiler/bundles/compiler-testing.umd.js',
            '@angular/core/testing': 'node_modules/@angular/core/bundles/core-testing.umd.js',
            '@angular/http/testing': 'node_modules/@angular/http/bundles/http-testing.umd.js',
            '@angular/platform-browser/testing':
                'node_modules/@angular/platform-browser/bundles/platform-browser-testing.umd.js',
            '@angular/platform-browser-dynamic/testing':
                'node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',
            '@angular/router/testing': 'node_modules/@angular/router/bundles/router-testing.umd.js',
            'primeng': 'node_modules/primeng',
            'jsoneditor': 'node_modules/jsoneditor/dist/jsoneditor-minimalist.js',
            'leaflet': 'node_modules/leaflet/dist/leaflet.js',
            'leaflet-draw': 'node_modules/leaflet-draw/dist/leaflet.draw.js',
            'moment': 'node_modules/moment/moment.js',
            'ng2-cookies/*': 'node_modules/ng2-cookies/*',
            'rxjs/*': 'node_modules/rxjs/*',
            'app/*': '/app/*',
            // For test projectConfig
            'dist/dev/*': '/base/dist/dev/*',
            '*': 'node_modules/*',
        },
        meta: {
            '*.css': {
                loader: 'css'
            }
        },
        packages: {
        },
    };

    /**
     * The configuration of SystemJS of the application.
     * Per default, the configuration of the `dev` environment will be used.
     * @type {any}
     */
    SYSTEM_CONFIG: any = this.SYSTEM_CONFIG_DEV;

    /**
     * The system builder configuration of the application.
     * @type {any}
     */
    SYSTEM_BUILDER_CONFIG: any = {
        defaultJSExtensions: true,
        base: this.PROJECT_ROOT,
        packageConfigPaths: [
            join('node_modules', '*', 'package.json'),
            join('node_modules', '@angular', '*', 'package.json')
        ],
        paths: {
            'css': 'node_modules/systemjs-plugin-css/css.js',
            'jsoneditor': 'node_modules/jsoneditor/dist/jsoneditor-minimalist.js',
            [join(this.TMP_DIR, this.BOOTSTRAP_DIR, '*')]: `${this.TMP_DIR}/${this.BOOTSTRAP_DIR}/*`,
            '@angular/platform-browser/animations': 'node_modules/@angular/platform-browser/bundles/platform-browser-animations.umd.js',
            '@angular/animations/browser': 'node_modules/@angular/animations/bundles/animations-browser.umd.js',
            'dist/tmp/node_modules/*': 'dist/tmp/node_modules/*',
            'node_modules/*': 'node_modules/*',
            '*': 'node_modules/*'
        },
        meta: {
            '*.css': {
                loader: 'css'
            }
        },
        packages: {
            '@angular/animations': {
                main: 'bundles/animations.umd.js',
                defaultExtension: 'js'
            },
            '@angular/common': {
                main: 'bundles/common.umd.js',
                defaultExtension: 'js'
            },
            '@angular/compiler': {
                main: 'bundles/compiler.umd.js',
                defaultExtension: 'js'
            },
            '@angular/core/testing': {
                main: 'bundles/core-testing.umd.js',
                defaultExtension: 'js'
            },
            '@angular/core': {
                main: 'bundles/core.umd.js',
                defaultExtension: 'js'
            },
            '@angular/forms': {
                main: 'bundles/forms.umd.js',
                defaultExtension: 'js'
            },
            '@angular/http': {
                main: 'bundles/http.umd.js',
                defaultExtension: 'js'
            },
            '@angular/platform-browser': {
                main: 'bundles/platform-browser.umd.js',
                defaultExtension: 'js'
            },
            '@angular/platform-browser-dynamic': {
                main: 'bundles/platform-browser-dynamic.umd.js',
                defaultExtension: 'js'
            },
            '@angular/router': {
                main: 'bundles/router.umd.js',
                defaultExtension: 'js'
            },
            '@angular/service-worker': {
                main: 'bundles/service-worker.umd.js',
                defaultExtension: 'js'
            },
            'rxjs': {
                main: 'Rx.js',
                defaultExtension: 'js'
            },
            'jsoneditor': {
                defaultExtension: 'js',
                format: 'global'
            }
        }
    };

    /**
     * The Autoprefixer configuration for the application.
     * @type {Array}
     */
    BROWSER_LIST = [
        'ie >= 10',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
    ];

    /**
     * White list for CSS color guard
     * @type {[string, string][]}
     */
    COLOR_GUARD_WHITE_LIST: [string, string][] = [];

    /**
     * Configurations for NPM module configurations. Add to or override in project.projectConfig.ts.
     * If you like, use the mergeObject() method to assist with this.
     */
    PLUGIN_CONFIGS: any = {
        /**
         * The BrowserSync configuration of the application.
         * The default open behavior is to open the browser. To prevent the browser from opening use the `--b`  flag when
         * running `npm start` (tested with serve.dev).
         * Example: `npm start -- --b`
         * @type {any}
         */
        'browser-sync': {
            middleware: [require('connect-history-api-fallback')({
                index: `${this.APP_BASE}index.html`
            })],
            port: this.PORT,
            startPath: this.APP_BASE,
            open: !argv['b'],
            injectChanges: false,
            server: {
                baseDir: `${this.DIST_DIR}/empty/`,
                routes: {
                    [`${this.APP_BASE}${this.APP_SRC}`]: this.APP_SRC,
                    [`${this.APP_BASE}${this.APP_DEST}`]: this.APP_DEST,
                    [`${this.APP_BASE}node_modules`]: 'node_modules',
                    [`${this.APP_BASE.replace(/\/$/, '')}`]: this.APP_DEST
                }
            }
        },

        // Note: you can customize the location of the file
        'environment-config': join(this.PROJECT_ROOT, 'env'),

        /**
         * The options to pass to gulp-sass (and then to node-sass).
         * Reference: https://github.com/sass/node-sass#options
         * @type {object}
         */
        'gulp-sass': {
            includePaths: ['./node_modules/']
        },

        /**
         * The options to pass to gulp-concat-css
         * Reference: https://github.com/mariocasciaro/gulp-concat-css
         * @type {object}
         */
        'gulp-concat-css': {
            targetFile: this.CSS_PROD_BUNDLE,
            options: {
                rebaseUrls: false
            }
        }
    };

    /**
     * Recursively merge source onto target.
     * @param {any} target The target object (to receive values from source)
     * @param {any} source The source object (to be merged onto target)
     */
    mergeObject(target: any, source: any) {
        const deepExtend = require('deep-extend');
        deepExtend(target, source);
    }

    /**
     * Locate a plugin configuration object by plugin key.
     * @param {any} pluginKey The object key to look up in PLUGIN_CONFIGS.
     */
    getPluginConfig(pluginKey: string): any {
        if (this.PLUGIN_CONFIGS[pluginKey]) {
            return this.PLUGIN_CONFIGS[pluginKey];
        }
        return null;
    }

    getInjectableStyleExtension() {
        return (this.ENV === ENVIRONMENTS.PRODUCTION || this.ENV === ENVIRONMENTS.UAT) && this.ENABLE_SCSS ? 'scss' : 'css';
    }
}

/**
 * Normalizes the given `deps` to skip globs.
 * @param {InjectableDependency[]} deps - The dependencies to be normalized.
 */
export function normalizeDependencies(deps: InjectableDependency[]) {
    deps
        .filter((d: InjectableDependency) => !/\*/.test(d.src)) // Skip globs
        .forEach((d: InjectableDependency) => d.src = require.resolve(d.src));
    return deps;
}

/**
 * Returns if the given dependency is used in the given environment.
 * @param  {string}               env - The environment to be filtered for.
 * @param  {InjectableDependency} d   - The dependency to check.
 * @return {boolean}                    `true` if the dependency is used in this environment, `false` otherwise.
 */
function filterDependency(env: string, d: InjectableDependency): boolean {
    if (!d.env) {
        d.env = Object.keys(ENVIRONMENTS).map(k => ENVIRONMENTS[k]);
    }
    if (!(d.env instanceof Array)) {
        (<any>d).env = [d.env];
    }
    return d.env.indexOf(env) >= 0;
}

/**
 * Returns the applications version as defined in the `package.json`.
 * @return {number} The applications version.
 */
function appVersion(): number | string {
    let pkg = require('../package.json');
    return pkg.version;
}

/**
 * Returns the linting configuration to be used for `codelyzer`.
 * @return {string[]} The list of linting rules.
 */
function customRules(): string[] {
    let lintConf = require('../tslint.json');
    return lintConf.rulesDirectory;
}

/**
 * Returns the environment of the application.
 */
function getEnvironment() {
    let base: string[] = argv['_'];
    let uatKeyword = !!base.filter(o => o.indexOf(ENVIRONMENTS.UAT) >= 0).pop();
    let prodKeyword = !!base.filter(o => o.indexOf(ENVIRONMENTS.PRODUCTION) >= 0).pop();
    let env = (argv['env'] || '').toLowerCase();
    if ((base && uatKeyword) || env === ENVIRONMENTS.UAT) {
        return ENVIRONMENTS.UAT;
    } else if ((base && prodKeyword) || env === ENVIRONMENTS.PRODUCTION) {
        return ENVIRONMENTS.PRODUCTION;
    } else {
        return ENVIRONMENTS.DEVELOPMENT;
    }
}
