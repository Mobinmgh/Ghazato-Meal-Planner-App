export const demoMealPlan = {
  daily_calorie_target: 1850,
  summary: "یک برنامه متعادل و ایرانی برای یک هفته، با وعده‌های ساده، در دسترس و مناسب نمایش دمو.",
  days: [
    {
      day: "شنبه",
      total_calories: 1840,
      meals: {
        breakfast: {
          name: "املت گوجه با نان سنگک",
          calories: 390,
          note: "صبحانه گرم و سریع با مواد در دسترس",
          prep_time: "۱۰ دقیقه",
          cook_time: "۱۵ دقیقه",
          servings: 1,
          difficulty: "آسان",
          ingredients: [
            { name: "تخم‌مرغ", amount: "۲", unit: "عدد" },
            { name: "گوجه‌فرنگی", amount: "۲", unit: "عدد" },
            { name: "نان سنگک", amount: "یک‌چهارم", unit: "عدد" },
          ],
          steps: ["گوجه را خرد کنید و با کمی روغن تفت دهید.", "تخم‌مرغ‌ها را اضافه کنید و بگذارید ببندد.", "با نان سنگک گرم سرو کنید."],
          nutrition: { protein: 20, carbs: 38, fat: 17, fiber: 5 },
          tips: "برای کاهش کالری، روغن را با قاشق اندازه‌گیری کنید.",
        },
        lunch: {
          name: "عدس‌پلو با سالاد شیرازی",
          calories: 620,
          note: "ناهار خانگی و سیرکننده",
          prep_time: "۱۵ دقیقه",
          cook_time: "۴۵ دقیقه",
          servings: 1,
          difficulty: "متوسط",
          ingredients: [
            { name: "برنج", amount: "۱", unit: "پیمانه" },
            { name: "عدس پخته", amount: "نصف", unit: "پیمانه" },
            { name: "خیار و گوجه", amount: "۱", unit: "کاسه" },
          ],
          steps: ["عدس و برنج را جداگانه آماده کنید.", "مواد را لایه‌لایه دم بگذارید.", "کنار سالاد شیرازی سرو کنید."],
          nutrition: { protein: 22, carbs: 92, fat: 14, fiber: 11 },
          tips: "کشمش را کم اضافه کنید تا قند وعده کنترل شود.",
        },
        dinner: {
          name: "مرغ گریل با سبزیجات",
          calories: 560,
          note: "شام سبک با پروتئین کافی",
          prep_time: "۱۰ دقیقه",
          cook_time: "۲۵ دقیقه",
          servings: 1,
          difficulty: "آسان",
          ingredients: [
            { name: "سینه مرغ", amount: "۱۵۰", unit: "گرم" },
            { name: "کدو و هویج", amount: "۲", unit: "پیمانه" },
            { name: "ماست کم‌چرب", amount: "نصف", unit: "لیوان" },
          ],
          steps: ["مرغ را با ادویه مزه‌دار کنید.", "مرغ و سبزیجات را گریل یا تابه‌ای کنید.", "با ماست کم‌چرب سرو کنید."],
          nutrition: { protein: 45, carbs: 35, fat: 18, fiber: 8 },
          tips: "آب‌لیمو و زعفران طعم غذا را بدون کالری زیاد بهتر می‌کند.",
        },
        snack: {
          name: "سیب و گردو",
          calories: 270,
          note: "میان‌وعده ساده برای کنترل گرسنگی",
          prep_time: "۵ دقیقه",
          cook_time: "۰ دقیقه",
          servings: 1,
          difficulty: "آسان",
          ingredients: [
            { name: "سیب", amount: "۱", unit: "عدد" },
            { name: "گردو", amount: "۳", unit: "عدد" },
          ],
          steps: ["سیب را خرد کنید.", "کنار گردو میل کنید."],
          nutrition: { protein: 5, carbs: 28, fat: 15, fiber: 6 },
          tips: "گردو را از قبل سهم‌بندی کنید.",
        },
      },
    },
    {
      day: "یکشنبه",
      total_calories: 1810,
      meals: {
        breakfast: { name: "پنیر و گردو با سبزی", calories: 360, note: "صبحانه سنتی و متعادل", prep_time: "۵ دقیقه", cook_time: "۰ دقیقه", servings: 1, difficulty: "آسان", ingredients: [{ name: "پنیر", amount: "۴۰", unit: "گرم" }, { name: "گردو", amount: "۲", unit: "عدد" }, { name: "نان", amount: "یک‌چهارم", unit: "عدد" }], steps: ["مواد را آماده کنید.", "با سبزی خوردن سرو کنید."], nutrition: { protein: 16, carbs: 35, fat: 18, fiber: 4 }, tips: "پنیر کم‌نمک انتخاب کنید." },
        lunch: { name: "خوراک لوبیاچیتی", calories: 590, note: "گیاهی، اقتصادی و سیرکننده", prep_time: "۱۰ دقیقه", cook_time: "۵۰ دقیقه", servings: 1, difficulty: "متوسط", ingredients: [{ name: "لوبیاچیتی پخته", amount: "۱", unit: "پیمانه" }, { name: "قارچ", amount: "۱", unit: "پیمانه" }, { name: "نان", amount: "یک‌چهارم", unit: "عدد" }], steps: ["پیاز و قارچ را تفت دهید.", "لوبیا و رب را اضافه کنید.", "با نان سرو کنید."], nutrition: { protein: 24, carbs: 78, fat: 13, fiber: 15 }, tips: "لوبیا را از شب قبل بخیسانید." },
        dinner: { name: "کوکو سبزی در فر", calories: 540, note: "شام سبک با سبزی فراوان", prep_time: "۱۵ دقیقه", cook_time: "۳۰ دقیقه", servings: 1, difficulty: "آسان", ingredients: [{ name: "سبزی کوکو", amount: "۲", unit: "پیمانه" }, { name: "تخم‌مرغ", amount: "۲", unit: "عدد" }, { name: "ماست", amount: "نصف", unit: "لیوان" }], steps: ["مواد را مخلوط کنید.", "در قالب کم‌چرب بریزید.", "در فر بپزید."], nutrition: { protein: 24, carbs: 32, fat: 25, fiber: 7 }, tips: "پخت در فر روغن را کمتر می‌کند." },
        snack: { name: "ماست و خیار", calories: 320, note: "خنک و سبک", prep_time: "۷ دقیقه", cook_time: "۰ دقیقه", servings: 1, difficulty: "آسان", ingredients: [{ name: "ماست کم‌چرب", amount: "۱", unit: "لیوان" }, { name: "خیار", amount: "۱", unit: "عدد" }, { name: "نعناع خشک", amount: "۱", unit: "قاشق چای‌خوری" }], steps: ["خیار را خرد کنید.", "با ماست و نعناع مخلوط کنید."], nutrition: { protein: 13, carbs: 18, fat: 8, fiber: 3 }, tips: "برای سیرکنندگی بیشتر کمی کشمش اضافه نکنید مگر در سهم کنترل‌شده." },
      },
    },
  ],
};

