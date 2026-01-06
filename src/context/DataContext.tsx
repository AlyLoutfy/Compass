import React, { createContext, useContext, useEffect, useState } from 'react';
import { CompassData, Idea, Ticket, User, Requirement, Organization, ActivityEvent, StandupReport, Notification as AppNotification, Sprint } from '../types';
import { storage } from '../services/storage';
import { v4 as uuidv4 } from 'uuid';


interface DataContextType {
  data: CompassData;
  activityLog: ActivityEvent[];
  isLoading: boolean;
  actions: {
    addIdea: (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'order'>) => void;
    updateIdea: (id: string, updates: Partial<Idea>) => void;
    deleteIdea: (id: string) => void;
    promoteIdeaToTicket: (ideaId: string) => void;
    reorderIdeas: (startIndex: number, endIndex: number) => void;
    
    // Requirements
    addRequirement: (req: Omit<Requirement, 'id' | 'createdAt' | 'status' | 'updatedAt' | 'order'>) => void;
    updateRequirement: (id: string, updates: Partial<Requirement>) => void;
    deleteRequirement: (id: string) => void;
    promoteRequirementToTicket: (reqId: string) => void;
    reorderRequirements: (startIndex: number, endIndex: number) => void;
    reorderTickets: (assignee: string | undefined, status: Ticket['status'], startIndex: number, endIndex: number) => void;
    moveTicketInUserList: (userId: string, startIndex: number, endIndex: number) => void;

    addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'order'>) => void;
    updateTicket: (id: string, updates: Partial<Ticket>) => void;
    moveTicket: (id: string, newStatus: Ticket['status']) => void;
    archiveTicket: (id: string) => void;
    deleteTicket: (id: string) => void;
    
    // Sprints
    addSprint: (sprint: Omit<Sprint, 'id' | 'createdAt'>) => void;
    updateSprint: (id: string, updates: Partial<Sprint>) => void;
    deleteSprint: (id: string) => void;
    startSprint: (id: string, startDate: number, endDate: number) => void;
    completeSprint: (id: string) => void;
    addUser: (user: Omit<User, 'id'>) => void;
    updateUser: (id: string, updates: Partial<User>) => void;
    deleteUser: (id: string) => void;
    
    // Organizations
    addOrganization: (org: Omit<Organization, 'id' | 'createdAt'>) => void;
    updateOrganization: (id: string, updates: Partial<Organization>) => void;
    bulkUpdateOrganizations: (ids: string[], updates: any) => void;
    deleteOrganization: (id: string) => void;


    // EngineRoom Actions
    updateUserStatus: (userId: string, status: User['status']) => void;
    toggleUserBlocker: (userId: string, isBlocked: boolean, reason?: string) => void;
    assignTicket: (ticketId: string, userId: string) => void;
    unassignTicket: (ticketId: string, userId: string) => void;
    completeTicket: (ticketId: string, userId: string) => void;
    saveStandupReport: (report: Omit<StandupReport, 'id'>) => void;
    
    // Notifications
    addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
    markNotificationAsRead: (id: string) => void;
    markAllNotificationsAsRead: () => void;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<CompassData>({
    ideas: [],
    requirements: [],
    tickets: [],
    sprints: [],
    shippedTickets: [],
    users: [],
    organizations: [],
    standupHistory: [],
    notifications: []
  });
  const [activityLog, setActivityLog] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMaxTicketNumber = (tickets: Ticket[]) => {
      const numbers = tickets.map(t => t.categoryNumber || 0);
      return numbers.length > 0 ? Math.max(...numbers) : 0;
  };

