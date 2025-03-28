import { pgTable, serial, varchar, timestamp, integer, json , pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Define the role enum
//export const roleEnum = pgEnum("role", ["admin", "user", "superuser"]);

// ==========================
// Users Table
// ==========================
export const UsersTable = pgTable('users', {
  userid: serial('userid').primaryKey(),
  //clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(), // Clerk's unique user ID
  username: varchar('username', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }).notNull().default(''),
  //role: roleEnum('role').default('user'), // New role field with a default value of "user"
  location: varchar('location', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ==========================
// Authentication Table
// ==========================
export const AuthTable = pgTable('auth', {
  authid: serial('authid').primaryKey(),
  userid: integer('user_id').references(() => UsersTable.userid, { onDelete: "cascade" }),
  password: varchar('password', { length: 255 }).notNull(),
  //role: roleEnum('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});





// ==========================
// Predictions Table
// ==========================
export const PredictionsTable = pgTable('predictions', {
  predictionid: serial('predictionid').primaryKey(),
  userid: integer('userid')
    .notNull()
    .references(() => UsersTable.userid, { onDelete: "cascade" }),
  cropType: varchar('crop_type', { length: 100 }).notNull(),
  plantingDate: timestamp('planting_date').notNull(), // could also use a date type if preferred
  yieldPrediction: varchar('yield_prediction', { length: 100 }).notNull(), // stores predicted yield (e.g., in kg or tonnes)
  harvestDate: timestamp('harvest_date').notNull(),
  predictionData: json('prediction_data'), // stores additional API response details (optional)
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ==========================
// Feedback Table
// ==========================
export const FeedbackTable = pgTable('feedback', {
  feedbackid: serial('feedbackid').primaryKey(),
  predictionid: integer('predictionid')
    .notNull()
    .references(() => PredictionsTable.predictionid, { onDelete: "cascade" }),
  // Optionally, you can include the user_id directly for easier access to a user's feedback history
  userid: integer('userid')
    .references(() => UsersTable.userid, { onDelete: "cascade" }),
  accuracyRating: integer('accuracy_rating').notNull(), // e.g., rating on a scale (1-5)
  comment: varchar('comment', { length: 1000 }), // additional remarks or suggestions
  actualYield: varchar('actual_yield', { length: 100 }), // the actual yield entered by the user (e.g., in kg or tonnes)
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ==========================
// Relations
// ==========================

// Users -> Predictions & Feedback (One-to-Many)
export const usersRelations = relations(UsersTable, ({ many }) => ({
  predictions: many(PredictionsTable),
  feedback: many(FeedbackTable),
}));

// Auth -> User (One-to-One)
export const authRelations = relations(AuthTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [AuthTable.userid],
    references: [UsersTable.userid],
  }),
}));

// Predictions -> User & Feedback (Many-to-One and One-to-One/Many)
// Here, each prediction is linked to one user. Feedback is linked to the prediction.
export const predictionsRelations = relations(PredictionsTable, ({ one, many }) => ({
  user: one(UsersTable, {
    fields: [PredictionsTable.userid],
    references: [UsersTable.userid],
  }),
  feedback: many(FeedbackTable), // if you expect one feedback per prediction, you can enforce uniqueness in your DB.
}));

// Feedback -> Prediction & (Optional) User (Many-to-One)
export const feedbackRelations = relations(FeedbackTable, ({ one }) => ({
  prediction: one(PredictionsTable, {
    fields: [FeedbackTable.predictionid],
    references: [PredictionsTable.predictionid],
  }),
  user: one(UsersTable, {
    fields: [FeedbackTable.userid],
    references: [UsersTable.userid],
  }),
}));


//Types
export type TIUser = typeof UsersTable.$inferInsert;
export type TSUser = typeof UsersTable.$inferSelect;

export type TIPrediction = typeof PredictionsTable.$inferInsert;
export type TSPrediction = typeof PredictionsTable.$inferSelect;

export type TIFeedback = typeof FeedbackTable.$inferInsert;
export type TSFeedback = typeof FeedbackTable.$inferSelect;

export type TIAuth = typeof AuthTable.$inferInsert;
export type TSAuth = typeof AuthTable.$inferSelect;

