import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserId, userIsInOrganization } from "./utils/user";

//Getting contact info
export const getContact = query({
  args: {
    contactId: v.id("contacts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("contacts")
      .withIndex("by_id", (q) => q.eq("_id", args.contactId))
      .first();
  },
});

//Create contact in a specific org
export const createOrganizationContact = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const { organizationId, firstName, lastName, phone, email } = args;
    await getUserId(ctx);
    //Make sure user is a member of this organization
    const hasAccessOrg = await userIsInOrganization(ctx, organizationId);

    if (hasAccessOrg) {
      await ctx.db.insert("contacts", {
        organizationId,
        firstName,
        lastName,
        phone,
        email,
      });
    } else {
      throw new Error("Not allowed");
    }
  },
});

//Get the contacts of a specific org
export const getOrganizationContacts = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    //Make sure userId exists and is authenticated
    await getUserId(ctx);
    const { organizationId } = args;
    //Make sure user is a member of this organization
    const hasAccessOrg = await userIsInOrganization(ctx, organizationId);

    if (hasAccessOrg) {
      return await ctx.db
        .query("contacts")
        .withIndex("by_organization_id", (q) =>
          q.eq("organizationId", args.organizationId),
        )
        .collect();
    } else {
      throw new Error("Not allowed");
    }
  },
});
