export function formatWithOrdinal(dateStr: string) {
  const [time, rest] = dateStr.split(", ");
  const [dayStr, month, year] = rest.split(" ");

  const day = parseInt(dayStr, 10);

  const getOrdinal = (n: number) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  return `${time}, ${day}${getOrdinal(day)} ${month} ${year}`;
}
