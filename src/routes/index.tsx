import { createFileRoute } from "@tanstack/react-router";
import { OrganizationList } from "@/components/ui/OrganizationList";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2 flex flex-col gap-2">
      <h3 className="text-2xl font-bold">Welcome to the FieldFlow Test!</h3>
      <div className="container mx-auto py-8">
        <OrganizationList />
      </div>
    </div>
  );
}
