/**
 * Setup the jet-logger.
 *
 * Documentation: https://github.com/seanpmaxwell/jet-logger
 */
import exp from 'constants';
import Logger from 'jet-logger';

const logger = new Logger();

export enum SECTION {
    SMS,EMAIL,LOGIN,
}

export const appLogger  = () => {

}

export default logger;
