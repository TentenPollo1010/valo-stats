import React, { useState } from 'react';
import type { PlayerStats, SortState } from '../types';
import { TABLE_HEADERS } from '../constants';

interface StatsTableProps {
  players: PlayerStats[];
  loading: boolean;
  sortState: SortState;
  onSort: (column: keyof PlayerStats) => void;
}

const StatsTable: React.FC<StatsTableProps> = ({ players, loading, sortState, onSort }) => {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const getSortIcon = (columnKey: string) => {
    if (sortState.column !== columnKey) return <span className="text-gray-500 opacity-20 ml-1">⇅</span>;
    if (sortState.direction === 'asc') return <span className="text-valo-red ml-1">↑</span>;
    if (sortState.direction === 'desc') return <span className="text-valo-red ml-1">↓</span>;
    return <span className="text-gray-500 opacity-20 ml-1">⇅</span>;
  };

  if (players.length === 0 && !loading) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-900/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <p className="text-xl font-medium">No players found</p>
        <p className="text-sm mt-2">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 uppercase tracking-wider font-semibold">
            <tr>
              {TABLE_HEADERS.map((header) => (
                <th 
                  key={header.key}
                  onClick={() => header.key !== 'rank' && header.key !== 'agents' && onSort(header.key as keyof PlayerStats)}
                  className={`px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none ${header.key === 'rank' || header.key === 'agents' ? 'cursor-default hover:bg-transparent' : ''}`}
                >
                  <div className="flex items-center">
                    {header.label}
                    {header.key !== 'rank' && header.key !== 'agents' && getSortIcon(header.key)}
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {players.map((player) => {
                const isExpanded = expandedRowId === player.id;
                return (
                  <React.Fragment key={player.id}>
                    <tr 
                      onClick={() => player.id && toggleExpand(player.id)}
                      className={`
                        transition-colors duration-150 cursor-pointer group
                        ${isExpanded ? 'bg-gray-50 dark:bg-gray-800/60' : 'hover:bg-gray-50 dark:hover:bg-white/5'}
                      `}
                    >
                      <td className="px-6 py-4 font-mono text-gray-500 dark:text-gray-500 group-hover:text-valo-red transition-colors">#{player.rank}</td>
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{player.player}</td>
                      {/* Agents Column */}
                      <td className="px-6 py-4">
                        <div className="flex -space-x-1 overflow-hidden max-w-[120px]">
                           {player.agents && player.agents.slice(0, 3).map((agent, i) => (
                             <span 
                                key={i} 
                                className="inline-block px-1.5 py-0.5 text-[10px] uppercase font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-white dark:border-gray-800 z-10"
                                title={agent}
                             >
                               {agent.slice(0, 2)}
                             </span>
                           ))}
                           {player.agents.length > 3 && (
                             <span className="inline-block px-1.5 py-0.5 text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 rounded ml-1">+{player.agents.length - 3}</span>
                           )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{player.org || '-'}</td>
                      <td className="px-6 py-4 font-semibold text-valo-red">{player.rating}</td>
                      <td className="px-6 py-4">{player.average_combat_score}</td>
                      <td className="px-6 py-4">{player.kill_deaths}</td>
                      <td className="px-6 py-4 text-green-600 dark:text-green-400">{player.first_kills_per_round}</td>
                      <td className="px-6 py-4 text-red-600 dark:text-red-400">{player.first_deaths_per_round}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-block transition-transform duration-200 text-valo-red ${isExpanded ? 'rotate-90' : ''}`}>
                          →
                        </span>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-gray-50 dark:bg-gray-800/40">
                        <td colSpan={10} className="px-6 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-sm mb-4">
                             <div className="flex flex-col">
                                <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest mb-1">KAST</span>
                                <span className="font-mono font-medium text-gray-900 dark:text-gray-100">{player.kill_assists_survived_traded}</span>
                             </div>
                             <div className="flex flex-col">
                                <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest mb-1">ADR</span>
                                <span className="font-mono font-medium text-gray-900 dark:text-gray-100">{player.average_damage_per_round}</span>
                             </div>
                             <div className="flex flex-col">
                                <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest mb-1">HS%</span>
                                <span className="font-mono font-medium text-gray-900 dark:text-gray-100">{player.headshot_percentage}</span>
                             </div>
                             <div className="flex flex-col">
                                <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest mb-1">Clutch%</span>
                                <span className="font-mono font-medium text-gray-900 dark:text-gray-100">{player.clutch_success_percentage}</span>
                             </div>
                             <div className="flex flex-col">
                                <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest mb-1">K/R</span>
                                <span className="font-mono font-medium text-gray-900 dark:text-gray-100">{player.kills_per_round}</span>
                             </div>
                             <div className="flex flex-col">
                                <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest mb-1">A/R</span>
                                <span className="font-mono font-medium text-gray-900 dark:text-gray-100">{player.assists_per_round}</span>
                             </div>
                          </div>
                          {/* Expanded Agents View */}
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                             <h4 className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Most Played Agents</h4>
                             <div className="flex gap-2">
                               {player.agents.map((agent, idx) => (
                                 <span key={idx} className="px-2 py-1 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded text-xs capitalize">
                                   {agent}
                                 </span>
                               ))}
                               {player.agents.length === 0 && <span className="text-xs text-gray-500 italic">No agent data available</span>}
                             </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatsTable;