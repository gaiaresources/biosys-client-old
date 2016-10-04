import { startKarma } from '../../utils/biosys/karma.start';
import Config from '../../../config/config';

/**
 * Executes the build process, running all unit tests using `karma`.
 */
export = (done: any) => {
  return startKarma(done, Config.KARMA_REPORTERS);
};
