import React, { useState, useMemo, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useLinear } from '@/context/LinearContext';
import { LinearIssue, LinearCycle, LinearWorkflowState } from '@/services/linear';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/Select';
import { Plus, ChevronRight, ChevronDown, GripVertical, History, Loader2, AlertCircle, RefreshCw, ExternalLink, Search, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { PageToolbar } from '@/components/layout/PageToolbar';
import { FilterPopover } from '@/components/ui/FilterPopover';
import { LinearPriorityIcon, LinearPrioritySelect, formatShortName } from '@/components/shared/LinearIcons';

const STATE_TYPE_ORDER: Record<string, number> = {
  started: 0,
  unstarted: 1,
  backlog: 2,
  completed: 3,
  cancelled: 4,
  canceled: 4,
};

const StateIcon = ({ state }: { state: LinearWorkflowState }) => {
  const size = 13;
  const r = 4.5;
  const cx = size / 2;
  const cy = size / 2;
  const c = 2 * Math.PI * r;
  let fill = 0;
  if (state.type === 'started') fill = 0.5;
  if (state.type === 'completed') fill = 1;
  if (state.type === 'cancelled' || state.type === 'canceled') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={state.color} strokeWidth={1.5} opacity={0.3} />
        <line x1={3.5} y1={3.5} x2={9.5} y2={9.5} stroke={state.color} strokeWidth={1.5} strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={state.color} strokeWidth={1.5} opacity={0.3} />
      {fill > 0 && <circle cx={cx} cy={cy} r={r} fill="none" stroke={state.color} strokeWidth={1.5} strokeDasharray={`${c * fill} ${c}`} strokeDashoffset={c * 0.25} strokeLinecap="round" />}
      {fill === 1 && <circle cx={cx} cy={cy} r={2.5} fill={state.color} />}
    </svg>
  );
};

