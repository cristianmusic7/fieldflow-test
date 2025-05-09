import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Form, Button, Input } from "@heroui/react";
import { FormEvent } from "react";
import { api } from "../../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";

export const Route = createFileRoute("/orgs/$organizationId/admin")({
  //Make sure user has the correct role
  //Also getiing params from URL
  beforeLoad: async ({ params, context }) => {
    const { organizationId } = params;

    try {
      const hasAccess = await context.queryClient.fetchQuery({
        queryKey: ["organizationRole", organizationId],
        queryFn: () =>
          context.convex.query(api.organizations.hasOrganizationRole, {
            organizationId: organizationId as Id<"organizations">,
            role: "admin",
          }),
      });

      if (hasAccess !== true) {
        throw redirect({
          to: "/orgs/$organizationId",
          params: {
            organizationId,
          },
        });
      }
    } catch (error) {
      //Throws an error in backend, (Not auth, or permissions)
      throw redirect({
        to: "/",
      });
    }

    return { organizationId };
  },
  component: OrganizationAdmin,
});

function OrganizationAdmin() {
  const updateOrganizationName = useMutation(
    api.organizations.updateOrganizationName,
  );
  const { organizationId }: { organizationId: Id<"organizations"> } =
    Route.useRouteContext();
  const router = useRouter();
  const org = useQuery(api.organizations.getOrganization, {
    organizationId,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const orgName = (formData.get("name") as string).trim();
    void updateOrganizationName({ name: orgName, organizationId });
    router.navigate({
      to: "/orgs/$organizationId",
      params: {
        organizationId,
      },
    });
  };

  return (
    <>
      <h3 className="mb-4 text-2xl font-bold">Organization edit</h3>
      {org && (
        <Form
          className="w-full max-w-xs flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <Input
            isRequired
            errorMessage="Please enter a valid name for your organization"
            label="Organization name"
            placeholder="Enter organization name"
            name="name"
            type="text"
            defaultValue={org?.name}
          />
          <div className="py-4">
            <Button type="submit">Update Organization</Button>
          </div>
        </Form>
      )}
    </>
  );
}
