import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult, DragUpdate } from '@hello-pangea/dnd';
import { useLinear } from '@/context/LinearContext';
import { LinearIssue, LinearWorkflowState } from '@/services/linear';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/Select';
import { format } from 'date-fns';
import { ChevronDown, ChevronRight, ExternalLink, GripVertical, Loader2, RefreshCw, Search, AlertCircle } from 'lucide-react';
import { PageToolbar } from '@/components/layout/PageToolbar';
import { FilterPopover } from '@/components/ui/FilterPopover';
import { cn } from '@/lib/utils';
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
  const size = 14;
  const strokeWidth = 2;
  const r = 5;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let fillFraction = 0;
  if (state.type === 'started') fillFraction = 0.5;
  if (state.type === 'completed') fillFraction = 1;
  if (state.type === 'cancelled' || state.type === 'canceled') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={state.color} strokeWidth={strokeWidth} opacity={0.3} />
        <line x1={4} y1={4} x2={10} y2={10} stroke={state.color} strokeWidth={strokeWidth} strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={state.color} strokeWidth={strokeWidth} opacity={0.3} />
      {fillFraction > 0 && (
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={state.color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference * fillFraction} ${circumference}`}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
        />
      )}
      {fillFraction === 1 && (
        <circle cx={cx} cy={cy} r={3} fill={state.color} />
      )}
    </svg>
  );
};

export const TicketsBoard = () => {
  const { issues, workflowStates, members, labels: allLabels, cycles, isLoading, error, refetch, actions } = useLinear();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [filterLabel, setFilterLabel] = useState<string>('all');
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string> | null>(null);
  const [editingIssue, setEditingIssue] = useState<LinearIssue | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [busyIssues, setBusyIssues] = useState<Set<string>>(new Set());

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

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!issue.title.toLowerCase().includes(q) &&
            !issue.identifier.toLowerCase().includes(q) &&
            !(issue.description || '').toLowerCase().includes(q)) return false;
      }
      if (filterPriority !== 'all' && String(issue.priority) !== filterPriority) return false;
      if (filterAssignee !== 'all') {
        if (filterAssignee === 'unassigned' && issue.assignee) return false;
        if (filterAssignee !== 'unassigned' && issue.assignee?.id !== filterAssignee) return false;
      }
      if (filterLabel !== 'all' && !issue.labels.nodes.some(l => l.id === filterLabel)) return false;
      return true;
    });
  }, [issues, searchQuery, filterPriority, filterAssignee, filterLabel]);

  const sortedStates = useMemo(() =>
    [...workflowStates].sort((a, b) => {
      const orderA = STATE_TYPE_ORDER[a.type] ?? 5;
      const orderB = STATE_TYPE_ORDER[b.type] ?? 5;
      if (orderA !== orderB) return orderA - orderB;
      return a.position - b.position;
    }),
  [workflowStates]);

  const issuesByStateId = useMemo(() => {
    const map: Record<string, LinearIssue[]> = {};
    for (const state of sortedStates) map[state.id] = [];
    for (const issue of filteredIssues) {
      if (map[issue.state.id]) map[issue.state.id].push(issue);
    }
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => {
        const pa = a.priority || Infinity;
        const pb = b.priority || Infinity;
        if (pa !== pb) return pa - pb;
        return a.sortOrder - b.sortOrder;
      });
    }
    return map;
  }, [filteredIssues, sortedStates]);

  const groupedByState = useMemo(() =>
    sortedStates
      .map(state => ({ state, issues: issuesByStateId[state.id] || [] }))
      .filter(g => g.issues.length > 0),
  [sortedStates, issuesByStateId]);

  const allGroupsForDrop = useMemo(() =>
    sortedStates.map(state => ({ state, issues: issuesByStateId[state.id] || [] })),
  [sortedStates, issuesByStateId]);

  useEffect(() => {
    if (collapsedGroups === null && groupedByState.length > 0) {
      const collapsed = new Set<string>();
      groupedByState.forEach(({ state }) => {
        if (state.type !== 'unstarted') collapsed.add(state.id);
      });
      setCollapsedGroups(collapsed);
    }
  }, [groupedByState, collapsedGroups]);

  const toggleGroup = (stateId: string) => {
    const current = collapsedGroups || new Set<string>();
    const newSet = new Set<string>(current);
    if (newSet.has(stateId)) newSet.delete(stateId);
    else newSet.add(stateId);
    setCollapsedGroups(newSet);
  };

  const handleStatusChange = useCallback(async (issue: LinearIssue, newStateId: string) => {
    await trackAction(issue.id, async () => {
      try {
        await actions.updateIssue(issue.id, { stateId: newStateId });
      } catch (err) {
        console.error('Failed to update status:', err);
      }
    });
  }, [trackAction, actions]);

  const handleAssigneeChange = async (issue: LinearIssue, newAssigneeId: string | null) => {
    await trackAction(issue.id, async () => {
      try {
        await actions.updateIssue(issue.id, { assigneeId: newAssigneeId });
      } catch (err) {
        console.error('Failed to update assignee:', err);
      }
    });
  };

  const handlePriorityChange = async (issue: LinearIssue, newPriority: number) => {
    await trackAction(issue.id, async () => {
      try {
        await actions.updateIssue(issue.id, { priority: newPriority });
      } catch (err) {
        console.error('Failed to update priority:', err);
      }
    });
  };

  const handleCycleChange = async (issue: LinearIssue, cycleId: string | null) => {
    await trackAction(issue.id, async () => {
      try {
        await actions.updateIssue(issue.id, { cycleId });
      } catch (err) {
        console.error('Failed to update cycle:', err);
      }
    });
  };

  const [isDragging, setIsDragging] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastHoveredDroppableRef = useRef<string | null>(null);

  const onDragStart = useCallback(() => {
    setIsDragging(true);
    lastHoveredDroppableRef.current = null;
  }, []);

  const onDragUpdate = useCallback((update: DragUpdate) => {
    const overId = update.destination?.droppableId ?? null;
    if (overId === lastHoveredDroppableRef.current) return;
    lastHoveredDroppableRef.current = overId;
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    if (overId && collapsedGroups?.has(overId)) {
      hoverTimerRef.current = setTimeout(() => {
        setCollapsedGroups(prev => {
          const next = new Set<string>(prev || new Set());
          next.delete(overId);
          return next;
        });
      }, 800);
    }
  }, [collapsedGroups]);

  const computeSortOrder = useCallback((list: LinearIssue[], destIndex: number, draggedId: string): number => {
    const filtered = list.filter(i => i.id !== draggedId);
    if (filtered.length === 0) return 0;
    if (destIndex === 0) return filtered[0].sortOrder - 1;
    if (destIndex >= filtered.length) return filtered[filtered.length - 1].sortOrder + 1;
    return (filtered[destIndex - 1].sortOrder + filtered[destIndex].sortOrder) / 2;
  }, []);

  const onDragEnd = useCallback((result: DropResult) => {
    setIsDragging(false);
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    lastHoveredDroppableRef.current = null;
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const issue = issues.find(i => i.id === draggableId);
    if (!issue) return;

    const sameGroup = source.droppableId === destination.droppableId;
    const samePosition = sameGroup && source.index === destination.index;
    if (samePosition) return;

    const destIssues = issuesByStateId[destination.droppableId] || [];
    const newSortOrder = computeSortOrder(destIssues, destination.index, draggableId);

    if (sameGroup) {
      trackAction(issue.id, async () => {
        try {
          await actions.updateIssue(issue.id, { sortOrder: newSortOrder });
        } catch (err) {
          console.error('Failed to reorder issue:', err);
        }
      });
    } else {
      const newStateId = destination.droppableId;
      if (collapsedGroups?.has(newStateId)) {
        setCollapsedGroups(prev => {
          const next = new Set<string>(prev || new Set());
          next.delete(newStateId);
          return next;
        });
      }
      trackAction(issue.id, async () => {
        try {
          await actions.updateIssue(issue.id, { stateId: newStateId, sortOrder: newSortOrder });
        } catch (err) {
          console.error('Failed to move issue:', err);
        }
      });
    }
  }, [issues, issuesByStateId, collapsedGroups, computeSortOrder, trackAction, actions]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading tickets from Linear...</p>
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
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="pt-4 md:pt-8 pb-4">
        <PageToolbar
          title="Tickets"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search tickets..."
          count={filteredIssues.length}
          countLabel="Issues"
          filters={
            <FilterPopover
              title="Filter Issues"
              activeCount={
                (filterPriority !== 'all' ? 1 : 0) +
                (filterAssignee !== 'all' ? 1 : 0) +
                (filterLabel !== 'all' ? 1 : 0)
              }
              onReset={() => { setFilterPriority('all'); setFilterAssignee('all'); setFilterLabel('all'); }}
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Priority</label>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="h-9 w-full">
                      <span className="truncate capitalize">{filterPriority === 'all' ? 'All Priorities' : ['None','Urgent','High','Medium','Low'][Number(filterPriority)]}</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="1">Urgent</SelectItem>
                      <SelectItem value="2">High</SelectItem>
                      <SelectItem value="3">Medium</SelectItem>
                      <SelectItem value="4">Low</SelectItem>
                      <SelectItem value="0">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Label</label>
                  <Select value={filterLabel} onValueChange={setFilterLabel}>
                    <SelectTrigger className="h-9 w-full">
                      <span className="truncate">{filterLabel === 'all' ? 'All Labels' : allLabels.find(l => l.id === filterLabel)?.name || filterLabel}</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Labels</SelectItem>
                      {allLabels.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </FilterPopover>
          }
          actions={
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs rounded-lg"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("w-3.5 h-3.5 mr-2", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
          }
        />
      </div>

      <DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg overflow-hidden text-[13px]">
          {(isDragging ? allGroupsForDrop : groupedByState).map(({ state, issues: groupIssues }) => {
            const isCollapsed = collapsedGroups?.has(state.id) ?? false;
            return (
              <Droppable key={state.id} droppableId={state.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 bg-zinc-50/80 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors select-none",
                        snapshot.isDraggingOver && "bg-primary/5 dark:bg-primary/10 ring-1 ring-inset ring-primary/20"
                      )}
                      onClick={() => !isDragging && toggleGroup(state.id)}
                    >
                      <span className="text-muted-foreground">
                        {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                      </span>
                      <StateIcon state={state} />
                      <span className="font-medium text-sm text-zinc-700 dark:text-zinc-200">{state.name}</span>
                      <span className="text-xs text-muted-foreground ml-1">{groupIssues.length}</span>
                    </div>
                    {!isCollapsed && (
                      <div>
                        {groupIssues.map((issue, index) => (
                          <Draggable key={issue.id} draggableId={issue.id} index={index} isDragDisabled={busyIssues.has(issue.id)}>
                            {(dragProvided, dragSnapshot) => (
                              <div
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                style={dragProvided.draggableProps.style}
                                className={cn(
                                  dragSnapshot.isDragging && "shadow-lg ring-1 ring-primary/30 rounded-md bg-white dark:bg-zinc-900 z-50"
                                )}
                              >
                                <IssueRow
                                  issue={issue}
                                  workflowStates={workflowStates}
                                  members={members}
                                  onStatusChange={handleStatusChange}
                                  onAssigneeChange={handleAssigneeChange}
                                  onPriorityChange={handlePriorityChange}
                                  onCycleChange={handleCycleChange}
                                  onOpen={setEditingIssue}
                                  isBusy={busyIssues.has(issue.id)}
                                  cycles={cycles}
                                  dragHandleProps={dragProvided.dragHandleProps}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                    {isCollapsed && <div className="hidden">{provided.placeholder}</div>}
                  </div>
                )}
              </Droppable>
            );
          })}
          {groupedByState.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No issues found</p>
            </div>
          )}
        </div>
      </DragDropContext>

      {editingIssue && (
        <IssueDetailPanel
          issue={editingIssue}
          onClose={() => setEditingIssue(null)}
          workflowStates={workflowStates}
          members={members}
          onUpdate={actions.updateIssue}
        />
      )}
    </div>
  );
};

const IssueRow = ({
  issue,
  members,
  onAssigneeChange,
  onPriorityChange,
  onCycleChange,
  onOpen,
  isBusy,
  cycles,
  dragHandleProps,
}: {
  issue: LinearIssue;
  workflowStates: LinearWorkflowState[];
  members: { id: string; name: string; avatarUrl?: string }[];
  onStatusChange: (issue: LinearIssue, stateId: string) => void;
  onAssigneeChange: (issue: LinearIssue, assigneeId: string | null) => void;
  onPriorityChange: (issue: LinearIssue, priority: number) => void;
  onCycleChange: (issue: LinearIssue, cycleId: string | null) => void;
  onOpen: (issue: LinearIssue) => void;
  isBusy?: boolean;
  cycles: { id: string; name: string; number: number }[];
  dragHandleProps?: any;
}) => {
  return (
    <div className={cn("flex items-center border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all group relative", isBusy && "opacity-60 pointer-events-none")}>
      {isBusy && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
        </div>
      )}
      <div className="w-6 shrink-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" {...dragHandleProps}>
        <GripVertical size={12} className="text-zinc-300 dark:text-zinc-600 cursor-grab active:cursor-grabbing" />
      </div>
      <div className="w-8 shrink-0 flex items-center justify-center" onClick={e => e.stopPropagation()}>
        <LinearPrioritySelect value={issue.priority} onValueChange={v => onPriorityChange(issue, v)} />
      </div>

      <div className="w-24 shrink-0 px-2 py-2.5">
        <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500">{issue.identifier}</span>
      </div>

      <div
        className="flex-1 min-w-0 px-2 py-2.5 cursor-pointer group-hover:text-primary transition-colors"
        onClick={() => onOpen(issue)}
      >
        <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate block">{issue.title}</span>
      </div>

      <div className="flex items-center gap-1.5 px-2 shrink-0">
        {issue.labels.nodes.map(label => (
          <span
            key={label.id}
            className="text-[10px] px-1.5 py-0.5 rounded-full font-medium border whitespace-nowrap"
            style={{
              color: label.color,
              backgroundColor: `${label.color}15`,
              borderColor: `${label.color}30`,
            }}
          >
            {label.name}
          </span>
        ))}
      </div>

      {issue.project && (
        <div className="w-20 shrink-0 px-2 flex items-center">
          <span className="text-[10px] text-zinc-400 truncate" title={issue.project.name}>
            {issue.project.name}
          </span>
        </div>
      )}

      <div className="w-16 shrink-0 px-2 flex items-center justify-center" onClick={e => e.stopPropagation()}>
        <Select
          value={issue.cycle?.id || 'none'}
          onValueChange={val => onCycleChange(issue, val === 'none' ? null : val)}
        >
          <SelectTrigger className="h-7 w-full border-none shadow-none bg-transparent p-0 px-1 text-[10px] hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:ring-0 rounded [&>svg:last-child]:hidden justify-center">
            {issue.cycle ? (
              <span className="text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">{issue.cycle.number}</span>
            ) : (
              <span className="text-zinc-300 dark:text-zinc-600">—</span>
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No cycle</SelectItem>
            {cycles.map(c => <SelectItem key={c.id} value={c.id}>{c.name || `Cycle ${c.number}`}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="w-28 shrink-0 px-2" onClick={e => e.stopPropagation()}>
        <Select
          value={issue.assignee?.id || 'unassigned'}
          onValueChange={val => onAssigneeChange(issue, val === 'unassigned' ? null : val)}
        >
          <SelectTrigger className="h-7 w-full border-none shadow-none bg-transparent p-0 px-1 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:ring-0 rounded [&>svg:last-child]:hidden">
            {issue.assignee ? (
              <div className="flex items-center gap-1.5 truncate">
                {issue.assignee.avatarUrl ? (
                  <img src={issue.assignee.avatarUrl} className="w-4 h-4 rounded-full shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[8px] text-white font-bold shrink-0">
                    {issue.assignee.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="truncate text-zinc-600 dark:text-zinc-400">{formatShortName(issue.assignee.name)}</span>
              </div>
            ) : (
              <span className="text-zinc-300 dark:text-zinc-600 italic">—</span>
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {members.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="w-16 shrink-0 px-2 text-right">
        <span className="text-[11px] text-zinc-400">{format(new Date(issue.createdAt), 'MMM d')}</span>
      </div>

      <div className="w-8 shrink-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <a href={issue.url} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-primary" title="Open in Linear">
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
};

const IssueDetailPanel = ({
  issue,
  onClose,
  workflowStates,
  members,
  onUpdate,
}: {
  issue: LinearIssue;
  onClose: () => void;
  workflowStates: LinearWorkflowState[];
  members: { id: string; name: string; avatarUrl?: string }[];
  onUpdate: (issueId: string, input: any) => Promise<boolean>;
}) => {
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(issue.id, { title, description });
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden text-zinc-100 max-w-3xl w-full flex flex-col h-[80vh] md:h-[600px] z-10"
          onClick={e => e.stopPropagation()}
        >
          <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-white/5">
            <div className="flex items-center gap-3 text-zinc-400 text-sm">
              <span className="font-mono text-zinc-500">{issue.identifier}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <StateIcon state={issue.state} />
              <span>{issue.state.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <a href={issue.url} target="_blank" rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white text-xs flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5">
                <ExternalLink size={12} /> Open in Linear
              </a>
              <Button size="sm" onClick={handleSave} disabled={isSaving} className="h-8 text-xs bg-white text-black hover:bg-zinc-200">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400 hover:text-white" onClick={onClose}>×</Button>
            </div>
          </div>
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-8">
                <input
                  type="text"
                  className="bg-transparent border-none text-2xl font-bold mb-6 text-white w-full focus:ring-0 p-0 placeholder:text-zinc-600 focus:outline-none"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
                <textarea
                  className="w-full h-[300px] bg-transparent border-none resize-none focus:ring-0 p-0 text-sm leading-relaxed text-zinc-300 font-mono focus:outline-none placeholder:text-zinc-600"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Add a description..."
                />
              </div>
            </div>
            <div className="w-64 bg-[#09090b] p-4 space-y-5 overflow-y-auto shrink-0 border-l border-white/5">
              <div className="space-y-2">
                <div className="text-xs font-bold text-zinc-500 uppercase">Status</div>
                <Select
                  value={issue.state.id}
                  onValueChange={async val => { await onUpdate(issue.id, { stateId: val }); }}
                >
                  <SelectTrigger className="w-full bg-transparent border border-transparent hover:border-white/10 hover:bg-white/5 text-zinc-300 h-9">
                    <div className="flex items-center gap-2">
                      <StateIcon state={issue.state} />
                      {issue.state.name}
                    </div>
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
              <div className="space-y-2">
                <div className="text-xs font-bold text-zinc-500 uppercase">Assignee</div>
                <Select
                  value={issue.assignee?.id || 'unassigned'}
                  onValueChange={async val => { await onUpdate(issue.id, { assigneeId: val === 'unassigned' ? null : val }); }}
                >
                  <SelectTrigger className="w-full bg-transparent border border-transparent hover:border-white/10 hover:bg-white/5 text-zinc-300 h-9">
                    <span>{issue.assignee?.name || 'Unassigned'}</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {members.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-bold text-zinc-500 uppercase">Priority</div>
                <Select
                  value={String(issue.priority)}
                  onValueChange={async val => { await onUpdate(issue.id, { priority: Number(val) }); }}
                >
                  <SelectTrigger className="w-full bg-transparent border border-transparent hover:border-white/10 hover:bg-white/5 text-zinc-300 h-9">
                    <div className="flex items-center gap-2">
                      <LinearPriorityIcon priority={issue.priority} />
                      {issue.priorityLabel}
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No priority</SelectItem>
                    <SelectItem value="1">Urgent</SelectItem>
                    <SelectItem value="2">High</SelectItem>
                    <SelectItem value="3">Medium</SelectItem>
                    <SelectItem value="4">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {issue.labels.nodes.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-zinc-500 uppercase">Labels</div>
                  <div className="flex flex-wrap gap-1">
                    {issue.labels.nodes.map(l => (
                      <span key={l.id} className="text-[10px] px-1.5 py-0.5 rounded border" style={{ color: l.color, borderColor: `${l.color}40`, backgroundColor: `${l.color}10` }}>
                        {l.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {issue.cycle && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-zinc-500 uppercase">Cycle</div>
                  <span className="text-sm text-zinc-400">{issue.cycle.name}</span>
                </div>
              )}
              <div className="pt-4 border-t border-white/5 space-y-2 text-xs text-zinc-500">
                <div>Created {format(new Date(issue.createdAt), 'MMM d, yyyy')}</div>
                <div>Updated {format(new Date(issue.updatedAt), 'MMM d, yyyy')}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
