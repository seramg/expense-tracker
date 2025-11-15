export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const days = date.getDate();
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert hours from 24-hour to 12-hour format
  hours = hours % 12;
  // The hour '0' should be '12'
  hours = hours ? hours : 12;

  // Pad minutes with a leading zero if needed
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${days} ${monthName} ${year}, ${hours}:${formattedMinutes} ${ampm}`;
};
