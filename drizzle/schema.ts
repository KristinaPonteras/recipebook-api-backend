import { pgTable, unique, uuid, text, timestamp, index, foreignKey, integer, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const role = pgEnum("Role", ['USER', 'ADMIN'])
export const tokenType = pgEnum("TokenType", ['REFRESH', 'EMAIL_VERIFY'])


export const user = pgTable("user", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text(),
	password: text(),
	name: text(),
	emailVerified: timestamp("email_verified", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	role: role().default('USER').notNull(),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const recipe = pgTable("recipe", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	cuisine: text().notNull(),
	mealType: text().array().notNull(),
	difficulty: text().notNull(),
	cookTimeMinutes: integer().notNull(),
	tags: text().array().notNull(),
	image: text().notNull(),
	ingredients: text().array().notNull(),
	instructions: text().array().notNull(),
	userId: uuid().notNull(),
}, (table) => [
	index("recipe_owner_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "recipe_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const token = pgTable("token", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	type: tokenType().notNull(),
	token: text().notNull(),
	expiresAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	consumedAt: timestamp("consumed_at", { withTimezone: true, mode: 'string' }),
	revokedAt: timestamp("revoked_at", { withTimezone: true, mode: 'string' }),
	userId: uuid().notNull(),
}, (table) => [
	index("token_owner_type_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops"), table.type.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "token_userId_user_id_fk"
		}).onDelete("cascade"),
	unique("token_token_unique").on(table.token),
]);
