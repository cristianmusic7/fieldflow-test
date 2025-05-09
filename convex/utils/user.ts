import { getAuthUserId } from "@convex-dev/auth/server";
import { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import { DataModel } from "../_generated/dataModel";
import { Id } from "../_generated/dataModel";

export const getUserId = async (
  ctx: GenericMutationCtx<DataModel> | GenericQueryCtx<DataModel>,
) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Unauthenticated");
  }
  return userId;
};

//Check is user is in the organization as admin or member
// Used before running queries/mutations
export const userIsInOrganization = async (
  ctx: GenericMutationCtx<DataModel> | GenericQueryCtx<DataModel>,
  orgId: Id<"organizations">,
) => {
  const userId = await getUserId(ctx);

  const memberInfo = await ctx.db
    .query("organizationMembers")
    .withIndex("by_organization_id_user_id", (q) =>
      q.eq("organizationId", orgId).eq("userId", userId),
    )
    .unique();

  return memberInfo?.role === "admin" || memberInfo?.role === "member";
};
