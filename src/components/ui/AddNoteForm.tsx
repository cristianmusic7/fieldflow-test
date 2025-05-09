import { Form, Button, Textarea } from "@heroui/react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { FormEvent } from "react";

export function AddNoteForm({ contactId }: { contactId: Id<"contacts"> }) {
  const createNote = useMutation(api.notes.createContactNote);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const note = (formData.get("note") as string).trim();
    if (note) {
      void createNote({ note, contactId });
    }
    form.reset();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Textarea
        className="w-full"
        placeholder="Enter your note"
        name="note"
        isRequired
        maxLength={500}
        minLength={3}
      />
      <div className="py-4">
        <Button type="submit" color="primary">
          Add note
        </Button>
      </div>
    </Form>
  );
}
