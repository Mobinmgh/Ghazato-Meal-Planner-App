
export async function generateMealPlan(profile: any) {
  try {
    const response = await fetch("/api/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to generate meal plan");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function generateShoppingList(mealPlan: any) {
  try {
    const response = await fetch("/api/generate-shopping-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mealPlan }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to generate shopping list");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Gemini Shopping List Error:", error);
    throw error;
  }
}
