export const defaultProtocolValidityInDays = 180;
// function to convert date to EU format
export function convertDateToEU(date: string | Date): string {
    if (typeof date === 'string' && !date.includes('/')) {
        date = new Date(date);
    }
    const dateObj = typeof date === 'string' 
        ? new Date(convertDateFromEU(date)) 
        : date instanceof Date 
            ? new Date(date)
            : date;
    
    return `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
}
// function to return date from string in EU format
export function convertDateFromEU(date: string): Date {
  const [day, month, year] = date.split('/');
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export const MY_FORMATS = {
    parse: {
      dateInput: 'LL',
    },
    display: {
      dateInput: 'LL',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    },
};
