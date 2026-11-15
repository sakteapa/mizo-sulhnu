export interface ContributorBadge {
  id: string;
  titleMizo: string;
  titleEnglish: string;
  description: string;
  icon: "shield" | "scroll" | "search" | "crown" | "star" | "sparkles" | "flame" | "feather";
  tier: "bronze" | "silver" | "gold" | "legendary";
  earnedAt: number;
}

export interface ContributorProfile {
  uid: string;
  displayName: string;
  phoneNumber?: string;
  email?: string;
  hasPasswordAuth?: boolean;
  clan?: string;
  village?: string;
  bio?: string;
  avatarIcon: string;
  rating: number; // 1.0 to 5.0
  totalRatingsCount: number;
  approvedSubmissionsCount: number;
  totalSubmissionsCount: number;
  totalWordsPenned: number;
  badges: ContributorBadge[];
  joinedAt: number;
  lastActiveAt: number;
  isVerified: boolean;
}

export interface TopContributorLeaderboardItem {
  id: string;
  displayName: string;
  clan: string;
  village: string;
  avatarIcon: string;
  rating: number;
  totalReviews: number;
  approvedCount: number;
  wordsPenned: number;
  badges: ContributorBadge[];
  rank: number;
}
