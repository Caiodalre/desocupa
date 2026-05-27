import type { Database } from "@/types/database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Obligation = Database["public"]["Tables"]["obligations"]["Row"];
export type Priority = Database["public"]["Tables"]["daily_priorities"]["Row"] & {
  obligations: Obligation | null;
};
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"] & {
  plans: Database["public"]["Tables"]["plans"]["Row"] | null;
};

export interface DashboardInitialData {
  profile: Profile | null;
  obligations: Obligation[];
  priorities: Priority[];
  upcomingDeadlines: Obligation[];
  notifications: Notification[];
  worryCount: number;
  subscription: Subscription | null;
  greeting: string;
}

export interface DashboardClientProps extends DashboardInitialData {
  user: {
    id: string;
    email?: string;
  };
}
