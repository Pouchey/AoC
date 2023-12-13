export type LogType = 'info' | 'log' | 'warn' | 'error' | 'rainbow';

export type ColorType =
  | 'reset'
  | 'blue'
  | 'cyan'
  | 'green'
  | 'magenta'
  | 'red'
  | 'yellow'
  | 'rainbow'
  | 'christmas'
  | null;

const colors = {
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

/**
 * Colorizes a message with the specified color.
 * @param color - The color to apply to the message.
 * @param message - The message to colorize.
 * @returns The colorized message.
 */
const colorize = (color: ColorType, message: string): string => {
  if (color === 'rainbow') {
    const rainbow = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'];
    const rainbowMessage = message
      .split('')
      .map((letter, index) => {
        const color = rainbow[index % rainbow.length] as keyof ColorType;
        return colorize(color, letter);
      })
      .join('');
    return rainbowMessage;
  }

  if (color === 'christmas') {
    const rainbow = ['red', 'green'];
    const rainbowMessage = message
      .split(' ')
      .map((letter, index) => {
        const color = rainbow[index % rainbow.length] as keyof ColorType;
        return colorize(color, letter);
      })
      .join(' ');

    return rainbowMessage;
  }

  if (!colors[color as keyof ColorType]) return message;

  return `${colors[color as keyof ColorType]}${message}${colors.reset}`;
};

/**
 * Logs a message to the console.
 * @param message - The message to log.
 * @param type - The type of log message (default: 'log').
 * @param color - The color of the log message (default: null).
 */
export const log = (message: string, type: LogType = 'log', color: ColorType = null) => {
  const msg = color ? colorize(color, message) : message;

  switch (type) {
    case 'info':
      console.info(msg);
      break;
    case 'warn':
      console.warn(msg);
      break;
    case 'error':
      console.error(msg);
      break;
    case 'log':
    default:
      console.log(msg);
      break;
  }
};
