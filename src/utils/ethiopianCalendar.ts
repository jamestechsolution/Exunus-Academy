import { CalendarType, LanguageCode } from '../types';

export interface EthiopianDate {
  year: number;
  month: number; // 1-13
  day: number; // 1-30 (or 1-6 for Pagume)
}

export const ETHIOPIAN_MONTHS = {
  am: [
    'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት',
    'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'
  ],
  om: [
    'Fulbaana', 'Onkololeessa', 'Sadaasa', 'Muddee', 'Amajjii', 'Guraandhala',
    'Bitootessa', 'Ebla', 'Caamsaa', 'Waxabajjii', 'Adooleessa', 'Hagayya', 'Qaammee'
  ],
  en: [
    'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yakatit',
    'Megabit', 'Miyazya', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'
  ]
};

export const GREGORIAN_MONTHS = {
  am: [
    'ጃንዋሪ', 'ፌብሩዋሪ', 'ማርች', 'ኤፕሪል', 'ሜይ', 'ጁን',
    'ጁላይ', 'ኦገስት', 'ሴፕቴምበር', 'ኦክቶበር', 'ኖቬምበር', 'ዲሴምበር'
  ],
  om: [
    'Amajjii', 'Guraandhala', 'Bitootessa', 'Ebla', 'Caamsaa', 'Waxabajjii',
    'Adooleessa', 'Hagayya', 'Fuulbaana', 'Onkololeessa', 'Sadaasa', 'Muddee'
  ],
  en: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
};

export const WEEKDAYS = {
  am: ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'],
  om: ['Dilbata', 'Wiixata', 'Kibxata', 'Roobii', 'Kamisa', 'Jimaata', 'Sanbata'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
};

/**
 * Converts a Gregorian date (Date object or YYYY-MM-DD string) to Ethiopian Date
 */
export function gregorianToEthiopian(dateInput: Date | string): EthiopianDate {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) {
    return { year: 2017, month: 1, day: 1 };
  }

  const gy = date.getFullYear();
  const gm = date.getMonth() + 1;
  const gd = date.getDate();

  // Julian Day Number Calculation
  const a = Math.floor((14 - gm) / 12);
  const y = gy + 4800 - a;
  const m = gm + 12 * a - 3;
  const jdn = gd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  // Conversion from JDN to Ethiopian Calendar
  const r = (jdn - 1723856) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  const ethYear = 4 * Math.floor((jdn - 1723856) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
  const ethMonth = Math.floor(n / 30) + 1;
  const ethDay = (n % 30) + 1;

  return {
    year: ethYear,
    month: ethMonth,
    day: ethDay
  };
}

/**
 * Formats date into readable string based on user's calendar and language preferences
 */
export function formatEduDate(
  dateInput: Date | string | null | undefined,
  calendarType: CalendarType = 'ethiopian',
  language: LanguageCode = 'en'
): string {
  if (!dateInput) return '—';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return String(dateInput);

  if (calendarType === 'ethiopian') {
    const eth = gregorianToEthiopian(date);
    const monthName = ETHIOPIAN_MONTHS[language][eth.month - 1] || ETHIOPIAN_MONTHS.en[eth.month - 1];
    if (language === 'am') {
      return `${monthName} ${eth.day}፣ ${eth.year} ዓ.ም`;
    } else if (language === 'om') {
      return `${monthName} ${eth.day}, ${eth.year} A.L.I`;
    }
    return `${monthName} ${eth.day}, ${eth.year} E.C.`;
  } else {
    const gy = date.getFullYear();
    const gm = date.getMonth();
    const gd = date.getDate();
    const monthName = GREGORIAN_MONTHS[language][gm] || GREGORIAN_MONTHS.en[gm];
    return `${monthName} ${gd}, ${gy} G.C.`;
  }
}

/**
 * Returns current Ethiopian Year / Academic Year label
 */
export function getCurrentAcademicYearLabel(calendarType: CalendarType = 'ethiopian'): string {
  const eth = gregorianToEthiopian(new Date());
  const nextYear = eth.year + 1;
  if (calendarType === 'ethiopian') {
    return `${eth.year}-${nextYear} ዓ.ም`;
  }
  const gcYear = new Date().getFullYear();
  return `${gcYear}-${gcYear + 1} G.C.`;
}

/**
 * Calculates Ethiopian Ministry of Education Letter Grade and GPA points from percentage
 */
export function calculateEthiopianGrade(percentage: number): {
  letter: string;
  grade: string;
  points: number;
  gpa: number;
  description: string;
} {
  if (percentage >= 90) return { letter: 'A+', grade: 'A+', points: 4.0, gpa: 4.0, description: 'Excellent / እጅግ በጣም ጥሩ' };
  if (percentage >= 85) return { letter: 'A', grade: 'A', points: 4.0, gpa: 4.0, description: 'Excellent / በጣም ጥሩ' };
  if (percentage >= 80) return { letter: 'A-', grade: 'A-', points: 3.75, gpa: 3.75, description: 'Very Good / በጣም ጥሩ' };
  if (percentage >= 75) return { letter: 'B+', grade: 'B+', points: 3.5, gpa: 3.5, description: 'Good / ጥሩ' };
  if (percentage >= 70) return { letter: 'B', grade: 'B', points: 3.0, gpa: 3.0, description: 'Good / ጥሩ' };
  if (percentage >= 65) return { letter: 'B-', grade: 'B-', points: 2.75, gpa: 2.75, description: 'Satisfactory / አጥጋቢ' };
  if (percentage >= 60) return { letter: 'C+', grade: 'C+', points: 2.5, gpa: 2.5, description: 'Satisfactory / አጥጋቢ' };
  if (percentage >= 50) return { letter: 'C', grade: 'C', points: 2.0, gpa: 2.0, description: 'Pass / ማለፊያ' };
  if (percentage >= 40) return { letter: 'D', grade: 'D', points: 1.0, gpa: 1.0, description: 'Conditional Pass / ዝቅተኛ' };
  return { letter: 'F', grade: 'F', points: 0.0, gpa: 0.0, description: 'Fail / የወደቀ' };
}
