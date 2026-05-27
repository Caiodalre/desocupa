import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 pb-20 animate-pulse" aria-busy="true" aria-label="Carregando painel">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-muted rounded-md" />
        <div className="h-4 w-96 bg-muted rounded-md" />
      </div>

      {/* Status Cards Skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-muted rounded-xl" />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6">
        {/* Priorities Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 w-48 bg-muted rounded-md" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-muted rounded-xl" />
            ))}
          </CardContent>
        </Card>

        {/* Deadlines Skeleton */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="h-6 w-40 bg-muted rounded-md" />
            <div className="h-6 w-20 bg-muted rounded-md" />
          </CardHeader>
          <CardContent className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted rounded-xl" />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Capture Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-72 bg-muted rounded-md" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-28 bg-muted rounded-xl" />
          <div className="flex gap-2">
            <div className="h-10 w-40 bg-muted rounded-md" />
            <div className="h-10 w-40 bg-muted rounded-md" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Links Skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-muted rounded-xl" />
        ))}
      </div>
    </div>
  );
}
