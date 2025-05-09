import { Id, Doc } from "../../../convex/_generated/dataModel";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { useRouter } from "@tanstack/react-router";

export function ContactsTable({
  organizationId,
  contacts,
}: {
  organizationId: Id<"organizations">;
  contacts: Doc<"contacts">[];
}) {
  const router = useRouter();

  const goToContact = (contactId: string) => {
    router.navigate({
      to: "/orgs/$organizationId/contacts/$contactId",
      params: {
        organizationId,
        contactId,
      },
    });
  };

  return (
    <Table aria-label="Contacts management table" selectionMode="single">
      <TableHeader>
        <TableColumn>FIRSTNAME</TableColumn>
        <TableColumn>LASTNAME</TableColumn>
        <TableColumn>EMAIL</TableColumn>
        <TableColumn>PHONE</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No rows to display."}>
        {(contacts || [])?.map((contact: any) => (
          <TableRow
            key={contact._id}
            onClick={() => goToContact(contact._id)}
            className="cursor-pointer"
          >
            <TableCell>{contact.firstName}t</TableCell>
            <TableCell>{contact.lastName}</TableCell>
            <TableCell>{contact.email}</TableCell>
            <TableCell>{contact.phone}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
