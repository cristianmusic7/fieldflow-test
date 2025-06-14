/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as contacts from "../contacts.js";
import type * as http from "../http.js";
import type * as notes from "../notes.js";
import type * as organizations from "../organizations.js";
import type * as seed from "../seed.js";
import type * as utils_roles from "../utils/roles.js";
import type * as utils_user from "../utils/user.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  contacts: typeof contacts;
  http: typeof http;
  notes: typeof notes;
  organizations: typeof organizations;
  seed: typeof seed;
  "utils/roles": typeof utils_roles;
  "utils/user": typeof utils_user;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
