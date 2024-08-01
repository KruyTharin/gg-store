import moment from 'moment';

export function formatDateTime(date: string | Date): string {
  if (date != null) {
    return moment(new Date(date)).format('DD/MM/YYYY HH:mm:ss A');
  }

  return 'N/A';
}
