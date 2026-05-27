"use client";

import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardStatusCards } from "@/features/dashboard/components/dashboard-status-cards";
import { TodayPrioritiesCard } from "@/features/dashboard/components/today-priorities-card";
import { UpcomingDeadlinesCard } from "@/features/dashboard/components/upcoming-deadlines-card";
import { QuickCaptureCard } from "@/features/dashboard/components/quick-capture-card";
import { QuickLinksGrid } from "@/features/dashboard/components/quick-links-grid";
import { useDashboardMutations } from "@/features/dashboard/hooks/use-dashboard-mutations";
import type { DashboardClientProps } from "@/features/dashboard/types";

export function DashboardClient({
  profile,
  obligations,
  priorities,
  upcomingDeadlines,
  notifications,
  worryCount,
  greeting,
}: DashboardClientProps) {
  const { completePriority, completeObligation, isProcessing } = useDashboardMutations();

  return (
    <div className="space-y-8 pb-20">
      <DashboardHeader greeting={greeting} />

      <DashboardStatusCards
        obligationsCount={obligations.length}
        upcomingCount={upcomingDeadlines.length}
        notificationsCount={notifications.length}
        worryCount={worryCount}
      />

      <div className="grid gap-8">
        <TodayPrioritiesCard
          priorities={priorities}
          onComplete={completePriority}
          isProcessing={isProcessing}
        />

        <UpcomingDeadlinesCard
          deadlines={upcomingDeadlines}
          onComplete={completeObligation}
          isProcessing={isProcessing}
        />

        <QuickCaptureCard profile={profile} />

        <QuickLinksGrid
          worryCount={worryCount}
          notificationCount={notifications.length}
        />
      </div>
    </div>
  );
}
