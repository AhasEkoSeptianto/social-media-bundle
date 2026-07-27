import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingFeed() {
  return (
    <Card className="w-full bg-brand">
      <CardHeader>
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/5 mb-4" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full" />
      </CardContent>
      <CardFooter className="bg-brand">
        <Skeleton className="h-4 w-1/4" />
      </CardFooter>
    </Card>
  );
}
