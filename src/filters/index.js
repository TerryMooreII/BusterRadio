import dateformat from './dateformat';
import removeTimezone from './removeTimezone';

export default [
  {
    name: 'dateformat',
    execute: dateformat
  },
  {
    name: 'removeTimezone',
    execute: removeTimezone
  }
];
