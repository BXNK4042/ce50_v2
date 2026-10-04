export function getStudentGeneration(studentId: number | string): string {
  const str = String(studentId).trim();
  const yearPrefix = parseInt(str.substring(0, 2), 10);
  if (!isNaN(yearPrefix) && yearPrefix >= 60) {
    const genNum = yearPrefix - 63;
    if (genNum > 0) {
      return `CE${genNum.toString().padStart(2, "0")}`;
    }
  }
  return "CE04";
}
