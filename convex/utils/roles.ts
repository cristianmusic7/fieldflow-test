import { Id } from "../_generated/dataModel";
import { QueryCtx, MutationCtx } from "../_generated/server";
import { getUserId } from "./user";

export async function hasRole(
  ctx: QueryCtx | MutationCtx,
  orgId: Id<"organizations">,
  role: string,
): Promise<boolean> {
  const userId = await getUserId(ctx);
  const memberInfo = await ctx.db
    .query("organizationMembers")
    .withIndex("by_organization_id_user_id", (q) =>
      q.eq("organizationId", orgId).eq("userId", userId),
    )
    .unique();

  return memberInfo?.role === role;
}
