export interface PlayerStats {
  player: string;
  org: string;
  rating: string; // API often returns these as strings
  average_combat_score: string;
  kill_deaths: string;
  kill_assists_survived_traded: string;
  average_damage_per_round: string;
  kills_per_round: string;
  assists_per_round: string;
  first_kills_per_round: string;
  first_deaths_per_round: string;
  headshot_percentage: string;
  clutch_success_percentage: string;
  agents: string[]; // List of agents played
  // Computed fields for internal use
  rank?: number;
  id?: string; 
}

export const Region = {
  NA: 'na',
  EU: 'eu',
  AP: 'ap',
  LA: 'la', // LATAM
  BR: 'br',
  KR: 'kr',
  CN: 'cn',
  JP: 'jp',
  OCE: 'oce',
  MN: 'mn', // MENA
  GC: 'gc' // Game Changers
} as const;

export type Region = typeof Region[keyof typeof Region];

export type SortDirection = 'asc' | 'desc' | 'default';

export interface SortState {
  column: keyof PlayerStats | null;
  direction: SortDirection;
}

export interface RegionOption {
  id: Region;
  label: string;
}

export type AgentRole = 'Duelist' | 'Controller' | 'Initiator' | 'Sentinel' | 'Flex' | 'Unknown';