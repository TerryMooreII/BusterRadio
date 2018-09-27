import moment from 'moment';

export default function (date) {
  if (!date) return '';
  return moment(date).format('LL');
}
