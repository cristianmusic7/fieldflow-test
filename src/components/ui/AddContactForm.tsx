import { Form, Button, Input } from "@heroui/react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { FormEvent } from "react";

export function AddContactForm({
  organizationId,
  onClose,
}: {
  organizationId: Id<"organizations">;
  onClose: () => void;
}) {
  const createContact = useMutation(api.contacts.createOrganizationContact);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const firstName = (formData.get("firstname") as string).trim();
    const lastName = (formData.get("lastname") as string).trim();
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    void createContact({
      firstName,
      lastName,
      email,
      phone,
      organizationId,
    });
    form.reset();
    onClose();
  };

  return (
    <Form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
        isRequired
        errorMessage="Please enter a valid firstname"
        label="Firstname"
        labelPlacement="outside"
        placeholder="Enter firstname"
        name="firstname"
        type="text"
        className="w"
      />
      <Input
        isRequired
        errorMessage="Please enter a valid lastname"
        label="Lastname"
        labelPlacement="outside"
        placeholder="Enter lastname"
        name="lastname"
        type="text"
      />
      <Input
        isRequired
        errorMessage="Please enter a valid email"
        label="Email"
        labelPlacement="outside"
        placeholder="Enter email"
        name="email"
        type="email"
      />
      <Input
        isRequired
        errorMessage="Please enter a valid phone"
        label="Phone"
        labelPlacement="outside"
        placeholder="Enter phone"
        name="phone"
        type="text"
      />
      <div className="py-4" color="primary">
        <Button type="submit" color="primary">
          Save
        </Button>
      </div>
    </Form>
  );
}
