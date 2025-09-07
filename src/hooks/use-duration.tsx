// src/utils/formatDuration.ts
export default function useDaysAndHours(days: number): string {
  if (isNaN(days)) return "";

  const wholeDays = Math.floor(days);
  const remainingHours = Math.round((days - wholeDays) * 24);

  const result: string[] = [];

  if (wholeDays > 0) {
    result.push(`${wholeDays} day${wholeDays > 1 ? "s" : ""}`);
  }

  if (remainingHours > 0) {
    result.push(`${remainingHours} hr${remainingHours > 1 ? "s" : ""}`);
  }

  if (result.length === 0) {
    result.push("0 days");
  }

  return result.join(" ");
}