const extraDays = ["دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"].map((day, index) => ({
  ...demoMealPlan.days[index % demoMealPlan.days.length],
  day,
}));

demoMealPlan.days.push(...extraDays);

export const demoShoppingList = {
  categories: [
    {
      name: "پروتئین",
      items: [
        { name: "تخم‌مرغ", quantity: "۱۰ عدد" },
        { name: "سینه مرغ", quantity: "۵۰۰ گرم" },
        { name: "لوبیاچیتی", quantity: "۲ پیمانه" },
      ],
    },
    {
      name: "سبزیجات و میوه",
      items: [
        { name: "گوجه‌فرنگی", quantity: "۸ عدد" },
        { name: "خیار", quantity: "۶ عدد" },
        { name: "سبزی خوردن و سبزی کوکو", quantity: "۲ بسته" },
        { name: "سیب", quantity: "۴ عدد" },
      ],
    },
    {
      name: "غلات و لبنیات",
      items: [
        { name: "برنج", quantity: "۱ کیلوگرم" },
        { name: "نان سنگک", quantity: "۲ عدد" },
        { name: "ماست کم‌چرب", quantity: "۱ کیلوگرم" },
        { name: "پنیر کم‌نمک", quantity: "۲۰۰ گرم" },
      ],
    },
  ],
};

export function cloneDemoMealPlan() {
  return structuredClone(demoMealPlan);
}

export function cloneDemoShoppingList() {
  return structuredClone(demoShoppingList);
}
