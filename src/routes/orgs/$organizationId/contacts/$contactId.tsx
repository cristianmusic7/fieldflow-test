import { createFileRoute, redirect } from "@tanstack/react-router";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { NotesList } from "@/components/ui/NotesList";
import { AddNoteForm } from "@/components/ui/AddNoteForm";
import { Card, CardBody } from "@heroui/react";

export const Route = createFileRoute(
  "/orgs/$organizationId/contacts/$contactId",
)({
  //Make sure user is in organization, otherwise redirecting to home
  //Also getiing params from URL
  beforeLoad: async ({ params, context }) => {
    const { organizationId, contactId } = params;

    const inOrganization = await context.queryClient.fetchQuery({
      queryKey: ["organizationRole", organizationId],
      queryFn: () =>
        context.convex.query(api.organizations.isInOrganization, {
          organizationId: organizationId as Id<"organizations">,
        }),
    });

    if (!inOrganization) {
      throw redirect({
        to: "/",
      });
    }

    return { organizationId, contactId };
  },
  component: ContactDetail,
});

function ContactDetail() {
  const { contactId }: { contactId: Id<"contacts"> } = Route.useRouteContext();
  const contact = useQuery(api.contacts.getContact, {
    contactId: contactId as Id<"contacts">,
  });
  return (
    <div>
      {contact && (
        <h3 className="mb-4 text-2xl font-bold">{`Contact: ${contact?.firstName} ${contact?.lastName}`}</h3>
      )}
      {contactId && (
        <div>
          <Card className="mb-4">
            <CardBody>
              <AddNoteForm contactId={contactId} />
            </CardBody>
          </Card>
          <NotesList contactId={contactId} />
        </div>
      )}
    </div>
  );
}
