export interface CohortInfo {
  code: string;       // e.g. "CE04"
  prefix: string;     // e.g. "67"
  generation: number; // e.g. 4
  labelTh: string;    // "รุ่นที่ 4"
  labelEn: string;    // "CE04"
}

export function getGenerationFromPrefix(prefix: string | number): number | null {
  const num = typeof prefix === "number" ? prefix : parseInt(prefix, 10);
  if (isNaN(num) || num < 40) return null;
  const gen = num - 63;
  return gen > 0 ? gen : null;
}

export function getCohortNumber(cohortOrId: string): number | null {
  if (!cohortOrId) return null;
  const str = String(cohortOrId).trim().toUpperCase();

  const prefixMatch = str.match(/^(\d{2})/);
  if (prefixMatch) {
    const yearPrefix = parseInt(prefixMatch[1], 10);
    if (yearPrefix >= 40 && yearPrefix <= 99) {
      return yearPrefix - 63;
    }
  }

  const ceMatch = str.match(/^CE0*(\d+)$/);
  if (ceMatch) {
    return parseInt(ceMatch[1], 10);
  }

  return null;
}

export function getCohortCodeFromStudentId(studentId: string): string {
  const num = getCohortNumber(studentId);
  if (num !== null && num > 0) {
    return `CE${String(num).padStart(2, "0")}`;
  }
  return studentId;
}

export function formatCohortLabel(input: string | null | undefined, lang: string = "th"): string {
  if (!input) return "";

  let gen: number | null = getCohortNumber(input);
  if (gen === null) {
    const str = input.trim();
    if (/^\d{8}$/.test(str)) {
      gen = getGenerationFromPrefix(str.slice(0, 2));
    } else if (/^\d{2}$/.test(str)) {
      gen = getGenerationFromPrefix(str);
    } else if (/^CE\d{1,2}$/i.test(str)) {
      const num = parseInt(str.slice(2), 10);
      if (!isNaN(num)) gen = num;
    }
  }

  if (gen !== null && gen > 0) {
    const formattedGen = gen < 10 ? `0${gen}` : `${gen}`;
    return lang === "th" ? `รุ่นที่ ${gen}` : `CE${formattedGen}`;
  }

  return String(input);
}
