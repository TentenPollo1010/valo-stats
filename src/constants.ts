import { Region, type RegionOption, type AgentRole } from "./types";

export const REGIONS: RegionOption[] = [
  { id: Region.NA, label: "North America" },
  { id: Region.EU, label: "EMEA" },
  { id: Region.AP, label: "APAC" },
  { id: Region.KR, label: "Korea" },
  { id: Region.CN, label: "China" },
  { id: Region.JP, label: "Japan" },
  { id: Region.BR, label: "Brazil" },
  { id: Region.LA, label: "LATAM" },
  { id: Region.OCE, label: "Oceania" },
  { id: Region.MN, label: "MENA" },
  { id: Region.GC, label: "Game Changers" },
];

export const TABLE_HEADERS = [
  { key: 'rank', label: '#' },
  { key: 'player', label: 'Player' },
  { key: 'agents', label: 'Agents' },
  { key: 'org', label: 'Org' },
  { key: 'rating', label: 'Rating' },
  { key: 'average_combat_score', label: 'ACS' },
  { key: 'kill_deaths', label: 'K/D' },
  { key: 'first_kills_per_round', label: 'FK/R' },
  { key: 'first_deaths_per_round', label: 'FD/R' },
];

// Agent Role Mappings
export const AGENT_ROLES: Record<string, AgentRole> = {
  // Duelists
  'jett': 'Duelist',
  'raze': 'Duelist',
  'phoenix': 'Duelist',
  'reyna': 'Duelist',
  'yoru': 'Duelist',
  'neon': 'Duelist',
  'iso': 'Duelist',

  // Controllers
  'astra': 'Controller',
  'brimstone': 'Controller',
  'omen': 'Controller',
  'viper': 'Controller',
  'harbor': 'Controller',
  'clove': 'Controller',

  // Initiators
  'breach': 'Initiator',
  'sova': 'Initiator',
  'skye': 'Initiator',
  'kayo': 'Initiator',
  'fade': 'Initiator',
  'gekko': 'Initiator',
  'tejo': 'Initiator', 

  // Sentinels
  'sage': 'Sentinel',
  'cypher': 'Sentinel',
  'killjoy': 'Sentinel',
  'chamber': 'Sentinel',
  'deadlock': 'Sentinel',
  'vyse': 'Sentinel',
};

export const ROLES: AgentRole[] = ['Duelist', 'Controller', 'Initiator', 'Sentinel', 'Flex'];

export const getAgentRole = (agentName: string): AgentRole => {
  const normalized = agentName.toLowerCase();
  return AGENT_ROLES[normalized] || 'Unknown';
};