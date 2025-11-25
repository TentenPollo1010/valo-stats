import React, { useState, useEffect, useMemo, useRef } from 'react';
import { type PlayerStats, Region, type SortState, type AgentRole } from '../types';
import { REGIONS, ROLES, getAgentRole } from '../constants';
import { fetchPlayerStats } from '../services/api';
import StatsTable from '../components/StatsTable';
import LoadingSkeleton from '../components/LoadingSkeleton';

const ITEMS_PER_PAGE = 25;

const StatsPage: React.FC = () => {
  const [region, setRegion] = useState<Region>(Region.NA);
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<AgentRole | 'All'>('All');

  // UI States
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortState, setSortState] = useState<SortState>({
    column: 'rating',
    direction: 'desc',
  });

  // Fetch data when region changes
  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);
      // NOTE: We don't clear players immediately to prevent "flashing" if data is cached
      try {
        const data = await fetchPlayerStats(region);
        setPlayers(data);
        setCurrentPage(1);
      } catch (err) {
        setError('Unable to load stats. Please try again later.');
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [region]);

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Handle Sorting
  const handleSort = (column: keyof PlayerStats) => {
    setSortState((prevState) => {
      if (prevState.column === column) {
        if (prevState.direction === 'desc') return { column, direction: 'asc' };
        if (prevState.direction === 'asc') return { column: 'rating', direction: 'desc' };
      }
      return { column, direction: 'desc' };
    });
  };

  // Process Data: Filter -> Sort -> Paginate
  const processedData = useMemo(() => {
    let filtered = [...players];

    // 1. Text Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.player.toLowerCase().includes(lowerQuery));
    }

    // 2. Role Filter
    if (selectedRole !== 'All') {
      filtered = filtered.filter(p => {
        if (!p.agents || p.agents.length === 0) return false;

        // Special Logic for 'Flex': Player must have played agents from at least 3 distinct roles
        if (selectedRole === 'Flex') {
          const uniqueRoles = new Set(p.agents.map(a => getAgentRole(a)));
          uniqueRoles.delete('Unknown'); // Ignore unknown agents
          return uniqueRoles.size >= 3;
        }

        // Standard Logic: Check if ANY of the player's agents match the selected role
        return p.agents.some(agent => getAgentRole(agent) === selectedRole);
      });
    }

    // 3. Sort
    if (sortState.column && sortState.direction !== 'default') {
      filtered.sort((a, b) => {
        const col = sortState.column as keyof PlayerStats;

        const getVal = (item: PlayerStats) => {
          let val: string | number = item[col] as string || '';
          if (typeof val === 'string') {
            val = val.replace('%', '');
            const num = parseFloat(val);
            if (!isNaN(num)) return num;
          }
          return val;
        };

        const valA = getVal(a);
        const valB = getVal(b);

        if (valA < valB) return sortState.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortState.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered.map((p, index) => ({ ...p, rank: index + 1 }));
  }, [players, searchQuery, selectedRole, sortState]);

  // 4. Paginate
  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
  const paginatedPlayers = processedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Controls */}
      <div className="mb-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Player Rankings</h2>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto z-20">
            {/* Custom Role Dropdown */}
            <div className="relative w-full sm:w-48" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg text-left text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-valo-red transition-all hover:border-gray-400 dark:hover:border-white/20"
              >
                <span className="block truncate font-medium">
                  {selectedRole === 'All' ? 'All Roles' : selectedRole}
                </span>
                <svg
                  className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="py-1">
                    <button
                      onClick={() => { setSelectedRole('All'); setIsRoleDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedRole === 'All'
                          ? 'bg-valo-red/10 text-valo-red font-semibold'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-valo-red'
                        }`}
                    >
                      All Roles
                    </button>
                    {ROLES.map((role) => (
                      <button
                        key={role}
                        onClick={() => { setSelectedRole(role); setIsRoleDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedRole === role
                            ? 'bg-valo-red/10 text-valo-red font-semibold'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-valo-red'
                          }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2.5 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-valo-red outline-none transition-all text-gray-900 dark:text-white placeholder-gray-500"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              ) : (
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Region Tabs */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 custom-scrollbar">
          <div className="flex space-x-2">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => setRegion(r.id)}
                disabled={loading && !players.length}
                className={`
                  px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all duration-200
                  ${region === r.id
                    ? 'bg-valo-red text-white shadow-lg shadow-red-500/20'
                    : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                  }
                `}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-[400px]">
        {error ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-red-500 text-5xl mb-4">⚠</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{error}</h3>
            <button
              onClick={() => setRegion(region)}
              className="mt-4 px-4 py-2 bg-gray-200 dark:bg-white/10 rounded hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : loading && players.length === 0 ? (
          // Only show skeleton if we have NO data (first load)
          <LoadingSkeleton />
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center">
              <span>Showing {processedData.length} results</span>
              {selectedRole !== 'All' && (
                <span className="text-valo-red font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-valo-red"></span>
                  Filtered by {selectedRole}
                </span>
              )}
            </div>
            <StatsTable
              players={paginatedPlayers}
              loading={loading}
              sortState={sortState}
              onSort={handleSort}
            />
          </>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && processedData.length > 0 && (
        <div className="mt-8 flex justify-between items-center border-t border-gray-200 dark:border-white/10 pt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium rounded-md bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium rounded-md bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StatsPage;