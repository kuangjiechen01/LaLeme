const zhDateFormatter = new Intl.DateTimeFormat("zh-CN", {
  month: "numeric",
  day: "numeric",
  weekday: "short",
});

const zhMonthDayFormatter = new Intl.DateTimeFormat("zh-CN", {
  month: "numeric",
  day: "numeric",
});

const zhLongFormatter = new Intl.DateTimeFormat("zh-CN", {
  month: "long",
  day: "numeric",
  weekday: "long",
});

export function toLocalDateInputValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function toLocalTimeInputValue(date = new Date()) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function parseRecordDateTime(dateValue, timeValue) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hours, minutes] = timeValue.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

export function formatCalendarLabel(dateValue) {
  const target = parseRecordDateTime(dateValue, "12:00");
  return zhDateFormatter.format(target);
}

export function formatMonthDay(dateValue) {
  return zhMonthDayFormatter.format(parseRecordDateTime(dateValue, "12:00"));
}

export function formatHeroDate(date = new Date()) {
  return zhLongFormatter.format(date);
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getDayDiff(dateLike) {
  const target =
    typeof dateLike === "string" && dateLike.includes("-")
      ? parseRecordDateTime(dateLike, "12:00")
      : new Date(dateLike);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const compareDay = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  );
  return Math.round((today - compareDay) / 86400000);
}

export function getDaysAgoDate(daysAgo) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return date;
}

export function getRecentDateRange(days) {
  return Array.from({ length: days }, (_, index) => {
    const date = getDaysAgoDate(days - index - 1);
    return toLocalDateInputValue(date);
  });
}

export function formatTimeLabel(timeValue) {
  return timeValue;
}

export function relativeDateLabel(dateValue) {
  const diff = getDayDiff(dateValue);
  if (diff === 0) return "今天";
  if (diff === 1) return "昨天";
  if (diff === 2) return "前天";
  return formatCalendarLabel(dateValue);
}

export function humanizeSince(timestamp) {
  if (!timestamp) return "暂无记录";
  const delta = Date.now() - timestamp;
  const minutes = Math.max(1, Math.floor(delta / 60000));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    const remainHours = hours % 24;
    return remainHours > 0 ? `${days} 天 ${remainHours} 小时` : `${days} 天`;
  }
  if (hours > 0) {
    const remainMinutes = minutes % 60;
    return remainMinutes > 0 ? `${hours} 小时 ${remainMinutes} 分钟` : `${hours} 小时`;
  }
  return `${minutes} 分钟`;
}

export function getTimeBucket(timeValue) {
  const [hours] = timeValue.split(":").map(Number);
  if (hours >= 5 && hours < 11) return "早晨";
  if (hours >= 11 && hours < 14) return "中午";
  if (hours >= 14 && hours < 18) return "下午";
  return "夜间";
}

export function formatLastRecord(record) {
  if (!record) return "还没有记录";
  return `${relativeDateLabel(record.date)} ${record.time}`;
}

export function formatFriendlyDateTime(timestamp) {
  if (!timestamp) return "暂无";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function getWeekdayLabel(dateValue) {
  return new Intl.DateTimeFormat("zh-CN", { weekday: "short" }).format(
    parseRecordDateTime(dateValue, "12:00"),
  );
}
