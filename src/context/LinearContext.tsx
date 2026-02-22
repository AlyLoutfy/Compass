import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  linearService,
  LinearTeam,
  LinearWorkflowState,
  LinearIssue,
  LinearCycle,
  LinearLabel,
  LinearUser,
  mapPriorityToLinear,
} from '../services/linear';

const POLL_INTERVAL = 60_000;

interface LinearContextType {
  team: LinearTeam | null;
  workflowStates: LinearWorkflowState[];
  issues: LinearIssue[];
  cycles: LinearCycle[];
  labels: LinearLabel[];
  members: LinearUser[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  actions: {
    createIssue: (input: {
      title: string;
      description?: string;
      priority?: string;
      labelIds?: string[];
      cycleId?: string;
      stateId?: string;
      assigneeId?: string;
    }) => Promise<LinearIssue | null>;
    updateIssue: (issueId: string, input: {
      title?: string;
      description?: string;
      priority?: number;
      stateId?: string;
      assigneeId?: string | null;
      cycleId?: string | null;
      sortOrder?: number;
      prioritySortOrder?: number;
      estimate?: number;
      labelIds?: string[];
    }) => Promise<boolean>;
    createCycle: (input: {
      name?: string;
      startsAt: string;
      endsAt: string;
    }) => Promise<LinearCycle | null>;
  };
}

const LinearContext = createContext<LinearContextType | undefined>(undefined);

export const LinearProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [team, setTeam] = useState<LinearTeam | null>(null);
  const [workflowStates, setWorkflowStates] = useState<LinearWorkflowState[]>([]);
  const [issues, setIssues] = useState<LinearIssue[]>([]);
  const [cycles, setCycles] = useState<LinearCycle[]>([]);
  const [labels, setLabels] = useState<LinearLabel[]>([]);
  const [members, setMembers] = useState<LinearUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const teamIdRef = useRef<string | null>(null);
  const hasLoadedRef = useRef(false);
  const consecutiveFailsRef = useRef(0);

  const fetchStaticData = useCallback(async (teamId: string) => {
    const [states, lbls, mems] = await Promise.all([
      linearService.fetchWorkflowStates(teamId),
      linearService.fetchLabels(teamId),
      linearService.fetchMembers(),
    ]);
    setWorkflowStates(states);
    setLabels(lbls);
    setMembers(mems);
  }, []);

  const fetchDynamicData = useCallback(async (teamId: string) => {
    const [allIssues, allCycles] = await Promise.all([
      linearService.fetchAllIssues(teamId),
      linearService.fetchCycles(teamId),
    ]);
    setIssues(allIssues);
    setCycles(allCycles);
  }, []);

