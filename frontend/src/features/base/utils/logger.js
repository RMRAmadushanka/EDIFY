/* eslint-disable no-console */
/**
 * Logger class for managing errors, info, warnings and logs
 */
class Logger {
  constructor() {
    this.prep = (messages) => ['hdip-log::', ...messages];
  }

  error = (...error) => {
    console.error(...this.prep(error));
  };

  info = (...message) => {
    console.info(...this.prep(message));
  };

  warn = (...message) => {
    console.warn(...this.prep(message));
  };

  log = (...message) => {
    console.log(...this.prep(message));
  };
}
//
export default new Logger();
