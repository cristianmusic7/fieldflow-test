import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { api } from "../../../../convex/_generated/api";
import { Id, Doc } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { ContactsTable } from "@/components/ui/ContactsTable";
import { AddContactForm } from "@/components/ui/AddContactForm";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from "@heroui/react";
import { isAuthenticated } from "../../../../convex/auth";

export const Route = createFileRoute("/orgs/$organizationId/")({
  //Make sure user is in organization, otherwise redirecting to home
  //Also getiing params from URL
  beforeLoad: async ({ params, context }) => {
    const { organizationId } = params;

    try {
      const inOrganization = await context.queryClient.fetchQuery({
        queryKey: ["organizationRole", organizationId],
        queryFn: () =>
          context.convex.query(api.organizations.isInOrganization, {
            organizationId: organizationId as Id<"organizations">,
          }),
      });

      //Not in org
      if (!inOrganization) {
        throw redirect({
          to: "/",
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
  component: OrganizationOverview,
});

function OrganizationOverview() {
  const { organizationId }: { organizationId: Id<"organizations"> } =
    Route.useRouteContext();
  const org = useQuery(api.organizations.getOrganization, {
    organizationId,
  });
  const hasAdminAccess = useQuery(api.organizations.hasOrganizationRole, {
    organizationId,
    role: "admin",
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  let contacts = [] as Doc<"contacts">[];
  try {
    contacts =
      useQuery(api.contacts.getOrganizationContacts, {
        organizationId,
      }) || [];
  } catch (error) {
    router.navigate({
      to: "/",
    });
  }

  return (
    <div>
      {hasAdminAccess ? (
        <Link
          to="/orgs/$organizationId/admin"
          params={{ organizationId }}
          className="underline text-primary"
        >
          <h3 className="text-2xl font-extrabold">{org?.name}</h3>
        </Link>
      ) : (
        <h3 className="text-2xl font-extrabold˝">{org?.name}</h3>
      )}

      {org && (
        <div className="mt-4">
          <Button color="primary" onPress={onOpen}>
            Add Contact
          </Button>
          <Modal
            isOpen={isOpen}
            placement="top-center"
            onOpenChange={onOpenChange}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Add Contact
                  </ModalHeader>
                  <ModalBody>
                    <AddContactForm
                      organizationId={organizationId}
                      onClose={onClose}
                    />
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>

          <div className="mt-4">
            <ContactsTable
              organizationId={organizationId}
              contacts={contacts}
            />
          </div>
        </div>
      )}
    </div>
  );
}
