export const QUESTIONS = [
  {
    id: 'goal',
    question: 'هدف شما چیست؟',
    subtitle: 'بر اساس هدف شما، برنامه غذایی میسازیم',
    type: 'options',
    options: [
      { value: 'lose_weight', label: 'کاهش وزن', emoji: '🔻', sub: 'کم کردن چربی' },
      { value: 'maintain', label: 'حفظ وزن', emoji: '⚖️', sub: 'تثبیت وزن فعلی' },
      { value: 'gain_muscle', label: 'افزایش عضله', emoji: '💪', sub: 'عضلهسازی' },
    ],
  },
  {
    id: 'gender',
    question: 'جنسیت شما؟',
    subtitle: 'انتخاب جنسیت به محاسبات دقیق‌تر کمک می‌کند',
    type: 'options',
    options: [
      { value: 'male', label: 'مرد', emoji: '👨' },
      { value: 'female', label: 'زن', emoji: '👩' },
    ],
  },
  {
    id: 'age',
    question: 'چند سالتونه؟',
    subtitle: 'سن شما در محاسبه کالری تاثیر دارد',
    type: 'number',
    placeholder: 'مثلاً ۲۵',
    unit: 'سال',
  },
  {
    id: 'weights',
    question: 'وزن شما؟',
    subtitle: 'وزن فعلی و هدف خود را وارد کنید',
    type: 'dual_number',
    placeholders: ['وزن فعلی (کیلوگرم)', 'وزن هدف (کیلوگرم)'],
  },
  {
    id: 'activity',
    question: 'سطح فعالیت شما؟',
    subtitle: 'میانگین فعالیت روزانهتان را انتخاب کنید',
    type: 'options',
    options: [
      { value: 'sedentary', label: 'کم تحرک', emoji: '🛋️', sub: 'بیشتر نشسته ام' },
      { value: 'moderate', label: 'متوسط', emoji: '🚶', sub: 'کمی ورزش میکنم' },
      { value: 'active', label: 'فعال', emoji: '🏃', sub: 'ورزش منظم دارم' },
    ],
  },
  {
    id: 'disliked_foods',
    question: 'چه غذاهایی دوست نداری؟',
    subtitle: 'اگر غذایی هست که نمیخوری، اینجا بنویس. میتونی چند تا بنویسی.',
    type: 'text_input',
    placeholder: 'مثلاً: جگر، ماهی، گوشت گوسفند...',
    optional: true,
  },
];

export const DAYS_OF_WEEK = ["شنبه", "یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];
