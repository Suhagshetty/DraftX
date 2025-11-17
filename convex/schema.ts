import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
const schema = defineSchema({
  ...authTables,
  // Your other tables...
  project_counters: defineTable({
    userId: v.id("users"),
    nextProjectNumber: v.number(),
  }).index("by_userId", ["userId"]),
});

export default schema;
