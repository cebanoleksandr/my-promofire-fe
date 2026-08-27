export interface OwnerOverview {
  scope: 'owner';
  totalAdmins: number;
  totalDistributors: number;
  totalCampaigns: number;
  totalPromoCodes: number;
  totalRedemptions: number;
}

export interface AdminCampaignStat {
  campaignId: string;
  name: string;
  isActive: boolean;
  codesIssued: number;
  redemptions: number;
}

export interface AdminOverview {
  scope: 'admin';
  totalCampaigns: number;
  totalPromoCodes: number;
  totalRedemptions: number;
  campaigns: AdminCampaignStat[];
}

export interface DistributorIntegrationStat {
  integrationId: string;
  name: string;
  redemptions: number;
}

export interface DistributorOverview {
  scope: 'distributor';
  totalPromoCodes: number;
  totalRedemptions: number;
  byIntegration: DistributorIntegrationStat[];
}

// Различаем по полю scope — узкий тип сам сузится в switch/if по discriminant union
export type StatsOverview = OwnerOverview | AdminOverview | DistributorOverview;
