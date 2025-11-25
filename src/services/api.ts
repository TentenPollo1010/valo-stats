import { type PlayerStats, Region } from "../types";

// Simple in-memory cache to store results per region
const statsCache: Record<string, PlayerStats[]> = {};

export const fetchPlayerStats = async (region: Region): Promise<PlayerStats[]> => {
  // 1. Check Cache
  if (statsCache[region] && statsCache[region].length > 0) {
    console.log(`[Cache] Returning cached data for ${region}`);
    return statsCache[region];
  }

  try {
    // CHANGE: Fetch from static JSON files in /public/data/ instead of the live API
    // Vercel will serve these files relative to the root URL
    const url = `/data/${region}.json`;
    console.log(`[Static] Fetching: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to load stats data: ${response.statusText}`);
    }

    const json = await response.json();

    // Determine where the array is located based on the provided JSON structure
    let rawList: any[] = [];

    // Check for { data: { segments: [...] } } pattern (Matches your provided JSON)
    if (json.data && json.data.segments && Array.isArray(json.data.segments)) {
        rawList = json.data.segments;
    } 
    // Check for { data: [...] } pattern
    else if (json.data && Array.isArray(json.data)) {
        rawList = json.data;
    } 
    // Check for { segments: [...] } pattern
    else if (json.segments && Array.isArray(json.segments)) {
        rawList = json.segments;
    } 
    // Check for { players: [...] } pattern
    else if (json.players && Array.isArray(json.players)) {
        rawList = json.players;
    }
    // Check if the root is an array
    else if (Array.isArray(json)) {
        rawList = json;
    }

    if (rawList.length === 0) {
        console.warn("[Data] No players found in file");
        return [];
    }

    // Map fields
    const mappedPlayers: PlayerStats[] = rawList.map((p: any, index: number) => ({
        player: p.player || p.name || 'Unknown',
        org: p.org || p.team || p.organization || '-',
        rating: String(p.rating || p.rating_value || '0.00'),
        average_combat_score: String(p.average_combat_score || p.acs || '0'),
        kill_deaths: String(p.kill_deaths || p.kd || p.kd_ratio || '0.00'),
        kill_assists_survived_traded: String(p.kill_assists_survived_traded || p.kast || '0%'),
        average_damage_per_round: String(p.average_damage_per_round || p.adr || '0'),
        kills_per_round: String(p.kills_per_round || p.kpr || '0'),
        assists_per_round: String(p.assists_per_round || p.apr || '0'),
        first_kills_per_round: String(p.first_kills_per_round || p.fkpr || '0'),
        first_deaths_per_round: String(p.first_deaths_per_round || p.fdpr || '0'),
        headshot_percentage: String(p.headshot_percentage || p.hs || p.hs_rate || '0%'),
        clutch_success_percentage: String(p.clutch_success_percentage || p.clutch || p.clutch_rate || '0%'),
        // Agents: ensure it's an array of strings
        agents: Array.isArray(p.agents) ? p.agents : [],
        // Computed
        id: `${p.player || 'unknown'}-${index}`,
        rank: index + 1
    }));

    // 2. Set Cache
    statsCache[region] = mappedPlayers;

    return mappedPlayers;

  } catch (error) {
    console.error("Error fetching player stats:", error);
    throw error;
  }
};