const LINEAR_API_URL = 'https://api.linear.app/graphql';

function getApiKey(): string {
  const key = import.meta.env.VITE_LINEAR_API_KEY;
  if (!key) throw new Error('VITE_LINEAR_API_KEY is not set in .env');
  return key;
}

async function gql<T = any>(query: string, variables?: Record<string, any>): Promise<T> {
  const res = await fetch(LINEAR_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getApiKey(),
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error('Linear GraphQL errors:', json.errors);
    throw new Error(`Linear GraphQL error: ${json.errors.map((e: any) => e.message).join(', ')}`);
  }
  if (!res.ok) {
    throw new Error(`Linear API error: ${res.status}`);
  }
  return json.data;
}

// --- Types ---

export interface LinearTeam {
  id: string;
  name: string;
  key: string;
}

export interface LinearWorkflowState {
  id: string;
  name: string;
  color: string;
  type: 'backlog' | 'unstarted' | 'started' | 'completed' | 'cancelled' | 'canceled';
  position: number;
}

export interface LinearLabel {
  id: string;
  name: string;
  color: string;
}

export interface LinearUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  displayName: string;
  active: boolean;
}

export interface LinearIssue {
  id: string;
  identifier: string;
  title: string;
  description?: string;
  priority: number;
  priorityLabel: string;
  url: string;
  sortOrder: number;
  prioritySortOrder: number;
  estimate?: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  state: LinearWorkflowState;
  assignee?: LinearUser;
  labels: { nodes: LinearLabel[] };
  cycle?: { id: string; name: string; number: number };
  project?: { id: string; name: string; icon?: string; color?: string };
  parent?: { id: string; identifier: string; title: string };
}

export interface LinearCycle {
  id: string;
  name: string;
  number: number;
  startsAt: string;
  endsAt: string;
  completedAt?: string;
  progress: number;
  scopeHistory: number[];
  completedScopeHistory: number[];
}

// --- Query Fragments ---

const ISSUE_FRAGMENT = `
  id
  identifier
  title
  description
  priority
  priorityLabel
  url
  sortOrder
  prioritySortOrder
  estimate
  dueDate
  createdAt
  updatedAt
  state {
    id
    name
    color
    type
    position
  }
  assignee {
    id
    name
    email
    avatarUrl
    displayName
    active
  }
  labels {
    nodes {
      id
      name
      color
    }
  }
  cycle {
    id
    name
    number
  }
  project {
    id
    name
    icon
    color
  }
  parent {
    id
    identifier
    title
  }
`;

// --- Service ---

