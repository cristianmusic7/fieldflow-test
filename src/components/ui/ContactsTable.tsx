import React from "react";
import { Id, Doc } from "../../../convex/_generated/dataModel";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
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
  const [page, setPage] = React.useState(1);

  const goToContact = (contactId: string) => {
    router.navigate({
      to: "/orgs/$organizationId/contacts/$contactId",
      params: {
        organizationId,
        contactId,
      },
    });
  };

  const rowsPerPage = 5;

  const pages = React.useMemo(() => {
    return contacts?.length ? Math.ceil(contacts?.length / rowsPerPage) : 0;
  }, [contacts, rowsPerPage]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return contacts.slice(start, end);
  }, [page, contacts]);

  return (
    <Table
      aria-label="Contacts management table"
      selectionMode="single"
      bottomContent={
        pages > 0 ? (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        ) : null
      }
    >
      <TableHeader>
        <TableColumn>FIRSTNAME</TableColumn>
        <TableColumn>LASTNAME</TableColumn>
        <TableColumn>EMAIL</TableColumn>
        <TableColumn>PHONE</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No rows to display."} items={items}>
        {(item) => (
          <TableRow
            key={item._id}
            onClick={() => goToContact(item._id)}
            className="cursor-pointer"
          >
            <TableCell>{item.firstName}t</TableCell>
            <TableCell>{item.lastName}</TableCell>
            <TableCell>{item.email}</TableCell>
            <TableCell>{item.phone}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
