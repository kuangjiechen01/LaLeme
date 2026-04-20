import {
  formatMonthDay,
  formatTimeLabel,
  getDayDiff,
  getRecentDateRange,
  getTimeBucket,
  getWeekdayLabel,
  humanizeSince,
} from "./date";

export const STATUS_META = {
  smooth: {
    label: "顺畅",
    accent: "var(--success)",
    soft: "rgba(88, 143, 93, 0.16)",
  },
  normal: {
    label: "一般",
    accent: "var(--accent)",
    soft: "rgba(175, 132, 94, 0.16)",
  },
  difficult: {
    label: "困难",
    accent: "var(--warning)",
    soft: "rgba(184, 110, 77, 0.18)",
  },
};

const toneCopies = {
  gentle: {
    idle: "近期记录较规律，请继续保持。",
    noRecord: "这几天沉默得有点久，记得关注一下状态。",
    lowFrequency: "近 7 天记录偏少，建议留意饮食、饮水和休息。",
  },
  formal: {
    idle: "近期记录稳定，可继续保持观察。",
    noRecord: "最近排便频率偏低，请留意肠胃状态变化。",
    lowFrequency: "频率低于常见范围，建议关注饮食、饮水与作息。",
  },
  light: {
    idle: "最近节律不错，肠胃状态在线。",
    noRecord: "你的肠胃在等一条新动态，别忘了回来汇报。",
    lowFrequency: "最近更新有点少，试试多喝水、早点睡。",
  },
};

export function getTodayCount(records) {
  return records.filter((record) => getDayDiff(record.date) === 0).length;
}

export function getLastRecord(records) {
  return records[0] ?? null;
}

export function countWithinDays(records, days) {
  return records.filter((record) => getDayDiff(record.date) < days).length;
}

export function getAverageDaily(records, days = 30) {
  return Number((countWithinDays(records, days) / days).toFixed(1));
}

export function getConsecutiveRecordDays(records) {
  const daySet = new Set(records.map((record) => record.date));
  let streak = 0;
  let cursor = 0;

  while (true) {
    const date = getRecentDateRange(cursor + 1)[0];
    if (!daySet.has(date)) {
      if (cursor === 0 && !daySet.has(getRecentDateRange(1)[0])) {
        return 0;
      }
      break;
    }
    streak += 1;
    cursor += 1;
  }

  return streak;
}

export function getSevenDayChart(records, days = 7) {
  return getRecentDateRange(days).map((dateValue) => {
    const count = records.filter((record) => record.date === dateValue).length;
    return {
      date: dateValue,
      label: formatMonthDay(dateValue),
      count,
    };
  });
}

export function getWeekdayTrend(records) {
  const base = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map(
    (label) => ({
      label,
      count: 0,
    }),
  );

  records.forEach((record) => {
    const weekday = getWeekdayLabel(record.date);
    const index = base.findIndex((item) => item.label === weekday);
    if (index >= 0) {
      base[index].count += 1;
    }
  });

  return base;
}

export function getTimeDistribution(records) {
  const map = new Map([
    ["早晨", 0],
    ["中午", 0],
    ["下午", 0],
    ["夜间", 0],
  ]);

  records.forEach((record) => {
    map.set(getTimeBucket(record.time), map.get(getTimeBucket(record.time)) + 1);
  });

  return Array.from(map.entries()).map(([label, value], index) => ({
    label,
    value,
    fill: [
      "rgba(88, 143, 93, 0.85)",
      "rgba(175, 132, 94, 0.85)",
      "rgba(198, 162, 116, 0.85)",
      "rgba(120, 137, 106, 0.85)",
    ][index],
  }));
}

