export const storage = {
  getProfile: () => {
    const p = localStorage.getItem('user_profile');
    return p ? JSON.parse(p) : null;
  },
  setProfile: (profile: any) =>
    localStorage.setItem('user_profile', JSON.stringify(profile)),

  getPlan: () => {
    const p = localStorage.getItem('meal_plan');
    return p ? JSON.parse(p) : null;
  },
  setPlan: (plan: any) =>
    localStorage.setItem('meal_plan', JSON.stringify(plan)),
  clearPlan: () => localStorage.removeItem('meal_plan'),

  isSubscribed: () => localStorage.getItem('subscription_active') === 'true',
  setSubscribed: (val: boolean) => localStorage.setItem('subscription_active', String(val)),

  getPlanCount: () => parseInt(localStorage.getItem('plan_count') || '0'),
  incrementPlanCount: () => {
    const count = parseInt(localStorage.getItem('plan_count') || '0');
    localStorage.setItem('plan_count', String(count + 1));
    return count + 1;
  },
};

export const migrateStorage = () => {
  const plan = localStorage.getItem('meal_plan')
  if (!plan) return
  const parsed = JSON.parse(plan)
  const firstMeal = parsed?.days?.[0]?.meals?.breakfast
  // If first meal doesn't have ingredients, it's the old format
  if (!firstMeal?.ingredients) {
    localStorage.removeItem('meal_plan')
    localStorage.removeItem('shopping_list')
  }
}
