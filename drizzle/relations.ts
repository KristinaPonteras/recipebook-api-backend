import { relations } from "drizzle-orm/relations";
import { user, recipe, token } from "./schema";

export const recipeRelations = relations(recipe, ({one}) => ({
	user: one(user, {
		fields: [recipe.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	recipes: many(recipe),
	tokens: many(token),
}));

export const tokenRelations = relations(token, ({one}) => ({
	user: one(user, {
		fields: [token.userId],
		references: [user.id]
	}),
}));