export function calculateRhythmScore(records) {
  if (records.length < 3) return 46;

  const ordered = [...records].sort((a, b) => a.timestamp - b.timestamp);
  const dayIntervals = [];
  const minuteSamples = [];

  for (let index = 1; index < ordered.length; index += 1) {
    dayIntervals.push((ordered[index].timestamp - ordered[index - 1].timestamp) / 86400000);
  }

  ordered.forEach((record) => {
    const [hours, minutes] = record.time.split(":").map(Number);
    minuteSamples.push(hours * 60 + minutes);
  });

  const intervalAverage =
    dayIntervals.reduce((sum, value) => sum + value, 0) / dayIntervals.length;
  const intervalVariance =
    dayIntervals.reduce((sum, value) => sum + (value - intervalAverage) ** 2, 0) /
    dayIntervals.length;
  const minuteAverage =
    minuteSamples.reduce((sum, value) => sum + value, 0) / minuteSamples.length;
  const minuteVariance =
    minuteSamples.reduce((sum, value) => sum + (value - minuteAverage) ** 2, 0) /
    minuteSamples.length;

  const intervalPenalty = Math.min(36, Math.sqrt(intervalVariance) * 18);
  const timingPenalty = Math.min(28, Math.sqrt(minuteVariance) / 18);
  const activityBonus = Math.min(12, countWithinDays(records, 7) * 1.8);

  return Math.max(18, Math.min(96, Math.round(86 - intervalPenalty - timingPenalty + activityBonus)));
}

export function getReminderState(records, settings) {
  const toneSet = toneCopies[settings.tone] ?? toneCopies.gentle;
  const lastRecord = getLastRecord(records);
  const daysSinceLast = lastRecord ? getDayDiff(lastRecord.date) : Infinity;
  const weeklyCount = countWithinDays(records, 7);

  if (!lastRecord || daysSinceLast > settings.thresholds.noRecordDays) {
    return {
      level: "warning",
      title: "提醒你看一眼最近状态",
      message: toneSet.noRecord,
      details: "这不是医疗诊断，只是日常健康记录与习惯提醒。",
    };
  }

  if (weeklyCount < settings.thresholds.minWeeklyCount) {
    return {
      level: "attention",
      title: "本周频率有点低",
      message: toneSet.lowFrequency,
      details: "如果持续不适，请按需咨询专业医生。",
    };
  }

  return {
    level: "good",
    title: "状态轻稳，继续保持",
    message: toneSet.idle,
    details: "这是一份私密记录，不用于医疗诊断。",
  };
}

export function getSummary(records, settings) {
  const todayCount = getTodayCount(records);
  const lastRecord = getLastRecord(records);
  const weeklyCount = countWithinDays(records, 7);
  const monthlyCount = countWithinDays(records, 30);
  const reminder = getReminderState(records, settings);
  const rhythmScore = calculateRhythmScore(records);
  const lastSince = lastRecord ? humanizeSince(lastRecord.timestamp) : "暂无";
  const consecutiveDays = getConsecutiveRecordDays(records);
  const avgDaily = getAverageDaily(records, 30);
  const peakBucket =
    getTimeDistribution(records)
      .slice()
      .sort((a, b) => b.value - a.value)[0]?.label ?? "还在观察";

  return {
    todayCount,
    lastRecord,
    weeklyCount,
    monthlyCount,
    reminder,
    rhythmScore,
    lastSince,
    consecutiveDays,
    avgDaily,
    peakBucket,
  };
}

export function getHistoryRangeRecords(records, range) {
  if (range === "all") return records;
  if (range === "today") {
    return records.filter((record) => getDayDiff(record.date) === 0);
  }

  const days = Number(range);
  return records.filter((record) => getDayDiff(record.date) < days);
}

export function groupRecordsByDate(records) {
  return records.reduce((groups, record) => {
    const bucket = groups.find((item) => item.date === record.date);
    if (bucket) {
      bucket.records.push(record);
    } else {
      groups.push({
        date: record.date,
        records: [record],
      });
    }
    return groups;
  }, []);
}

export function getRhythmHighlights(records) {
  if (!records.length) {
    return {
      activeWindow: "暂无数据",
      averageTime: "还没形成节律",
      latestEntry: "暂无",
    };
  }

  const minutes = records.map((record) => {
    const [hours, mins] = record.time.split(":").map(Number);
    return hours * 60 + mins;
  });

  const avgMinutes =
    minutes.reduce((sum, value) => sum + value, 0) / Math.max(1, minutes.length);
  const avgHour = Math.floor(avgMinutes / 60);
  const avgMinute = Math.round(avgMinutes % 60);
  const latestEntry = records[0];

  return {
    activeWindow: getTimeDistribution(records).sort((a, b) => b.value - a.value)[0]?.label ?? "待观察",
    averageTime: formatTimeLabel(
      `${String(avgHour).padStart(2, "0")}:${String(avgMinute).padStart(2, "0")}`,
    ),
    latestEntry: `${formatMonthDay(latestEntry.date)} ${latestEntry.time}`,
  };
}
