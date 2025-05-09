import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Listbox, ListboxItem } from "@heroui/react";
import { useRouter } from "@tanstack/react-router";

export function OrganizationList() {
  const memberships = useQuery(api.organizations.getUserMemberships) || [];

  const router = useRouter();
  const handleRedirect = (organizationId: string) => {
    router.navigate({
      to: "/orgs/$organizationId",
      params: {
        organizationId,
      }
    });
  };

  return (
    <div className="w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
      <Listbox aria-label="Listbox menu with descriptions" variant="flat">
        {memberships?.map(
          ({ organization, role }) =>
            organization && (
              <ListboxItem
                key={organization._id}
                description={role}
                onClick={() => handleRedirect(organization._id)}
              >
                {organization.name}
              </ListboxItem>
            ),
        )}
      </Listbox>
    </div>
  );
}
