import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/context/DataContext';
import { Organization, OrganizationFeatures } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageToolbar } from '@/components/layout/PageToolbar';
import { 
  Building2, 
  Trash2, 
  Plus, 
  Settings2,
  Building,
  Upload,
  PieChart,
  Ticket,
  ClipboardList,
  CalendarCheck,
  Users,
  Network,
  Camera,
  Check,
  Power
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { cn } from '@/lib/utils';

type FeatureKey = keyof OrganizationFeatures;

const FEATURE_LABELS: Record<FeatureKey, string> = {
  leads: 'Leads',
  reservations: 'Reservations',
  eois: 'EOIs',
  brokerages: 'Brokerages',
  ticketing: 'Ticketing',
  analytics: 'Analytics'
};

const FEATURE_ICONS: Record<FeatureKey, any> = {
  leads: Users,
  reservations: CalendarCheck,
  eois: ClipboardList,
  brokerages: Network,
  ticketing: Ticket,
  analytics: PieChart
};

export const OrganizationsPage = () => {
  const { data, actions } = useData();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [confirmToggle, setConfirmToggle] = useState<{
    orgId: string;
    key: FeatureKey;
    value: boolean;
  } | null>(null);

  // State for Add Modal
  const [newOrg, setNewOrg] = useState({
    name: '',
    logo: '',
    isActive: true
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const visibleOrganizations = data.organizations.filter(d => {
    const matchesSearch = searchQuery 
        ? d.name.toLowerCase().includes(searchQuery.toLowerCase()) 
        : true;
    const matchesStatus = showInactive || d.isActive;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === visibleOrganizations.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(visibleOrganizations.map(d => d.id));
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAddOrganization = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrg.name.trim()) return;
    
    actions.addOrganization({
      name: newOrg.name,
      logo: newOrg.logo,
      isActive: newOrg.isActive,
      features: {
        leads: false,
        reservations: false,
        eois: false,
        brokerages: false,
        ticketing: false,
        analytics: false
      }
    });
    setNewOrg({ name: '', logo: '', isActive: true });
    setIsAddModalOpen(false);
  };

  const handleBulkFeatureToggle = (key: FeatureKey, value: boolean) => {
    actions.bulkUpdateOrganizations(selectedIds, { features: { [key]: value } });
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (isEdit && editingOrganization) {
          setEditingOrganization({ ...editingOrganization, logo: base64 });
        } else {
          setNewOrg(prev => ({ ...prev, logo: base64 }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Clipboard support
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    
    const text = e.clipboardData.getData('text');
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    
    if (lines.length > 1) {
        if (window.confirm(`Paste ${lines.length} organizations?`)) {
            lines.forEach(name => {
                actions.addOrganization({
                    name: name.trim(),
                    isActive: true,
                    features: { leads: false, reservations: false, eois: false, brokerages: false, ticketing: false, analytics: false }
                });
            });
        }
    }
  }, [actions]);

  return (
    <div className="flex flex-col" onPaste={handlePaste}>
      <div className="pt-4 md:pt-8 pb-4">
        <PageToolbar
            title="Organizations"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search organizations..."
            count={visibleOrganizations.length}
            countLabel="Organizations"
            filters={
                <Button 
                    variant={showInactive ? "primary" : "outline"} 
                    size="sm" 
                    className={cn(
                        "h-8 text-xs gap-2 border-dashed",
                        showInactive && "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                    )}
                    onClick={() => setShowInactive(!showInactive)}
                >
                    <Power size={14} />
                    {showInactive ? "Showing Inactive" : "Show Inactive"}
                </Button>
            }
            actions={
                <>
                  {selectedIds.length > 0 && (
                     <Button size="sm" variant="outline" onClick={() => setIsBulkModalOpen(true)} className="h-8 text-xs">
                        <Settings2 className="w-3.5 h-3.5 mr-2" />
                        Bulk Actions ({selectedIds.length})
                     </Button>
                  )}
                  <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="h-8 text-xs rounded-lg">
                    <Plus className="w-3.5 h-3.5 mr-2" />
                    New Org
                  </Button>
                </>
            }
        />
      </div>

      <div className="mt-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {/* Header */}
          <div className="flex items-center min-w-[1000px] border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-xs font-semibold text-zinc-500 h-[45px]">
             <div className="w-16 shrink-0 p-2 text-center flex items-center justify-center h-full">
                  <input 
                    type="checkbox" 
                    className="rounded border-zinc-300 dark:border-zinc-700 accent-primary cursor-pointer"
                    checked={selectedIds.length === visibleOrganizations.length && visibleOrganizations.length > 0}
                    onChange={toggleSelectAll}
                  />
             </div>
             <div className="flex-1 min-w-[200px] p-2 pl-3 uppercase tracking-wider text-[10px] h-full flex items-center">Organization Name</div>
             <div className="w-28 shrink-0 p-2 text-center uppercase tracking-wider text-[10px] h-full flex items-center justify-center">Status</div>
             {(Object.keys(FEATURE_LABELS) as FeatureKey[]).map((key) => (
                <div key={key} className="w-28 shrink-0 p-2 text-center uppercase tracking-wider text-[10px] h-full flex items-center justify-center">
                    {FEATURE_LABELS[key]}
                </div>
             ))}
             <div className="w-16 shrink-0 p-2 text-center h-full"></div>
          </div>

          <div className="min-w-[1000px]">
             <AnimatePresence mode="popLayout" initial={false}>
               {visibleOrganizations.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-12 text-center text-muted-foreground italic border-b border-zinc-100 dark:border-zinc-800"
                    >
                        {showInactive ? "No organizations found." : "No active organizations. Toggle view to see inactive ones."}
                    </motion.div>
               ) : (
                   visibleOrganizations.map((org) => (
                      <motion.div
                        layout
                        key={org.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setEditingOrganization(org)}
                        className={cn(
                          "flex items-center border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group cursor-pointer",
                          selectedIds.includes(org.id) && "bg-primary/5"
                        )}
                      >
                         <div className="w-16 shrink-0 p-3 text-center flex items-center justify-center">
                           <input 
                             type="checkbox" 
                             className="rounded border-zinc-300 dark:border-zinc-700 accent-primary cursor-pointer"
                             checked={selectedIds.includes(org.id)}
                             onClick={(e) => e.stopPropagation()}
                             onChange={(e) => toggleSelect(org.id, e as any)}
                           />
                         </div>
                         <div className="flex-1 min-w-[200px] p-3 pl-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                                 {org.logo ? (
                                     <img src={org.logo} className="w-full h-full object-cover" />
                                 ) : (
                                     <Building size={18} />
                                 )}
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">{org.name}</span>
                                 <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">Click to edit</span>
                              </div>
                           </div>
                         </div>
                         <div className="w-28 shrink-0 p-3 text-center">
                             <div className={cn(
                                 "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter border",
                                 org.isActive 
                                     ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400" 
                                     : "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-500 dark:border-zinc-700"
                             )}>
                                 {org.isActive ? 'Active' : 'Inactive'}
                             </div>
                         </div>
                         {(Object.keys(FEATURE_LABELS) as FeatureKey[]).map((key) => (
                           <div key={key} className="w-28 shrink-0 p-3 text-center">
                             <button 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setConfirmToggle({ orgId: org.id, key, value: !org.features[key] });
                               }}
                               className={cn(
                                 "mx-auto w-10 h-5 rounded-full transition-all duration-200 relative p-1",
                                 org.features[key] ? "bg-primary" : "bg-zinc-200 dark:bg-zinc-700"
                               )}
                             >
                                <div className={cn(
                                  "w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-200",
                                  org.features[key] ? "translate-x-5" : "translate-x-0"
                                )} />
                             </button>
                           </div>
                         ))}
                         <div className="w-16 shrink-0 p-3 text-center flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setDeletingId(org.id);
                               }}
                               className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                            >
                               <Trash2 size={16} />
                            </button>
                         </div>
                      </motion.div>
                   ))
               )}
             </AnimatePresence>
          </div>

            {visibleOrganizations.length > 0 && (
              <div className="flex items-center bg-zinc-50/50 dark:bg-zinc-900/20 border-t border-zinc-200 dark:border-zinc-800 min-w-[1000px] text-xs font-medium text-muted-foreground">
                  <div className="w-16 p-2"></div>
                  <div className="flex-1 p-2 pl-3 flex items-center gap-2">
                      <span className="uppercase text-[10px] font-bold tracking-wider">Total:</span>
                      <span className="font-bold text-foreground">{visibleOrganizations.length}</span>
                  </div>
                  <div className="w-28 p-2 text-center flex justify-center gap-1">
                      <span className="font-bold text-foreground">{visibleOrganizations.filter(d => d.isActive).length}</span>
                      <span className="text-[8px] uppercase font-bold tracking-tighter">Live</span>
                  </div>
                  {(Object.keys(FEATURE_LABELS) as FeatureKey[]).map((key) => {
                     const count = visibleOrganizations.filter(org => org.features[key]).length;
                     return (
                        <div key={key} className="w-28 p-2 text-center flex justify-center gap-1">
                             <span className="font-bold text-foreground">{count}</span>
                             <span className="text-[8px] uppercase font-bold tracking-tighter">Active</span>
                        </div>
                     );
                  })}
                  <div className="w-16 p-2"></div>
              </div>
            )}
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            <Building2 size={20} />
          </div>
          Add Real Estate Organization
        </div>
      }>
        <form onSubmit={handleAddOrganization} className="space-y-6">
          <div className="flex flex-col items-center">
             <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all overflow-hidden bg-zinc-50 dark:bg-zinc-800"
             >
                {newOrg.logo ? (
                    <img src={newOrg.logo} className="w-full h-full object-cover" />
                ) : (
                    <>
                        <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                        <span className="text-[10px] font-medium text-muted-foreground uppercase">Upload Icon</span>
                    </>
                )}
             </div>
             <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={(e) => handleIconUpload(e)}
             />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-primary mb-1 block">Organization Name</label>
            <Input 
              autoFocus
              required 
              value={newOrg.name} 
              onChange={e => setNewOrg(prev => ({ ...prev, name: e.target.value }))} 
              placeholder="e.g. SODIC"
            />
          </div>
          <div className="pt-4 flex justify-end">
            <Button type="submit" className="w-full">Create Organization</Button>
          </div>
        </form>
      </Modal>

      {/* Bulk Edit Modal */}
      <Modal isOpen={isBulkModalOpen} onClose={() => setIsBulkModalOpen(false)} title="Bulk Edit Features">
          <div className="space-y-6">
             <div className="p-4 bg-muted/30 rounded-xl border border-dashed text-center">
                <p className="text-sm font-medium">Bulk editing {selectedIds.length} organizations</p>
                <p className="text-xs text-muted-foreground mt-1">Changes will be applied to all selected rows.</p>
             </div>
             <div className="space-y-3">
                {(Object.keys(FEATURE_LABELS) as FeatureKey[]).map((key) => (
                   <div key={key} className="flex items-center justify-between p-3 border rounded-xl bg-card">
                      <span className="text-sm font-medium">{FEATURE_LABELS[key]}</span>
                      <div className="flex gap-2">
                         <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 px-4 text-xs font-bold border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-900/20" 
                            onClick={() => handleBulkFeatureToggle(key, true)}
                         >
                            ENABLE
                         </Button>
                         <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 px-4 text-xs font-bold border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20" 
                            onClick={() => handleBulkFeatureToggle(key, false)}
                         >
                            DISABLE
                         </Button>
                      </div>
                   </div>
                ))}
             </div>
             <div className="flex justify-end pt-4">
                <Button onClick={() => setIsBulkModalOpen(false)}>Close</Button>
             </div>
          </div>
      </Modal>

      {/* Edit Organization Modal */}
      <Modal 
        isOpen={!!editingOrganization} 
        onClose={() => setEditingOrganization(null)} 
        title={null} 
        noPadding
        className="max-w-2xl p-0 overflow-hidden"
      >
        {editingOrganization && (
            <div className="flex flex-col">
                {/* Modern Header / Banner (Reduced Size) */}
                <div className="h-28 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent relative border-b border-border/40">
                    <div className="absolute top-4 left-8">
                         <button 
                            onClick={() => setEditingOrganization({...editingOrganization, isActive: !editingOrganization.isActive})}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                                editingOrganization.isActive 
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
                            )}
                         >
                            <Power size={12} />
                            {editingOrganization.isActive ? 'Account Active' : 'Account Inactive'}
                         </button>
                    </div>

                    <div className="absolute -bottom-10 left-8 flex items-end gap-5">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-[2rem] bg-white dark:bg-zinc-800 border-4 border-background shadow-xl flex items-center justify-center overflow-hidden">
                                {editingOrganization.logo ? (
                                    <img src={editingOrganization.logo} className="w-full h-full object-cover" />
                                ) : (
                                    <Building size={32} className="text-zinc-300" />
                                )}
                            </div>
                            <button 
                                onClick={() => editFileInputRef.current?.click()}
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity rounded-[2rem]"
                            >
                                <Camera size={20} />
                            </button>
                        </div>
                        
                        <div className="mb-1 flex-1 min-w-[200px]">
                            <Input 
                                value={editingOrganization.name}
                                onChange={(e) => setEditingOrganization({...editingOrganization, name: e.target.value})}
                                className="text-xl font-bold tracking-tight leading-none h-auto px-4 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50 w-full"
                                placeholder="Organization Name"
                            />
                            <p className="text-xs text-muted-foreground mt-0.5 px-4">Manage platform modules</p>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="px-8 pt-16 pb-8 space-y-6">
                    {/* Basic Info */}


                    {/* Features Module (Smaller & 3 Columns) */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest">
                                <Settings2 size={12} />
                                Platform Modules
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2.5">
                            {(Object.keys(FEATURE_LABELS) as FeatureKey[]).map((key) => {
                                const Icon = FEATURE_ICONS[key];
                                const isActive = editingOrganization.features[key];
                                return (
                                    <div 
                                        key={key}
                                        onClick={() => setEditingOrganization({
                                            ...editingOrganization, 
                                            features: { ...editingOrganization.features, [key]: !isActive }
                                        })}
                                        className={cn(
                                            "flex flex-col gap-2 p-2.5 rounded-2xl border transition-all cursor-pointer select-none relative overflow-hidden",
                                            isActive 
                                                ? "bg-primary/5 border-primary/20 shadow-sm" 
                                                : "bg-background border-border hover:border-zinc-300 dark:hover:border-zinc-700"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                                            isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                        )}>
                                            <Icon size={16} />
                                        </div>
                                        
                                        <span className={cn(
                                            "text-[10px] font-bold leading-tight",
                                            isActive ? "text-foreground" : "text-muted-foreground"
                                        )}>
                                            {FEATURE_LABELS[key]}
                                        </span>

                                        {isActive && (
                                            <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-sm">
                                                <Check size={10} strokeWidth={4} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-between items-center border-t border-border/50">
                        <Button 
                            variant="ghost" 
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full h-9 px-4 text-xs"
                            onClick={() => {
                                setDeletingId(editingOrganization.id);
                                setEditingOrganization(null);
                            }}
                        >
                            <Trash2 size={14} className="mr-2" />
                            Delete Account
                        </Button>
                        
                        <div className="flex gap-2">
                            <Button variant="ghost" className="rounded-full px-5 h-9 text-xs" onClick={() => setEditingOrganization(null)}>Cancel</Button>
                            <Button 
                                className="rounded-full px-6 h-9 text-xs shadow-lg shadow-primary/20"
                                onClick={() => {
                                    actions.updateOrganization(editingOrganization.id, editingOrganization);
                                    setEditingOrganization(null);
                                }}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>

                <input 
                    type="file" 
                    ref={editFileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleIconUpload(e, true)}
                />
            </div>
        )}
      </Modal>

      {/* Confirmation Dialog for Toggles */}
      <ConfirmDialog 
        isOpen={!!confirmToggle}
        onClose={() => setConfirmToggle(null)}
        onConfirm={() => {
            if (confirmToggle) {
                actions.updateOrganization(confirmToggle.orgId, {
                    features: {
                        ...data.organizations.find(d => d.id === confirmToggle.orgId)?.features,
                        [confirmToggle.key]: confirmToggle.value
                    } as any
                });
            }
        }}
        variant="warning"
        title="Change Feature Status?"
        description={`Are you sure you want to ${confirmToggle?.value ? 'enable' : 'disable'} ${confirmToggle ? FEATURE_LABELS[confirmToggle.key] : ''} for this organization?`}
        confirmText="Yes, Change"
      />

      {/* Confirmation Dialog for Deletion */}
      <ConfirmDialog 
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
            if (deletingId) {
                actions.deleteOrganization(deletingId);
                setDeletingId(null);
            }
        }}
        variant="danger"
        title="Delete Organization?"
        description="This will permanently remove the organization and all associated status settings. This action cannot be undone."
        confirmText="Yes, Delete"
      />
    </div>
  );
};
