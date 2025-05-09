import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Listbox, ListboxItem } from "@heroui/react";

export function NotesList({ contactId }: { contactId: Id<"contacts"> }) {
  const notes =
    useQuery(api.notes.getContactNotes, {
      contactId,
    }) || [];

  const formatTime = (creationTime: number) => {
    const date = new Date(creationTime);
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Set to false for 24-hour format
    });
    return formattedTime;
  };

  return (
    <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
      <Listbox aria-label="Contact notes" emptyContent={"No notes to display."}>
        {notes?.map((note) => (
          <ListboxItem key={note._id} className="flex">
            <div className="float-left mr-8">
              {formatTime(note._creationTime)}
            </div>
            <div className="clear-both">{note.note}</div>
          </ListboxItem>
        ))}
      </Listbox>
    </div>
  );
}
