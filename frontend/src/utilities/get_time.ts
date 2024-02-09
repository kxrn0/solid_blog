export default function formatTime(yesterday: number) {
  const units = [
    { label: "year", millis: 31536000000 },
    { label: "month", millis: 2592000000 },
    { label: "week", millis: 604800000 },
    { label: "day", millis: 86400000 },
    { label: "hour", millis: 3600000 },
    { label: "minute", millis: 60000 },
  ];
  const today = Date.now();
  const diff = today - yesterday;

  for (const unit of units)
    if (diff >= unit.millis) {
      const amount = Math.floor(diff / unit.millis);

      return `${amount} ${unit.label}${amount > 1 ? "s" : ""} ago`;
    }

  return "a minute ago";
}
