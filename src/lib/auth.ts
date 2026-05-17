export const auth = {
  getUser: () => {
    const data = localStorage.getItem('auth_user')
    return data ? JSON.parse(data) : null
  },
  
  setUser: (userId: string, phone: string) => {
    localStorage.setItem('auth_user', JSON.stringify({ userId, phone }))
  },
  
  clearUser: () => {
    localStorage.removeItem('auth_user')
    localStorage.removeItem('meal_plan')
    localStorage.removeItem('shopping_list')
    localStorage.removeItem('user_profile')
    localStorage.removeItem('plan_count')
    localStorage.removeItem('subscription_active')
  },
  
  isLoggedIn: () => {
    return !!localStorage.getItem('auth_user')
  }
}
