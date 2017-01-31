import Config from '../../../config/config';
import { clean } from '../../utils';

/**
 * Executes the build process, cleaning all files within the `/dist/dev` and `dist/tmp` directory.
 */
export = clean([Config.UAT_DEST, Config.TMP_DIR]);
