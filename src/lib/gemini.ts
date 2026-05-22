import { cloneDemoMealPlan, cloneDemoShoppingList } from "@/src/lib/demoFallbacks";

const REQUEST_TIMEOUT_MS = 15_000;
const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true";

async function postJsonWithTimeout(path: string, body: unknown): Promise<any> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const text = await response.text();
    let data: unknown;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("API returned invalid JSON");
    }

    if (!response.ok) {
      const message = typeof data === "object" && data && "error" in data
        ? String((data as { error?: unknown }).error)
        : "API request failed";
      throw new Error(message);
    }

    return data;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function warnMealPlanFallback(error?: unknown) {
  console.warn("Using demo meal plan fallback", error);
}

function warnShoppingListFallback(error?: unknown) {
  console.warn("Using demo shopping list fallback", error);
}

export async function generateMealPlan(profile: any): Promise<any> {
  if (isDemoMode) {
    warnMealPlanFallback("demo mode enabled");
    return cloneDemoMealPlan();
  }

  try {
    return await postJsonWithTimeout("/api/generate-plan", { profile });
  } catch (error) {
    warnMealPlanFallback(error);
    return cloneDemoMealPlan();
  }
}

export async function generateShoppingList(mealPlan: any): Promise<any> {
  if (isDemoMode) {
    warnShoppingListFallback("demo mode enabled");
    return cloneDemoShoppingList();
  }

  try {
    return await postJsonWithTimeout("/api/generate-shopping-list", { mealPlan });
  } catch (error) {
    warnShoppingListFallback(error);
    return cloneDemoShoppingList();
  }
}