  useEffect(() => {
    const loadData = async () => {
      // Force reset with new dummy data, ignoring storage for this request
      
      const dummyUsers: User[] = [
        { id: 'user1', name: 'Ibrahem', email: 'ibrahem@compass.inc', role: 'frontend', status: 'online', avatar: 'https://i.pravatar.cc/150?u=user1' },
        { id: 'user2', name: 'Khaled Osama', email: 'khaled.o@compass.inc', role: 'backend', status: 'online', avatar: 'https://i.pravatar.cc/150?u=user2' },
        { id: 'user3', name: 'Khaled Mohamed', email: 'khaled.m@compass.inc', role: 'frontend', status: 'break', avatar: 'https://i.pravatar.cc/150?u=user3' },
        { id: 'user4', name: 'Naroz', email: 'naroz@compass.inc', role: 'backend', status: 'off', avatar: 'https://i.pravatar.cc/150?u=user4' },
        { id: 'user5', name: 'Milad', email: 'milad@compass.inc', role: 'frontend', status: 'online', isBlocked: true, blockerReason: "Waiting for API specs", avatar: 'https://i.pravatar.cc/150?u=user5' },
      ];

      const dummyOrgs: Organization[] = [
        { 
            id: 'org1', name: 'Palm Hills', isActive: true, 
            features: { leads: true, reservations: true, eois: false, brokerages: true, ticketing: true, analytics: true }, 
            createdAt: Date.now() 
        },
        { 
            id: 'org2', name: 'TMG View', isActive: true, 
            features: { leads: true, reservations: false, eois: true, brokerages: false, ticketing: true, analytics: false }, 
            createdAt: Date.now() 
        },
        { 
            id: 'org3', name: 'Mountain View', isActive: true, 
            features: { leads: true, reservations: true, eois: true, brokerages: true, ticketing: true, analytics: true }, 
            createdAt: Date.now() 
        },
        { 
            id: 'org4', name: 'Ora Developers', isActive: false, 
            features: { leads: false, reservations: false, eois: false, brokerages: false, ticketing: false, analytics: false }, 
            createdAt: Date.now() 
        },
        { 
            id: 'org5', name: 'SODIC', isActive: true, 
            features: { leads: true, reservations: true, eois: false, brokerages: false, ticketing: true, analytics: true }, 
            createdAt: Date.now() 
        },
      ];

      const dummyIdeas: Idea[] = [
        {
             id: 'idea1', title: 'AI Price Prediction', description: 'Use historical sales data to predict future unit prices.',
             businessValue: 'High', sourceType: 'internal', category: 'feature', priority: 'high', status: 'pending', createdAt: Date.now(), updatedAt: Date.now(), order: 0, reportedBy: 'Ibrahem'
        },
        {
             id: 'idea2', title: 'Interactive Map View', description: 'Visual map for selecting units directly from the masterplan.',
             businessValue: 'High', sourceType: 'client', category: 'feature', priority: 'medium', status: 'approved', createdAt: Date.now(), updatedAt: Date.now(), order: 1, reportedBy: 'Khaled Osama'
        },
        {
             id: 'idea3', title: 'WhatsApp Integration', description: 'Directly chat with leads via WhatsApp from the CRM.',
             businessValue: 'Medium', sourceType: 'internal', category: 'improvement', priority: 'low', status: 'needs_clarification', createdAt: Date.now(), updatedAt: Date.now(), order: 2, reportedBy: 'Khaled Mohamed'
        },
        {
             id: 'idea4', title: 'Brokerage Commission Calculator', description: 'Auto-calculate commissions based on tiered structure.',
             businessValue: 'Medium', sourceType: 'client', category: 'feature', priority: 'medium', status: 'pending', createdAt: Date.now(), updatedAt: Date.now(), order: 3, reportedBy: 'Ibrahem'
        },
        {
            id: 'idea5', title: 'VR Unit Tours', description: 'Integration with Matterport for virtual tours of properties.',
            businessValue: 'High', sourceType: 'client', category: 'feature', priority: 'high', status: 'pending', createdAt: Date.now(), updatedAt: Date.now(), order: 4, reportedBy: 'Khaled Osama'
        },
        {
            id: 'idea6', title: 'Automated Email Drip Campaigns', description: 'Send automated follow-ups to leads based on activity.',
            businessValue: 'Medium', sourceType: 'internal', category: 'feature', priority: 'medium', status: 'pending', createdAt: Date.now(), updatedAt: Date.now(), order: 5, reportedBy: 'Naroz'
        },
        {
            id: 'idea7', title: 'Mobile App for Brokers', description: 'Dedicated app for brokers to manage their opportunities.',
            businessValue: 'High', sourceType: 'internal', category: 'feature', priority: 'high', status: 'needs_clarification', createdAt: Date.now(), updatedAt: Date.now(), order: 6, reportedBy: 'Ibrahem'
        },
        {
            id: 'idea8', title: 'Advanced Reporting Suite', description: 'Customizable dashboards for sales managers.',
            businessValue: 'Medium', sourceType: 'client', category: 'improvement', priority: 'low', status: 'pending', createdAt: Date.now(), updatedAt: Date.now(), order: 7, reportedBy: 'Khaled Mohamed'
        },
        {
            id: 'idea9', title: 'Integration with Salesforce', description: 'Two-way sync with Salesforce CRM.',
            businessValue: 'High', sourceType: 'internal', category: 'feature', priority: 'high', status: 'pending', createdAt: Date.now(), updatedAt: Date.now(), order: 8, reportedBy: 'Khaled Osama'
        },
        {
            id: 'idea10', title: 'Dynamic Pricing Engine', description: 'Adjust unit prices based on demand and inventory levels.',
            businessValue: 'High', sourceType: 'internal', category: 'feature', priority: 'critical', status: 'pending', createdAt: Date.now(), updatedAt: Date.now(), order: 9, reportedBy: 'Milad'
        }
      ];

      const dummyReqs: Requirement[] = [
         {
            id: 'req1', title: 'Export Leads to CSV', description: 'Enable sales team to export their assigned leads.', clientName: 'Palm Hills',
            category: 'feature', priority: 'medium', status: 'pending', createdAt: Date.now(), updatedAt: Date.now(), order: 0, reportedBy: 'user1'
         },
         {
            id: 'req2', title: 'Dark Mode Dashboard', description: 'Add dark mode support for the main admin dashboard.', clientName: 'TMG',
            category: 'improvement', priority: 'low', status: 'approved', createdAt: Date.now(), updatedAt: Date.now(), order: 1, reportedBy: 'user4'
         },
         {
            id: 'req3', title: 'Custom Reservation Timer', description: 'Allow setting dynamic timeout for unit reservations.', clientName: 'Mountain View',
            category: 'feature', priority: 'high', status: 'pending', createdAt: Date.now(), updatedAt: Date.now(), order: 2, reportedBy: 'user2'
         }
       ];

      const dummyTickets: Ticket[] = [
        // Backlog
        { id: 't1', title: 'Integrate Payment Gateway', description: 'Setup Stripe integration for down payments.', status: 'backlog', priority: 'high', category: 'feature', categoryNumber: 1, createdAt: Date.now(), updatedAt: Date.now(), order: 0, comments: [] },
        { id: 't2', title: 'Refactor Auth Middleware', description: 'Improve performance of JWT validation.', status: 'backlog', priority: 'medium', category: 'improvement', categoryNumber: 2, createdAt: Date.now(), updatedAt: Date.now(), order: 1, comments: [] },
        { id: 't13', title: 'Optimize Image Loading', description: 'Implement lazy loading for property images.', status: 'backlog', priority: 'low', category: 'improvement', categoryNumber: 13, createdAt: Date.now(), updatedAt: Date.now(), order: 2, comments: [] },
        { id: 't14', title: 'Add Multi-language Support', description: 'Support Arabic and English for the client portal.', status: 'backlog', priority: 'high', category: 'feature', categoryNumber: 14, createdAt: Date.now(), updatedAt: Date.now(), order: 3, comments: [] },
        { id: 't15', title: 'Update Dependencies', description: 'Upgrade React and Node versions to latest stable.', status: 'backlog', priority: 'low', category: 'improvement', categoryNumber: 15, createdAt: Date.now(), updatedAt: Date.now(), order: 4, comments: [] },
        { id: 't16', title: 'Fix Pagination Bug', description: 'Pagination fails on the leads table when filtering.', status: 'backlog', priority: 'medium', category: 'bug', categoryNumber: 16, createdAt: Date.now(), updatedAt: Date.now(), order: 5, comments: [] },
        { id: 't17', title: 'Implement audit logging', description: 'Track all user actions for compliance.', status: 'backlog', priority: 'high', category: 'feature', categoryNumber: 17, createdAt: Date.now(), updatedAt: Date.now(), order: 6, comments: [] },
        { id: 't23', title: 'Design System Update', description: 'Update UI components to match new branding.', status: 'backlog', priority: 'medium', category: 'improvement', categoryNumber: 23, createdAt: Date.now(), updatedAt: Date.now(), order: 7, comments: [] },
        { id: 't24', title: 'Push Notifications', description: 'Enable push notifications for mobile app users.', status: 'backlog', priority: 'high', category: 'feature', categoryNumber: 24, createdAt: Date.now(), updatedAt: Date.now(), order: 8, comments: [] },
        { id: 't25', title: 'Fix broken links in footer', description: 'Privacy policy link returns 404.', status: 'backlog', priority: 'low', category: 'bug', categoryNumber: 25, createdAt: Date.now(), updatedAt: Date.now(), order: 9, comments: [] },
        { id: 't26', title: 'Implement 2FA', description: 'Add 2FA support using Google Authenticator.', status: 'backlog', priority: 'critical', category: 'feature', categoryNumber: 26, createdAt: Date.now(), updatedAt: Date.now(), order: 10, comments: [] },
        { id: 't27', title: 'Fix typo in login screen', description: 'Correct "Passowrd" to "Password".', status: 'backlog', priority: 'low', category: 'bug', categoryNumber: 27, createdAt: Date.now(), updatedAt: Date.now(), order: 11, comments: [] },
        { id: 't28', title: 'Add rate limiting to API', description: 'Prevent abuse by limiting requests per minute.', status: 'backlog', priority: 'high', category: 'feature', categoryNumber: 28, createdAt: Date.now(), updatedAt: Date.now(), order: 12, comments: [] },
        { id: 't29', title: 'Update Mapbox API Key', description: 'Rotate keys for security compliance.', status: 'backlog', priority: 'medium', category: 'improvement', categoryNumber: 29, createdAt: Date.now(), updatedAt: Date.now(), order: 13, comments: [] },
        { id: 't30', title: 'Improve search performance', description: 'Index database columns for faster lookup.', status: 'backlog', priority: 'high', category: 'improvement', categoryNumber: 30, createdAt: Date.now(), updatedAt: Date.now(), order: 14, comments: [] },

        // Sprint
        { id: 't3', title: 'Unit Inventory API', description: 'Create endpoints for fetching available units.', status: 'in_sprint', priority: 'high', category: 'feature', categoryNumber: 3, assignee: 'user2', createdAt: Date.now(), updatedAt: Date.now(), order: 0, comments: [] },
        { id: 't18', title: 'Write API Documentation', description: 'Document all new endpoints using Swagger.', status: 'in_sprint', priority: 'medium', category: 'improvement', categoryNumber: 18, assignee: 'user3', createdAt: Date.now(), updatedAt: Date.now(), order: 1, comments: [] },
        
        // In Progress
        { id: 't4', title: 'Lead Scoring Logic', description: 'Implement algorithm to score leads based on activity.', status: 'in_progress', priority: 'critical', category: 'feature', categoryNumber: 4, assignee: 'user1', createdAt: Date.now(), updatedAt: Date.now(), order: 0, comments: [] },
        { id: 't5', title: 'Fix Mobile Layout', description: 'Sidebar is overlapping content on small screens.', status: 'in_progress', priority: 'medium', category: 'bug', categoryNumber: 5, assignee: 'user3', createdAt: Date.now(), updatedAt: Date.now(), order: 1, comments: [] },
        { id: 't19', title: 'Redis Caching', description: 'Implement caching for frequently accessed data.', status: 'in_progress', priority: 'high', category: 'improvement', categoryNumber: 19, assignee: 'user2', createdAt: Date.now(), updatedAt: Date.now(), order: 2, comments: [] },
        
        // Blocked
        { id: 't6', title: 'Third-party KYC Sync', description: 'Waiting for vendor API documentation.', status: 'blocked', priority: 'high', category: 'feature', categoryNumber: 6, assignee: 'user5', createdAt: Date.now(), updatedAt: Date.now(), order: 0, comments: [] },
        { id: 't20', title: 'SMS Gateway Access', description: 'Pending approval for SMS sender ID.', status: 'blocked', priority: 'medium', category: 'feature', categoryNumber: 20, assignee: 'user4', createdAt: Date.now(), updatedAt: Date.now(), order: 1, comments: [] },
        
        // Ready for QA
        { id: 't7', title: 'User Profile Page', description: 'Allow users to update their avatar and password.', status: 'ready_for_qa', priority: 'medium', category: 'feature', categoryNumber: 7, assignee: 'user3', createdAt: Date.now(), updatedAt: Date.now(), order: 0, comments: [] },
        { id: 't8', title: 'Memory Leak in Calendar', description: 'Fix memory leak when switching months rapidly.', status: 'ready_for_qa', priority: 'critical', category: 'bug', categoryNumber: 8, assignee: 'user4', createdAt: Date.now(), updatedAt: Date.now(), order: 1, comments: [] },
        { id: 't21', title: 'Search Filtering', description: 'Ensure search filters persist after page reload.', status: 'ready_for_qa', priority: 'low', category: 'bug', categoryNumber: 21, assignee: 'user1', createdAt: Date.now(), updatedAt: Date.now(), order: 2, comments: [] },

        // Done
        { id: 't9', title: 'Setup CI/CD Pipeline', description: 'Configure GitHub Actions for automated testing.', status: 'done', priority: 'high', category: 'improvement', categoryNumber: 9, assignee: 'user2', createdAt: Date.now(), updatedAt: Date.now(), order: 0, comments: [] },
        { id: 't22', title: 'Database Migration', description: 'Migrate users table to new schema.', status: 'done', priority: 'critical', category: 'improvement', categoryNumber: 22, assignee: 'user5', createdAt: Date.now(), updatedAt: Date.now(), order: 1, comments: [] },
        
        // Shipped (Archive/Release)
        { id: 't10', title: 'v1.0.0 Release', description: 'Initial public release.', status: 'shipped', priority: 'high', category: 'feature', categoryNumber: 10, assignee: 'user1', createdAt: Date.now() - 86400000 * 2, updatedAt: Date.now() - 86400000 * 2, order: 0, comments: [], tags: ['Release', 'v1.0.0'] },
        { id: 't11', title: 'Hotfix: Login Crash', description: 'Fixed crash on login for Safari users.', status: 'shipped', priority: 'critical', category: 'bug', categoryNumber: 11, assignee: 'user3', createdAt: Date.now() - 86400000 * 5, updatedAt: Date.now() - 86400000 * 5, order: 0, comments: [], tags: ['Hotfix'] },
         { id: 't12', title: 'Analytics Dashboard', description: 'Released the new analytics module.', status: 'shipped', priority: 'high', category: 'feature', categoryNumber: 12, assignee: 'user2', createdAt: Date.now() - 86400000 * 10, updatedAt: Date.now() - 86400000 * 10, order: 0, comments: [], tags: ['Feature'] },
      ];

      const shippedTickets = dummyTickets.filter(t => t.status === 'shipped');
      const activeTickets = dummyTickets.filter(t => t.status !== 'shipped');

      setData({
        ideas: dummyIdeas,
        requirements: dummyReqs,
        tickets: activeTickets,
        sprints: [],
        shippedTickets: shippedTickets,
        users: dummyUsers,
        organizations: dummyOrgs,
        standupHistory: [],
        notifications: []
      });
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Persist on change
  useEffect(() => {
    if (!isLoading) {
      storage.saveAll(data);
    }
  }, [data, isLoading]);

  const saveData = (newData: CompassData) => {
    setData(newData);
  };

  const actions = {
    addIdea: (newIdea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'order'>) => {
      const idea: Idea = {
        ...newIdea,
        id: uuidv4(),
        status: 'pending',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        order: data.ideas.length,
      };
      saveData({ ...data, ideas: [idea, ...data.ideas] });
    },

    updateIdea: (id: string, updates: Partial<Idea>) => {
      const updatedIdeas = data.ideas.map(idea =>
        idea.id === id ? { ...idea, ...updates, updatedAt: Date.now() } : idea
      );
      saveData({ ...data, ideas: updatedIdeas });
    },

    deleteIdea: (id: string) => {
      saveData({ ...data, ideas: data.ideas.filter(idea => idea.id !== id) });
    },

    promoteIdeaToTicket: (ideaId: string) => {
      const idea = data.ideas.find(i => i.id === ideaId);
      if (!idea) return;

      const ticket: Ticket = {
        id: uuidv4(),
        title: idea.title,
        description: idea.description,
        status: 'backlog',
        priority: idea.priority,
        category: idea.category || 'feature',
        categoryNumber: getMaxTicketNumber(data.tickets) + 1,
        // relatedIdeaId: idea.id, 
        comments: [], // Initialize empty comments
        createdAt: Date.now(),
        updatedAt: Date.now(),
        order: data.tickets.filter(t => t.status === 'backlog' && !t.assignee).length,
      };

      const updatedIdeas = data.ideas.map(i =>
        i.id === ideaId ? { ...i, status: 'approved' as const } : i
      );

      saveData({
        ...data,
        ideas: updatedIdeas,
        tickets: [ticket, ...data.tickets]
      });
    },

    reorderIdeas: (startIndex: number, endIndex: number) => {
      const result = Array.from(data.ideas);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      
      // Update order property
      const updatedIdeas = result.map((item, index) => ({ ...item, order: index }));
      saveData({ ...data, ideas: updatedIdeas });
    },

    // Notifications
    addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => {
        const newNotification: AppNotification = {
            ...notification,
            id: uuidv4(),
            timestamp: Date.now(),
            isRead: false
        };
        saveData({ ...data, notifications: [newNotification, ...data.notifications] });
    },

    markNotificationAsRead: (id: string) => {
        saveData({
            ...data,
            notifications: data.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
        });
    },

    markAllNotificationsAsRead: () => {
        saveData({
            ...data,
            notifications: data.notifications.map(n => ({ ...n, isRead: true }))
        });
    },

    // Requirements Actions
    addRequirement: (req: Omit<Requirement, 'id' | 'createdAt' | 'status' | 'updatedAt' | 'order'>) => {
        const requirement: Requirement = {
            ...req,
            id: uuidv4(),
            status: 'pending',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            order: data.requirements.length,
        };
        saveData({ ...data, requirements: [requirement, ...data.requirements] });
    },

    updateRequirement: (id: string, updates: Partial<Requirement>) => {
        const updatedReqs = data.requirements.map(req =>
            req.id === id ? { ...req, ...updates, updatedAt: Date.now() } : req
        );
        saveData({ ...data, requirements: updatedReqs });
    },

    deleteRequirement: (id: string) => {
        saveData({ ...data, requirements: data.requirements.filter(r => r.id !== id) });
    },

    promoteRequirementToTicket: (reqId: string) => {
        const req = data.requirements.find(r => r.id === reqId);
        if (!req) return;

        const ticket: Ticket = {
            id: uuidv4(),
            title: req.title,
            description: `[Client: ${req.clientName}] ${req.description}`,
            status: 'backlog',
            priority: req.priority,
            category: req.category || 'feature',
            categoryNumber: getMaxTicketNumber(data.tickets) + 1,
            comments: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            order: data.tickets.filter(t => t.status === 'backlog' && !t.assignee).length,
        };

        const updatedReqs = data.requirements.map(r => 
            r.id === reqId ? { ...r, status: 'approved' as const } : r
        );

        saveData({
            ...data,
            requirements: updatedReqs,
            tickets: [ticket, ...data.tickets]
        });
    },

    reorderRequirements: (startIndex: number, endIndex: number) => {
        const result = Array.from(data.requirements);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        
        // Update order property
        const updatedReqs = result.map((item, index) => ({ ...item, order: index }));
        saveData({ ...data, requirements: updatedReqs });
    },

    reorderTickets: (assignee: string | undefined, status: Ticket['status'], startIndex: number, endIndex: number) => {
        const userTickets = data.tickets
            .filter(t => t.assignee === assignee && t.status === status)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        
        const result = Array.from(userTickets);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        const updatedUserTickets = result.map((t, idx) => ({ ...t, order: idx }));
        
        const updatedAllTickets = data.tickets.map(t => {
            const updated = updatedUserTickets.find(ut => ut.id === t.id);
            return updated || t;
        });

        saveData({ ...data, tickets: updatedAllTickets });
    },

    moveTicketInUserList: (userId: string, startIndex: number, endIndex: number) => {
        const user = data.users.find(u => u.id === userId);
        if (!user) return;

        // Reconstruct the list exactly as shown in StandupView
        const activeTicket = user.currentTaskId ? data.tickets.find(t => t.id === user.currentTaskId) : null;
        const queuedTickets = data.tickets
            .filter(t => t.assignee === userId && t.status === 'backlog' && t.id !== user.currentTaskId)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        
        const fullList = activeTicket ? [activeTicket, ...queuedTickets] : queuedTickets;
        
        const result = Array.from(fullList);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        // Map back to tickets and users
        const newActive = result[0];
        const updatedUserId = userId;
        
        const updatedUsers = data.users.map(u => {
            if (u.id === updatedUserId) {
                return { ...u, currentTaskId: newActive?.id };
            }
            return u;
        });

        const updatedTickets = data.tickets.map(t => {
            if (t.assignee === updatedUserId) {
                const inList = result.find(rt => rt.id === t.id);
                if (inList) {
                    const newIdx = result.indexOf(inList);
                    return { 
                        ...t, 
                        status: (newIdx === 0 ? 'in_progress' : 'backlog') as Ticket['status'],
                        order: newIdx
                    };
                }
            }
            return t;
        });

        saveData({ ...data, tickets: updatedTickets, users: updatedUsers });
    },

    addTicket: (newTicket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'order'>) => {
      const ticket: Ticket = {
        ...newTicket,
        id: uuidv4(),
        status: newTicket.status || 'backlog',
        category: newTicket.category || 'feature',
        categoryNumber: getMaxTicketNumber(data.tickets) + 1,
        comments: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        order: data.tickets.filter(t => t.status === (newTicket.status || 'backlog') && t.assignee === newTicket.assignee).length,
      };
      saveData({ ...data, tickets: [ticket, ...data.tickets] });
    },

    updateTicket: (id: string, updates: Partial<Ticket>) => {
      const updatedTickets = data.tickets.map(t =>
        t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
      );
      saveData({ ...data, tickets: updatedTickets });
    },

    moveTicket: (id: string, newStatus: Ticket['status']) => {
      const updatedTickets = data.tickets.map(t =>
        t.id === id ? { ...t, status: newStatus, updatedAt: Date.now() } : t
      );
      saveData({ ...data, tickets: updatedTickets });
    },

    archiveTicket: (id: string) => {
        actions.moveTicket(id, 'shipped');
    },

    deleteTicket: (id: string) => {
        saveData({ ...data, tickets: data.tickets.filter((t) => t.id !== id) });
    },

    // Sprints
    addSprint: (sprint: Omit<Sprint, 'id' | 'createdAt'>) => {
        const newSprint: Sprint = {
            ...sprint,
            id: uuidv4(),
            createdAt: Date.now()
        };
        saveData({ ...data, sprints: [...data.sprints, newSprint] });
    },

    updateSprint: (id: string, updates: Partial<Sprint>) => {
        saveData({
            ...data,
            sprints: data.sprints.map(s => s.id === id ? { ...s, ...updates } : s)
        });
    },

    deleteSprint: (id: string) => {
        saveData({
            ...data,
            sprints: data.sprints.filter(s => s.id !== id),
            tickets: data.tickets.map(t => t.sprintId === id ? { ...t, sprintId: undefined } : t)
        });
    },

    startSprint: (id: string, startDate: number, endDate: number) => {
         saveData({
            ...data,
            sprints: data.sprints.map(s => 
                s.id === id ? { ...s, status: 'active', startDate, endDate } : s
            )
        });
    },

    completeSprint: (id: string) => {
         saveData({
            ...data,
            sprints: data.sprints.map(s => 
                s.id === id ? { ...s, status: 'completed' } : s
            )
        });
    },

    addUser: (user: Omit<User, 'id'>) => {
        const newUser: User = { ...user, id: uuidv4() };
        saveData({ ...data, users: [...data.users, newUser] });
    },

    updateUser: (id: string, updates: Partial<User>) => {
        saveData({ 
            ...data, 
            users: data.users.map(u => u.id === id ? { ...u, ...updates } : u) 
        });
    },


    deleteUser: (id: string) => {
        saveData({ ...data, users: data.users.filter(u => u.id !== id) });
    },

    // Organizations
    addOrganization: (org: Omit<Organization, 'id' | 'createdAt'>) => {
        const newOrg: Organization = { ...org, id: uuidv4(), createdAt: Date.now() };
        saveData({ ...data, organizations: [newOrg, ...data.organizations] });
    },

    updateOrganization: (id: string, updates: Partial<Organization>) => {
        saveData({
            ...data,
            organizations: data.organizations.map(d => d.id === id ? { ...d, ...updates } : d)
        });
    },

    bulkUpdateOrganizations: (ids: string[], updates: any) => {
        saveData({
            ...data,
            organizations: data.organizations.map(d => {
                if (ids.includes(d.id)) {
                    const newFeatures = updates.features 
                        ? { ...d.features, ...updates.features } 
                        : d.features;
                    return { ...d, ...updates, features: newFeatures };
                }
                return d;
            })
        });
    },

    deleteOrganization: (id: string) => {
        saveData({ ...data, organizations: data.organizations.filter(d => d.id !== id) });
    },

    // EngineRoom Actions
    updateUserStatus: (userId: string, status: User['status']) => {
        const user = data.users.find(u => u.id === userId);
        if (user && user.status !== status) {
            const updatedUsers = data.users.map(u => u.id === userId ? { ...u, status } : u);
            saveData({ ...data, users: updatedUsers });
            
            // Log activity
            const event: ActivityEvent = {
                id: uuidv4(),
                userId,
                type: 'status_change',
                timestamp: Date.now(),
                details: `changed status to ${status}`
            };
            setActivityLog(prev => [event, ...prev]);
        }
    },

    toggleUserBlocker: (userId: string, isBlocked: boolean, reason?: string) => {
        const updatedUsers = data.users.map(u => u.id === userId ? { ...u, isBlocked, blockerReason: isBlocked ? reason : undefined } : u);
        saveData({ ...data, users: updatedUsers });
        
        const event: ActivityEvent = {
            id: uuidv4(),
            userId,
            type: 'blocker',
            timestamp: Date.now(),
            details: isBlocked ? `is blocked: ${reason || 'No reason provided'}` : 'cleared blocker'
        };
        setActivityLog(prev => [event, ...prev]);
    },

    assignTicket: (ticketId: string, userId: string) => {
        const ticket = data.tickets.find(t => t.id === ticketId);
        const user = data.users.find(u => u.id === userId);
        
        if (ticket && user) {
            const hasActiveTask = !!user.currentTaskId;
            
            // 1. Update Ticket
            // If user has no active task, this becomes active (in_progress).
            // If user HAS active task, this goes to queue (backlog).
            const newStatus = hasActiveTask ? 'backlog' : 'in_progress';
            
            const updatedTickets = data.tickets.map(t => 
                t.id === ticketId ? { 
                    ...t, 
                    assignee: userId, 
                    status: newStatus as Ticket['status'], 
                    updatedAt: Date.now() 
                } : t
            );
            
            // 2. Update User (only if becoming active)
            const updatedUsers = data.users.map(u => {
                if (u.id === userId) {
                    return hasActiveTask ? u : { ...u, currentTaskId: ticketId, currentTaskStartedAt: Date.now() };
                }
                // Also, if this ticket was previously assigned to someone else as active, clear that?
                // The caller should ideally handle unassigning from old user first, but let's be safe:
                // Actually, if we just overwrite assignee on ticket, the old user's currentTaskId might point to a ticket that is no longer theirs.
                // We should clean up old user's reference if needed.
                if (u.currentTaskId === ticketId && u.id !== userId) {
                     return { ...u, currentTaskId: undefined, currentTaskStartedAt: undefined };
                }
                return u;
            });

            saveData({ ...data, tickets: updatedTickets, users: updatedUsers });

            const event: ActivityEvent = {
                id: uuidv4(),
                userId,
                type: 'task_start', // Technically 'assigned' if backlog, but keeping simple
                timestamp: Date.now(),
                details: hasActiveTask ? `queued "${ticket.title}"` : `started working on "${ticket.title}"`,
                ticketId
            };
            setActivityLog(prev => [event, ...prev]);
        }
    },

    unassignTicket: (ticketId: string, userId: string) => {
        const ticket = data.tickets.find(t => t.id === ticketId);
        if (ticket) {
             const updatedTickets = data.tickets.map(t => 
                t.id === ticketId ? { ...t, assignee: undefined, status: 'backlog' as Ticket['status'], updatedAt: Date.now() } : t
            );
            
            const updatedUsers = data.users.map(u => 
                u.id === userId && u.currentTaskId === ticketId 
                    ? { ...u, currentTaskId: undefined, currentTaskStartedAt: undefined } 
                    : u
            );

            saveData({ ...data, tickets: updatedTickets, users: updatedUsers });
        }
    },

    completeTicket: (ticketId: string, userId: string) => {
        const ticket = data.tickets.find(t => t.id === ticketId);
        if (ticket) {
            // Update Ticket
            const updatedTickets = data.tickets.map(t => 
                t.id === ticketId ? { ...t, status: 'done' as Ticket['status'], updatedAt: Date.now() } : t
            );
            
            // Update User
            const updatedUsers = data.users.map(u => 
                u.id === userId ? { ...u, currentTaskId: undefined, currentTaskStartedAt: undefined } : u
            );

            saveData({ ...data, tickets: updatedTickets, users: updatedUsers });

            const event: ActivityEvent = {
                id: uuidv4(),
                userId,
                type: 'task_done',
                timestamp: Date.now(),
                details: `completed "${ticket.title}"`,
                ticketId
            };
            setActivityLog(prev => [event, ...prev]);
        }
    },

    saveStandupReport: (report: Omit<StandupReport, 'id'>) => {
        const newReport: StandupReport = { ...report, id: uuidv4() };
        saveData({ ...data, standupHistory: [newReport, ...data.standupHistory] });
    }
  };

  return (
    <DataContext.Provider value={{ data, isLoading, activityLog, actions }}>
      {children}
    </DataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
