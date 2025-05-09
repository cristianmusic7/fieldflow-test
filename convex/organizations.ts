import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { hasRole } from "./utils/roles";
import { getUserId, userIsInOrganization } from "./utils/user";

//Get info of an organization
export const getOrganization = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const { organizationId } = args;
    const hasAccessOrg = await userIsInOrganization(ctx, organizationId);

    if (hasAccessOrg) {
      return await ctx.db
        .query("organizations")
        .withIndex("by_id", (q) => q.eq("_id", args.organizationId))
        .first();
    } else {
      throw new Error("Not allowed");
    }
  },
});

export const updateOrganizationName = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const { organizationId, name } = args;
    const hasAccessOrg = await userIsInOrganization(ctx, organizationId);

    if (hasAccessOrg) {
      return await ctx.db.patch(organizationId, { name: name.trim() });
    } else {
      throw new Error("Not allowed");
    }
  },
});

export const getUserMemberships = query({
  args: {},
  handler: async (ctx, _) => {
    const userId = await getUserId(ctx);

    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    return await Promise.all(
      membership.map(async (member) => ({
        organization: await ctx.db.get(member.organizationId),
        role: member.role,
      })),
    );
  },
});

export const hasOrganizationRole = query({
  args: {
    organizationId: v.id("organizations"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const { organizationId, role } = args;
    return await hasRole(ctx, organizationId, role);
  },
});

export const isInOrganization = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const { organizationId } = args;
    return await userIsInOrganization(ctx, organizationId);
  },
});
