import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagList } from "@/components/dashboard/TagList";
import { tags } from "@/lib/data";

export default function DashboardPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline text-primary">Your Tags</h1>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Tag
        </Button>
      </div>
      <TagList tags={tags} />
    </div>
  );
}
