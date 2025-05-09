import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserId } from "./utils/user";

//Insert a note to a contact
export const createContactNote = mutation({
  args: {
    note: v.string(),
    contactId: v.id("contacts"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    await ctx.db.insert("notes", {
      note: args.note,
      contactId: args.contactId,
    });
  },
});

//Get all the notes from a contact
export const getContactNotes = query({
  args: {
    contactId: v.id("contacts"),
  },
  handler: async (ctx, args) => {
    //Make sure userId exists and is authenticated
    await getUserId(ctx);

    return await ctx.db
      .query("notes")
      .withIndex("by_contact_id", (q) => q.eq("contactId", args.contactId))
      .order("desc")
      .collect();
  },
});
