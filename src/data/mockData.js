import {
  getDaysAgoDate,
  parseRecordDateTime,
  toLocalDateInputValue,
} from "../lib/date";

function createId() {
  return `record_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
}

function createRecord({ daysAgo, time, status, note }) {
  const date = toLocalDateInputValue(getDaysAgoDate(daysAgo));
  const timestamp = parseRecordDateTime(date, time).getTime();
  return {
    id: createId(),
    date,
    time,
    timestamp,
    status,
    note,
  };
}

export function createSampleState() {
  const records = [
    createRecord({
      daysAgo: 0,
      time: "07:18",
      status: "smooth",
      note: "起床后很顺，状态轻松。",
    }),
    createRecord({
      daysAgo: 1,
      time: "08:04",
      status: "smooth",
      note: "早餐前完成，节律很稳。",
    }),
    createRecord({
      daysAgo: 2,
      time: "09:26",
      status: "normal",
      note: "稍慢一点，但整体还可以。",
    }),
    createRecord({
      daysAgo: 4,
      time: "07:42",
      status: "smooth",
      note: "今天感觉通畅。",
    }),
    createRecord({
      daysAgo: 5,
      time: "20:16",
      status: "difficult",
      note: "晚饭后才有感觉，喝水有点少。",
    }),
    createRecord({
      daysAgo: 7,
      time: "08:18",
      status: "smooth",
      note: "节奏恢复正常。",
    }),
    createRecord({
      daysAgo: 8,
      time: "08:31",
      status: "normal",
      note: "正常记录，无额外备注。",
    }),
    createRecord({
      daysAgo: 10,
      time: "07:52",
      status: "smooth",
      note: "早晨状态很自然。",
    }),
    createRecord({
      daysAgo: 12,
      time: "13:08",
      status: "normal",
      note: "中午补一条，最近作息在调整。",
    }),
    createRecord({
      daysAgo: 14,
      time: "08:11",
      status: "smooth",
      note: "这周状态不错。",
    }),
    createRecord({
      daysAgo: 16,
      time: "21:14",
      status: "difficult",
      note: "熬夜后节律有点乱。",
    }),
    createRecord({
      daysAgo: 18,
      time: "07:37",
      status: "normal",
      note: "一般般，准备多补水。",
    }),
    createRecord({
      daysAgo: 21,
      time: "08:09",
      status: "smooth",
      note: "周末心情轻松，节律也更稳。",
    }),
    createRecord({
      daysAgo: 24,
      time: "19:46",
      status: "normal",
      note: "外出后记录略晚。",
    }),
    createRecord({
      daysAgo: 27,
      time: "07:58",
      status: "smooth",
      note: "起床后即记录。",
    }),
  ].sort((a, b) => b.timestamp - a.timestamp);

  return {
    version: 1,
    records,
    settings: {
      reminderTime: "20:30",
      thresholds: {
        noRecordDays: 2,
        minWeeklyCount: 3,
      },
      tone: "gentle",
      theme: "system",
    },
  };
}