export const BacklogPage = () => {
  const { issues, cycles, workflowStates, members, isLoading, error, refetch, actions } = useLinear();
  const [expandedCycles, setExpandedCycles] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [showHistory, setShowHistory] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [busyIssues, setBusyIssues] = useState<Set<string>>(new Set());

  const [addToCycleIssueSearch, setAddToCycleIssueSearch] = useState('');
  const [addToCycleTarget, setAddToCycleTarget] = useState<string | null>(null);

  const trackAction = async (issueId: string, action: () => Promise<any>) => {
    setBusyIssues(prev => new Set(prev).add(issueId));
    try {
      await action();
    } finally {
      setBusyIssues(prev => { const next = new Set(prev); next.delete(issueId); return next; });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const now = new Date();

  const sortedCycles = useMemo(() =>
    [...cycles].sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime()),
  [cycles]);

  const activeCycles = useMemo(() =>
    sortedCycles.filter(c => !c.completedAt && new Date(c.startsAt) <= now && new Date(c.endsAt) >= now),
  [sortedCycles, now]);

  const upcomingCycles = useMemo(() =>
    sortedCycles.filter(c => !c.completedAt && new Date(c.startsAt) > now)
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()),
  [sortedCycles, now]);

  const completedCycles = useMemo(() =>
    sortedCycles.filter(c => !!c.completedAt)
      .sort((a, b) => new Date(b.endsAt).getTime() - new Date(a.endsAt).getTime()),
  [sortedCycles]);

  const matchesFilters = useMemo(() => {
    return (issue: LinearIssue) => {
      if (filterAssignee !== 'all') {
        if (filterAssignee === 'unassigned' && issue.assignee) return false;
        if (filterAssignee !== 'unassigned' && issue.assignee?.id !== filterAssignee) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!issue.title.toLowerCase().includes(q) && !issue.identifier.toLowerCase().includes(q)) return false;
      }
      return true;
    };
  }, [filterAssignee, searchQuery]);

  const issuesByCycle = useMemo(() => {
    const map: Record<string, LinearIssue[]> = {};
    for (const issue of issues) {
      if (issue.cycle && matchesFilters(issue)) {
        if (!map[issue.cycle.id]) map[issue.cycle.id] = [];
        map[issue.cycle.id].push(issue);
      }
    }
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => a.prioritySortOrder - b.prioritySortOrder);
    }
    return map;
  }, [issues, matchesFilters]);

  const backlogIssues = useMemo(() =>
    issues
      .filter(i => !i.cycle && i.state.type === 'backlog')
      .filter(matchesFilters)
      .sort((a, b) => a.prioritySortOrder - b.prioritySortOrder),
  [issues, matchesFilters]);

  const toggleExpand = (id: string) => {
    const s = new Set(expandedCycles);
    if (s.has(id)) s.delete(id); else s.add(id);
    setExpandedCycles(s);
  };

  React.useEffect(() => {
    const toExpand = new Set(expandedCycles);
    activeCycles.forEach(c => toExpand.add(c.id));
    setExpandedCycles(toExpand);
  }, [activeCycles.length]);

  const handleAddIssueToCycle = async (issueId: string, cycleId: string) => {
    await trackAction(issueId, async () => {
      try {
        await actions.updateIssue(issueId, { cycleId });
        setAddToCycleTarget(null);
        setAddToCycleIssueSearch('');
      } catch (err) {
        console.error('Failed to add issue to cycle:', err);
      }
    });
  };

  const handleRemoveIssueFromCycle = async (issueId: string) => {
    await trackAction(issueId, async () => {
      try {
        await actions.updateIssue(issueId, { cycleId: null });
      } catch (err) {
        console.error('Failed to remove issue from cycle:', err);
      }
    });
  };

  const sortedStates = useMemo(() =>
    [...workflowStates].sort((a, b) => {
      const orderA = STATE_TYPE_ORDER[a.type] ?? 5;
      const orderB = STATE_TYPE_ORDER[b.type] ?? 5;
      if (orderA !== orderB) return orderA - orderB;
      return a.position - b.position;
    }),
  [workflowStates]);

  const computePrioritySortOrder = useCallback((list: LinearIssue[], destIndex: number, draggedId: string): number => {
    const filtered = list.filter(i => i.id !== draggedId);
    if (filtered.length === 0) return 0;
    if (destIndex === 0) return filtered[0].prioritySortOrder - 1;
    if (destIndex >= filtered.length) return filtered[filtered.length - 1].prioritySortOrder + 1;
    return (filtered[destIndex - 1].prioritySortOrder + filtered[destIndex].prioritySortOrder) / 2;
  }, []);

  const parseDroppableId = useCallback((id: string) => {
    if (id === 'backlog') return { cycleId: null as string | null, stateId: null as string | null };
    const parts = id.split(':');
    if (parts.length === 2) return { cycleId: parts[0], stateId: parts[1] };
    return { cycleId: id, stateId: null };
  }, []);

  const getDroppableIssues = useCallback((cycleId: string | null, stateId: string | null): LinearIssue[] => {
    if (!cycleId) return backlogIssues;
    const cycleIssues = issuesByCycle[cycleId] || [];
    if (!stateId) return cycleIssues;
    return cycleIssues.filter(i => i.state.id === stateId);
  }, [issuesByCycle, backlogIssues]);

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    const sameGroup = source.droppableId === destination.droppableId;
    if (sameGroup && source.index === destination.index) return;

    const issue = issues.find(i => i.id === draggableId);
    if (!issue) return;

    const dest = parseDroppableId(destination.droppableId);
    const destIssues = getDroppableIssues(dest.cycleId, dest.stateId);
    const newPrioritySortOrder = computePrioritySortOrder(destIssues, destination.index, draggableId);

    const update: Record<string, any> = { prioritySortOrder: newPrioritySortOrder };
    if (dest.cycleId !== (issue.cycle?.id || null)) {
      update.cycleId = dest.cycleId;
    }
    if (dest.stateId && dest.stateId !== issue.state.id) {
      update.stateId = dest.stateId;
    }

    trackAction(issue.id, async () => {
      try { await actions.updateIssue(issue.id, update); }
      catch (err) { console.error('Failed to reorder/move issue:', err); }
    });
  }, [issues, parseDroppableId, getDroppableIssues, computePrioritySortOrder, trackAction, actions]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading sprints from Linear...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-center max-w-md">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <h3 className="font-semibold text-lg">Connection Error</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={handleRefresh} variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-2" /> Retry</Button>
        </div>
      </div>
    );
  }

  const availableIssuesForAdd = issues
    .filter(i => !i.cycle)
    .filter(i => !addToCycleIssueSearch || i.title.toLowerCase().includes(addToCycleIssueSearch.toLowerCase()) || i.identifier.toLowerCase().includes(addToCycleIssueSearch.toLowerCase()));

  return (
    <div className="flex flex-col">
      <div className="pt-4 md:pt-8 pb-4">
        <PageToolbar
          title="Sprints"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search tickets..."
          count={cycles.length}
          countLabel="Cycles"
          filters={
            <FilterPopover
              title="Filter Issues"
              activeCount={filterAssignee !== 'all' ? 1 : 0}
              onReset={() => setFilterAssignee('all')}
            >
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Assignee</label>
                <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                  <SelectTrigger className="h-9 w-full">
                    <span className="truncate">{filterAssignee === 'all' ? 'All Assignees' : filterAssignee === 'unassigned' ? 'Unassigned' : members.find(m => m.id === filterAssignee)?.name || filterAssignee}</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignees</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {members.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </FilterPopover>
          }
          actions={
            <div className="flex items-center gap-3">
              <Button
                variant={showHistory ? "primary" : "outline"}
                size="sm"
                className={cn("h-8 text-xs gap-2 border-dashed", showHistory && "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20")}
                onClick={() => setShowHistory(!showHistory)}
              >
                <History size={14} />
                {showHistory ? "Showing Completed" : "Show Completed"}
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={cn("w-3.5 h-3.5 mr-2", isRefreshing && "animate-spin")} /> Refresh
              </Button>
            </div>
          }
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="space-y-6">
          {activeCycles.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Current Cycle</h2>
              {activeCycles.map(cycle => (
                <CycleContainer
                  key={cycle.id}
                  cycle={cycle}
                  issues={issuesByCycle[cycle.id] || []}
                  isExpanded={expandedCycles.has(cycle.id)}
                  onToggle={() => toggleExpand(cycle.id)}
                  sortedStates={sortedStates}
                  workflowStates={workflowStates}
                  members={members}
                  isActive
                  onRemoveIssue={handleRemoveIssueFromCycle}
                  onAddIssue={addToCycleTarget === cycle.id}
                  onAddIssueToggle={() => setAddToCycleTarget(addToCycleTarget === cycle.id ? null : cycle.id)}
                  addIssueSearch={addToCycleIssueSearch}
                  setAddIssueSearch={setAddToCycleIssueSearch}
                  availableIssues={availableIssuesForAdd}
                  onSelectIssue={(issueId) => handleAddIssueToCycle(issueId, cycle.id)}
                  onUpdateIssue={actions.updateIssue}
                  busyIssues={busyIssues}
                  trackAction={trackAction}
                  onFilterByAssignee={id => setFilterAssignee(filterAssignee === id ? 'all' : id)}
                  activeFilterAssignee={filterAssignee}
                />
              ))}
            </div>
          )}

          {upcomingCycles.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Upcoming</h2>
              <div className="space-y-4">
                {upcomingCycles.map(cycle => (
                  <CycleContainer
                    key={cycle.id}
                    cycle={cycle}
                    issues={issuesByCycle[cycle.id] || []}
                    isExpanded={expandedCycles.has(cycle.id)}
                    onToggle={() => toggleExpand(cycle.id)}
                    sortedStates={sortedStates}
                    workflowStates={workflowStates}
                    members={members}
                    onRemoveIssue={handleRemoveIssueFromCycle}
                    onAddIssue={addToCycleTarget === cycle.id}
                    onAddIssueToggle={() => setAddToCycleTarget(addToCycleTarget === cycle.id ? null : cycle.id)}
                    addIssueSearch={addToCycleIssueSearch}
                    setAddIssueSearch={setAddToCycleIssueSearch}
                    availableIssues={availableIssuesForAdd}
                    onSelectIssue={(issueId) => handleAddIssueToCycle(issueId, cycle.id)}
                    onUpdateIssue={actions.updateIssue}
                    busyIssues={busyIssues}
                    trackAction={trackAction}
                    onFilterByAssignee={id => setFilterAssignee(filterAssignee === id ? 'all' : id)}
                    activeFilterAssignee={filterAssignee}
                  />
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {showHistory && completedCycles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 overflow-hidden"
              >
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 ml-1 flex items-center gap-2">
                  <History size={12} /> Completed Sprints
                </h2>
                <div className="space-y-3 opacity-60">
                  {completedCycles.map(cycle => (
                    <CycleContainer
                      key={cycle.id}
                      cycle={cycle}
                      issues={issuesByCycle[cycle.id] || []}
                      isExpanded={expandedCycles.has(cycle.id)}
                      onToggle={() => toggleExpand(cycle.id)}
                      sortedStates={sortedStates}
                      workflowStates={workflowStates}
                      members={members}
                      isCompleted
                      onRemoveIssue={handleRemoveIssueFromCycle}
                      onAddIssue={false}
                      onAddIssueToggle={() => {}}
                      addIssueSearch=""
                      setAddIssueSearch={() => {}}
                      availableIssues={[]}
                      onSelectIssue={() => {}}
                      onUpdateIssue={actions.updateIssue}
                      busyIssues={busyIssues}
                      trackAction={trackAction}
                      onFilterByAssignee={id => setFilterAssignee(filterAssignee === id ? 'all' : id)}
                      activeFilterAssignee={filterAssignee}
                    />
                  ))}
              </div>
              </motion.div>
            )}
          </AnimatePresence>

          {backlogIssues.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Backlog <span className="text-muted-foreground/60 ml-1">({backlogIssues.length})</span>
              </h2>
              <Droppable droppableId="backlog">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn("rounded-lg border shadow-sm overflow-hidden bg-card", snapshot.isDraggingOver && "ring-1 ring-primary/20")}
                  >
                    {backlogIssues.map((issue, index) => (
                      <Draggable key={issue.id} draggableId={issue.id} index={index} isDragDisabled={busyIssues.has(issue.id)}>
                        {(dragProvided, dragSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            style={dragProvided.draggableProps.style}
                            className={cn(dragSnapshot.isDragging && "shadow-lg ring-1 ring-primary/30 rounded-md bg-white dark:bg-zinc-900 z-50")}
                          >
                            <CycleIssueRow
                              issue={issue}
                              workflowStates={workflowStates}
                              members={members}
                              onUpdateIssue={actions.updateIssue}
                              isBusy={busyIssues.has(issue.id)}
                              trackAction={trackAction}
                              dragHandleProps={dragProvided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )}

          {cycles.length === 0 && backlogIssues.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
                <History size={36} className="text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Sprints Yet</h3>
              <p className="text-muted-foreground text-sm max-w-md mb-6">
                No sprints found. Create sprints in Linear to see them here.
              </p>
            </div>
          )}
        </div>
      </DragDropContext>
    </div>
  );
};

interface CycleContainerProps {
  cycle: LinearCycle;
  issues: LinearIssue[];
  isExpanded: boolean;
  onToggle: () => void;
  sortedStates: LinearWorkflowState[];
  workflowStates: LinearWorkflowState[];
  members: { id: string; name: string; avatarUrl?: string }[];
  isActive?: boolean;
  isCompleted?: boolean;
  onRemoveIssue: (issueId: string) => void;
  onAddIssue: boolean;
  onAddIssueToggle: () => void;
  addIssueSearch: string;
  setAddIssueSearch: (s: string) => void;
  availableIssues: LinearIssue[];
  onSelectIssue: (issueId: string) => void;
  onUpdateIssue: (issueId: string, input: any) => Promise<boolean>;
  busyIssues: Set<string>;
  trackAction: (issueId: string, action: () => Promise<any>) => Promise<void>;
  onFilterByAssignee?: (userId: string) => void;
  activeFilterAssignee?: string;
}

const CycleContainer = ({
  cycle, issues, isExpanded, onToggle, sortedStates, workflowStates, members,
  isActive, isCompleted, onRemoveIssue,
  onAddIssue, onAddIssueToggle, addIssueSearch, setAddIssueSearch,
  availableIssues, onSelectIssue, onUpdateIssue,
  busyIssues, trackAction, onFilterByAssignee, activeFilterAssignee,
}: CycleContainerProps) => {
  const assignees = useMemo(() => {
    const ids = new Set(issues.map(i => i.assignee?.id).filter(Boolean) as string[]);
    return members.filter(m => ids.has(m.id));
  }, [issues, members]);

  const completedCount = issues.filter(i => i.state.type === 'completed').length;

  const groupedByState = useMemo(() => {
    const map: Record<string, LinearIssue[]> = {};
    for (const issue of issues) {
      if (!map[issue.state.id]) map[issue.state.id] = [];
      map[issue.state.id].push(issue);
    }
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => a.prioritySortOrder - b.prioritySortOrder);
    }
    return sortedStates
      .map(state => ({ state, issues: map[state.id] || [] }))
      .filter(g => g.issues.length > 0);
  }, [issues, sortedStates]);

  const [collapsedStates, setCollapsedStates] = useState<Set<string> | null>(null);

  React.useEffect(() => {
    if (collapsedStates === null && groupedByState.length > 0) {
      const collapsed = new Set<string>();
      groupedByState.forEach(({ state }) => {
        if (state.type !== 'unstarted') collapsed.add(state.id);
      });
      setCollapsedStates(collapsed);
    }
  }, [groupedByState, collapsedStates]);

  const toggleState = (stateId: string) => {
    const current = collapsedStates || new Set<string>();
    const next = new Set(current);
    if (next.has(stateId)) next.delete(stateId); else next.add(stateId);
    setCollapsedStates(next);
  };

  return (
    <div className={cn(
      "rounded-lg border shadow-sm overflow-hidden bg-card transition-all",
      isActive && "ring-1 ring-primary/20 shadow-md",
      isCompleted && "border-dashed border-muted-foreground/20 bg-muted/30"
    )}>
      <div
        className={cn(
          "px-4 py-2.5 flex items-center justify-between cursor-pointer transition-colors border-b border-transparent",
          isActive ? "bg-zinc-50 dark:bg-zinc-900/50" : "bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/20",
          isExpanded && "border-border/50"
        )}
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground/70">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
          <h3 className="font-semibold text-sm">{cycle.name || `Cycle ${cycle.number}`}</h3>
          {isActive && <Badge className="bg-green-600/90 hover:bg-green-600 text-white border-none px-1.5 py-0 h-4 text-[10px] font-semibold">Active</Badge>}
          {isCompleted && <Badge variant="outline" className="text-[10px] py-0 h-4 px-1.5 font-normal text-muted-foreground">Completed</Badge>}
          <div className="w-px h-3 bg-border mx-1" />
          <span className="text-xs text-muted-foreground">{issues.length} issues</span>
          {issues.length > 0 && (
            <span className="text-[10px] text-muted-foreground">
              ({completedCount}/{issues.length} done)
            </span>
          )}
          {assignees.length > 0 && (
            <div className="flex -space-x-1.5 items-center ml-2">
              {assignees.slice(0, 5).map(u => (
                <button
                  key={u.id}
                  className={cn(
                    "w-5 h-5 rounded-full ring-2 flex items-center justify-center text-[9px] font-bold bg-gradient-to-br from-indigo-500 to-purple-500 text-white cursor-pointer hover:scale-110 transition-transform",
                    activeFilterAssignee === u.id ? "ring-primary" : "ring-background"
                  )}
                  title={`Filter by ${u.name}`}
                  onClick={e => { e.stopPropagation(); onFilterByAssignee?.(u.id); }}
                >
                  {u.avatarUrl ? <img src={u.avatarUrl} className="w-5 h-5 rounded-full" /> : u.name.charAt(0).toUpperCase()}
                </button>
              ))}
            </div>
          )}
          <span className="text-[10px] text-muted-foreground ml-2">
            {format(new Date(cycle.startsAt), 'MMM d')} – {format(new Date(cycle.endsAt), 'MMM d')}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {groupedByState.map(({ state, issues: stateIssues }) => {
              const isCollapsed = collapsedStates?.has(state.id) ?? false;
              const droppableId = `${cycle.id}:${state.id}`;
              return (
                <div key={state.id}>
                  <div
                    className="flex items-center gap-2 px-4 py-1.5 bg-zinc-50/60 dark:bg-zinc-900/30 border-b border-zinc-200/60 dark:border-zinc-800/60 cursor-pointer hover:bg-zinc-100/60 dark:hover:bg-zinc-800/30 transition-colors select-none"
                    onClick={() => toggleState(state.id)}
                  >
                    <span className="text-muted-foreground/60">
                      {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                    </span>
                    <StateIcon state={state} />
                    <span className="font-medium text-xs text-zinc-600 dark:text-zinc-300">{state.name}</span>
                    <span className="text-[10px] text-muted-foreground/60 ml-0.5">{stateIssues.length}</span>
                  </div>
                  <Droppable droppableId={droppableId} isDropDisabled={isCompleted}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                          snapshot.isDraggingOver && "bg-primary/5 dark:bg-primary/10"
                        )}
                      >
                        {!isCollapsed && stateIssues.map((issue, index) => (
                          <Draggable key={issue.id} draggableId={issue.id} index={index} isDragDisabled={isCompleted || busyIssues.has(issue.id)}>
                            {(dragProvided, dragSnapshot) => (
                              <div
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                style={dragProvided.draggableProps.style}
                                className={cn(dragSnapshot.isDragging && "shadow-lg ring-1 ring-primary/30 rounded-md bg-white dark:bg-zinc-900 z-50")}
                              >
                                <CycleIssueRow
                                  issue={issue}
                                  workflowStates={workflowStates}
                                  members={members}
                                  showRemove={!isCompleted}
                                  onRemove={() => onRemoveIssue(issue.id)}
                                  onUpdateIssue={onUpdateIssue}
                                  isBusy={busyIssues.has(issue.id)}
                                  trackAction={trackAction}
                                  dragHandleProps={!isCompleted ? dragProvided.dragHandleProps : undefined}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
            {issues.length === 0 && (
              <div className="text-xs text-center text-muted-foreground py-6">
                No issues in this cycle
              </div>
            )}

            {!isCompleted && (
              <div className="border-t border-border/30">
                {onAddIssue ? (
                  <div className="p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Search size={14} className="text-muted-foreground" />
                      <input
                        autoFocus
                        className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/50"
                        placeholder="Search issues to add..."
                        value={addIssueSearch}
                        onChange={e => setAddIssueSearch(e.target.value)}
                      />
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onAddIssueToggle}>
                        <X size={14} />
                      </Button>
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-0.5">
                      {availableIssues.slice(0, 20).map(issue => (
                        <div
                          key={issue.id}
                          className={cn("flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/50 cursor-pointer text-sm transition-opacity", busyIssues.has(issue.id) && "opacity-50 pointer-events-none")}
                          onClick={() => onSelectIssue(issue.id)}
                        >
                          {busyIssues.has(issue.id) ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
                          ) : (
                            <LinearPriorityIcon priority={issue.priority} size={14} />
                          )}
                          <span className="font-mono text-xs text-muted-foreground">{issue.identifier}</span>
                          <span className="truncate text-foreground/80">{issue.title}</span>
                        </div>
                      ))}
                      {availableIssues.length === 0 && (
                        <p className="text-xs text-muted-foreground py-2 text-center">No unassigned issues found</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/30 transition-colors"
                    onClick={onAddIssueToggle}
                  >
                    <Plus size={14} /> Add issue
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CycleIssueRow = ({
  issue,
  workflowStates,
  members,
  showRemove,
  onRemove,
  onUpdateIssue,
  isBusy,
  trackAction,
  dragHandleProps,
}: {
  issue: LinearIssue;
  workflowStates: LinearWorkflowState[];
  members: { id: string; name: string; avatarUrl?: string }[];
  showRemove?: boolean;
  onRemove?: () => void;
  onUpdateIssue: (issueId: string, input: any) => Promise<boolean>;
  isBusy?: boolean;
  trackAction?: (issueId: string, action: () => Promise<any>) => Promise<void>;
  dragHandleProps?: any;
}) => {
  const wrappedUpdate = (input: any) => {
    if (trackAction) return trackAction(issue.id, () => onUpdateIssue(issue.id, input));
    return onUpdateIssue(issue.id, input);
  };

  return (
    <div className={cn("flex items-center gap-3 px-4 py-2 hover:bg-muted/30 transition-all group text-sm relative", isBusy && "opacity-60 pointer-events-none")}>
      {isBusy && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/30">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
        </div>
      )}
      {dragHandleProps && (
        <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-muted-foreground/60 -ml-1 shrink-0">
          <GripVertical size={14} />
        </div>
      )}
      <div onClick={e => e.stopPropagation()}>
        <Select
          value={issue.state.id}
          onValueChange={val => wrappedUpdate({ stateId: val })}
        >
          <SelectTrigger className="h-auto w-auto p-0 border-none shadow-none bg-transparent hover:bg-transparent focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 !ring-0 !outline-none [&>svg:last-child]:hidden">
            <StateIcon state={issue.state} />
          </SelectTrigger>
          <SelectContent>
            {workflowStates.map(s => (
              <SelectItem key={s.id} value={s.id}>
                <div className="flex items-center gap-2">
                  <StateIcon state={s} />
                  {s.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div onClick={e => e.stopPropagation()}>
        <LinearPrioritySelect value={issue.priority} onValueChange={v => wrappedUpdate({ priority: v })} size={14} />
      </div>

      <span className="font-mono text-xs text-muted-foreground/70 w-20 shrink-0">{issue.identifier}</span>

      <div className="flex-1 min-w-0 truncate text-foreground/90 font-medium">
        {issue.title}
      </div>

      {issue.labels.nodes.length > 0 && (
        <div className="flex gap-1 shrink-0">
          {issue.labels.nodes.slice(0, 2).map(l => (
            <span key={l.id} className="text-[9px] px-1.5 py-0.5 rounded-full border whitespace-nowrap"
              style={{ color: l.color, borderColor: `${l.color}30`, backgroundColor: `${l.color}10` }}>
              {l.name}
            </span>
          ))}
        </div>
      )}

      <div className="w-24 shrink-0 flex items-center" onClick={e => e.stopPropagation()}>
        <Select
          value={issue.assignee?.id || 'unassigned'}
          onValueChange={val => wrappedUpdate({ assigneeId: val === 'unassigned' ? null : val })}
        >
          <SelectTrigger className="h-auto w-full p-0 border-none shadow-none bg-transparent focus:ring-0 [&>svg:last-child]:hidden">
            {issue.assignee ? (
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[8px] text-white font-bold shrink-0">
                  {issue.assignee.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-muted-foreground truncate">{formatShortName(issue.assignee.name)}</span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground/40 italic">—</span>
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {members.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <a href={issue.url} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-primary p-1" title="Open in Linear">
          <ExternalLink size={12} />
        </a>
        {showRemove && onRemove && (
          <button className="text-zinc-400 hover:text-red-500 p-1" title="Remove from cycle" onClick={onRemove}>
            <X size={12} />
          </button>
        )}
      </div>
    </div>
  );
};
