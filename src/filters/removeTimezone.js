
export default function (dateWithTimezone) {
  if (!dateWithTimezone) return dateWithTimezone;
  const [date] = dateWithTimezone.split('T');
  return date || dateWithTimezone;
}
