import { MEAL_PLAN_SYSTEM_PROMPT, buildUserPrompt, SHOPPING_LIST_PROMPT } from "../src/lib/prompts";

const getArvanConfig = () => {
  const apiKey = process.env.ARVAN_API_KEY;
  const endpoint = process.env.ARVAN_API_ENDPOINT;
  const model = process.env.ARVAN_MODEL;
  
  if (!apiKey) throw new Error("ARVAN_API_KEY is not set");
  if (!endpoint) throw new Error("ARVAN_API_ENDPOINT is not set");
  if (!model) throw new Error("ARVAN_MODEL is not set");
  
  return { apiKey, endpoint, model };
};

async function callArvan(systemPrompt: string, userPrompt: string): Promise<string> {
  const { apiKey, endpoint, model } = getArvanConfig();
  
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Arvan API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from Arvan AI");
  
  return content;
}

export async function generateMealPlanServer(profile: any) {
  const raw = await callArvan(MEAL_PLAN_SYSTEM_PROMPT, buildUserPrompt(profile));
  const cleaned = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function generateShoppingListServer(mealPlan: any) {
  const userPrompt = `برنامه غذایی: ${JSON.stringify(mealPlan)}`;
  const raw = await callArvan(SHOPPING_LIST_PROMPT, userPrompt);
  const cleaned = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}