  const initialize = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const teams = await linearService.fetchTeams();
      if (teams.length === 0) {
        throw new Error('No teams found in Linear workspace');
      }
      const primaryTeam = teams[0];
      setTeam(primaryTeam);
      teamIdRef.current = primaryTeam.id;
      await Promise.all([
        fetchStaticData(primaryTeam.id),
        fetchDynamicData(primaryTeam.id),
      ]);
      hasLoadedRef.current = true;
      consecutiveFailsRef.current = 0;
    } catch (err: any) {
      console.error('Linear initialization failed:', err);
      setError(err.message || 'Failed to connect to Linear');
    } finally {
      setIsLoading(false);
    }
  }, [fetchStaticData, fetchDynamicData]);

  const refetch = useCallback(async () => {
    const teamId = teamIdRef.current;
    if (!teamId) return;
    if (document.hidden) return;
    try {
      await fetchDynamicData(teamId);
      consecutiveFailsRef.current = 0;
      if (error) setError(null);
    } catch (err: any) {
      consecutiveFailsRef.current += 1;
      console.warn(`Linear background refresh failed (attempt ${consecutiveFailsRef.current}):`, err.message);
      if (!hasLoadedRef.current) {
        setError(err.message || 'Failed to refresh Linear data');
      }
    }
  }, [fetchDynamicData, error]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!teamIdRef.current) return;
    const interval = setInterval(refetch, POLL_INTERVAL);

    const onVisible = () => {
      if (!document.hidden && hasLoadedRef.current) refetch();
    };
    const onFocus = () => {
      if (hasLoadedRef.current) refetch();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onFocus);
    };
  }, [refetch, team]);

  const actions: LinearContextType['actions'] = {
    createIssue: async (input) => {
      const teamId = teamIdRef.current;
      if (!teamId) return null;
      try {
        const result = await linearService.createIssue({
          teamId,
          title: input.title,
          description: input.description,
          priority: input.priority ? mapPriorityToLinear(input.priority) : undefined,
          labelIds: input.labelIds,
          cycleId: input.cycleId,
          stateId: input.stateId,
          assigneeId: input.assigneeId,
        });
        if (result.success && result.issue) {
          await refetch();
          return result.issue;
        }
        return null;
      } catch (err: any) {
        console.error('Failed to create Linear issue:', err);
        throw err;
      }
    },

    updateIssue: async (issueId, input) => {
      const prevIssues = issues;
      setIssues(current => current.map(issue => {
        if (issue.id !== issueId) return issue;
        const updated = { ...issue };
        if (input.title !== undefined) updated.title = input.title;
        if (input.description !== undefined) updated.description = input.description;
        if (input.priority !== undefined) {
          updated.priority = input.priority;
          updated.priorityLabel = ['No priority','Urgent','High','Medium','Low'][input.priority] || 'No priority';
        }
        if (input.sortOrder !== undefined) updated.sortOrder = input.sortOrder;
        if (input.prioritySortOrder !== undefined) updated.prioritySortOrder = input.prioritySortOrder;
        if (input.estimate !== undefined) updated.estimate = input.estimate;
        if (input.stateId !== undefined) {
          const newState = workflowStates.find(s => s.id === input.stateId);
          if (newState) updated.state = newState;
        }
        if (input.assigneeId !== undefined) {
          if (input.assigneeId === null) {
            updated.assignee = undefined;
          } else {
            const member = members.find(m => m.id === input.assigneeId);
            if (member) updated.assignee = member;
          }
        }
        if (input.cycleId !== undefined) {
          if (input.cycleId === null) {
            updated.cycle = undefined;
          } else {
            const cycle = cycles.find(c => c.id === input.cycleId);
            if (cycle) updated.cycle = { id: cycle.id, name: cycle.name, number: cycle.number };
          }
        }
        if (input.labelIds !== undefined) {
          updated.labels = { nodes: labels.filter(l => input.labelIds!.includes(l.id)) };
        }
        return updated;
      }));

      try {
        const result = await linearService.updateIssue(issueId, input);
        if (!result.success) {
          setIssues(prevIssues);
          return false;
        }
        refetch();
        return true;
      } catch (err: any) {
        setIssues(prevIssues);
        console.error('Failed to update Linear issue:', err);
        throw err;
      }
    },

    createCycle: async (input) => {
      const teamId = teamIdRef.current;
      if (!teamId) return null;
      try {
        const result = await linearService.createCycle({
          teamId,
          name: input.name,
          startsAt: input.startsAt,
          endsAt: input.endsAt,
        });
        if (result.success && result.cycle) {
          await refetch();
          return result.cycle;
        }
        return null;
      } catch (err: any) {
        console.error('Failed to create Linear cycle:', err);
        throw err;
      }
    },
  };

  return (
    <LinearContext.Provider value={{
      team, workflowStates, issues, cycles, labels, members,
      isLoading, error, refetch, actions,
    }}>
      {children}
    </LinearContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLinear = () => {
  const context = useContext(LinearContext);
  if (!context) throw new Error('useLinear must be used within LinearProvider');
  return context;
};