export const linearService = {
  async fetchTeams(): Promise<LinearTeam[]> {
    const data = await gql<{ teams: { nodes: LinearTeam[] } }>(`
      query { teams { nodes { id name key } } }
    `);
    return data.teams.nodes;
  },

  async fetchWorkflowStates(teamId: string): Promise<LinearWorkflowState[]> {
    const data = await gql<{ workflowStates: { nodes: LinearWorkflowState[] } }>(`
      query($teamId: ID!) {
        workflowStates(filter: { team: { id: { eq: $teamId } } }) {
          nodes { id name color type position }
        }
      }
    `, { teamId });
    return data.workflowStates.nodes.sort((a, b) => a.position - b.position);
  },

  async fetchIssues(teamId: string, cursor?: string): Promise<{
    issues: LinearIssue[];
    hasNextPage: boolean;
    endCursor?: string;
  }> {
    const data = await gql<{
      issues: {
        nodes: LinearIssue[];
        pageInfo: { hasNextPage: boolean; endCursor?: string };
      };
    }>(`
      query($teamId: ID!, $cursor: String) {
        issues(
          filter: { team: { id: { eq: $teamId } } }
          first: 250
          after: $cursor
          orderBy: updatedAt
        ) {
          nodes { ${ISSUE_FRAGMENT} }
          pageInfo { hasNextPage endCursor }
        }
      }
    `, { teamId, cursor });
    return {
      issues: data.issues.nodes,
      hasNextPage: data.issues.pageInfo.hasNextPage,
      endCursor: data.issues.pageInfo.endCursor,
    };
  },

  async fetchAllIssues(teamId: string): Promise<LinearIssue[]> {
    const allIssues: LinearIssue[] = [];
    let cursor: string | undefined;
    let hasNextPage = true;
    while (hasNextPage) {
      const result = await this.fetchIssues(teamId, cursor);
      allIssues.push(...result.issues);
      hasNextPage = result.hasNextPage;
      cursor = result.endCursor;
    }
    return allIssues;
  },

  async fetchCycles(teamId: string): Promise<LinearCycle[]> {
    const data = await gql<{ cycles: { nodes: LinearCycle[] } }>(`
      query($teamId: ID!) {
        cycles(
          filter: { team: { id: { eq: $teamId } } }
          first: 100
          orderBy: createdAt
        ) {
          nodes {
            id name number startsAt endsAt completedAt
            progress scopeHistory completedScopeHistory
          }
        }
      }
    `, { teamId });
    return data.cycles.nodes;
  },

  async fetchLabels(teamId: string): Promise<LinearLabel[]> {
    const data = await gql<{ issueLabels: { nodes: LinearLabel[] } }>(`
      query($teamId: ID!) {
        issueLabels(filter: { team: { id: { eq: $teamId } } }) {
          nodes { id name color }
        }
      }
    `, { teamId });
    return data.issueLabels.nodes;
  },

  async fetchMembers(): Promise<LinearUser[]> {
    const data = await gql<{ users: { nodes: LinearUser[] } }>(`
      query { users { nodes { id name email avatarUrl displayName active } } }
    `);
    return data.users.nodes.filter(u => u.active);
  },

  // --- Mutations (only triggered by explicit user actions) ---

  async createIssue(input: {
    teamId: string;
    title: string;
    description?: string;
    priority?: number;
    stateId?: string;
    assigneeId?: string;
    labelIds?: string[];
    cycleId?: string;
    estimate?: number;
  }): Promise<{ success: boolean; issue?: LinearIssue }> {
    const data = await gql<{ issueCreate: { success: boolean; issue?: LinearIssue } }>(`
      mutation($input: IssueCreateInput!) {
        issueCreate(input: $input) {
          success
          issue { ${ISSUE_FRAGMENT} }
        }
      }
    `, { input });
    return data.issueCreate;
  },

  async updateIssue(issueId: string, input: {
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
  }): Promise<{ success: boolean }> {
    const data = await gql<{ issueUpdate: { success: boolean } }>(`
      mutation($issueId: String!, $input: IssueUpdateInput!) {
        issueUpdate(id: $issueId, input: $input) { success }
      }
    `, { issueId, input });
    return data.issueUpdate;
  },

  async createCycle(input: {
    teamId: string;
    name?: string;
    startsAt: string;
    endsAt: string;
  }): Promise<{ success: boolean; cycle?: LinearCycle }> {
    const data = await gql<{ cycleCreate: { success: boolean; cycle?: LinearCycle } }>(`
      mutation($input: CycleCreateInput!) {
        cycleCreate(input: $input) {
          success
          cycle {
            id name number startsAt endsAt completedAt
            progress scopeHistory completedScopeHistory
          }
        }
      }
    `, { input });
    return data.cycleCreate;
  },
};

// --- Helpers ---

export function mapPriorityToLinear(priority: string): number {
  switch (priority) {
    case 'critical': return 1;
    case 'high': return 2;
    case 'medium': return 3;
    case 'low': return 4;
    default: return 0;
  }
}

export function mapLinearPriorityToLabel(priority: number): string {
  switch (priority) {
    case 1: return 'urgent';
    case 2: return 'high';
    case 3: return 'medium';
    case 4: return 'low';
    default: return 'none';
  }
}

export function getPriorityIcon(priority: number): { color: string; bars: number } {
  switch (priority) {
    case 1: return { color: '#f97316', bars: 4 };
    case 2: return { color: '#f97316', bars: 3 };
    case 3: return { color: '#eab308', bars: 2 };
    case 4: return { color: '#6b7280', bars: 1 };
    default: return { color: '#d4d4d8', bars: 0 };
  }
}
