import { useState, useRef, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Plus, Trash2, Pencil, Users, Upload, Camera } from 'lucide-react';
import { User } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { cn } from '@/lib/utils';
import { PageToolbar } from '@/components/layout/PageToolbar';
import { FilterPopover } from '@/components/ui/FilterPopover';

export const UsersPage = () => {
    const { data, actions } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<User, 'id'>>({
        name: '',
        email: '',
        avatar: '',
        role: 'frontend',
        status: 'online'
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [confirmConfig, setConfirmConfig] = useState<{
        isOpen: boolean;
        type: 'delete-single' | 'delete-bulk' | null;
        id: string | null;
        title: string;
        description: string;
    }>({
        isOpen: false,
        type: null,
        id: null,
        title: '',
        description: ''
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredUsers = useMemo(() => {
        return data.users.filter(u => {
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesName = u.name.toLowerCase().includes(query);
                const matchesEmail = u.email.toLowerCase().includes(query);
                if (!matchesName && !matchesEmail) return false;
            }
            if (filterRole !== 'all' && u.role !== filterRole) return false;
            if (filterStatus !== 'all' && u.status !== filterStatus) return false;
            return true;
        });
    }, [data.users, filterRole, filterStatus, searchQuery]);

    // Handlers
    const handleEdit = (user: User) => {
        setFormData({
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role || 'frontend',
            status: user.status || 'online',
            isBlocked: user.isBlocked,
            currentTaskId: user.currentTaskId
        });
        setEditingId(user.id);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: '', email: '', avatar: '', role: 'frontend', status: 'online' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            actions.updateUser(editingId, formData);
        } else {
            actions.addUser(formData);
        }
        handleClose();
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, avatar: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAvatar = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFormData(prev => ({ ...prev, avatar: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const toggleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map(u => u.id));
        }
    };

    const toggleSelectUser = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter(userId => userId !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    const openConfirmDelete = (id?: string) => {
        if (id) {
             setConfirmConfig({
                isOpen: true,
                type: 'delete-single',
                id,
                title: 'Delete User',
                description: 'Are you sure you want to delete this user? Access to the platform will be revoked immediately.'
            });
        } else {
             setConfirmConfig({
                isOpen: true,
                type: 'delete-bulk',
                id: null,
                title: 'Delete Users',
                description: `Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`
            });
        }
    };

    const handleConfirmAction = () => {
        if (confirmConfig.type === 'delete-single' && confirmConfig.id) {
            actions.deleteUser(confirmConfig.id);
        } else if (confirmConfig.type === 'delete-bulk') {
            selectedUsers.forEach(id => actions.deleteUser(id));
            setSelectedUsers([]);
        }
    };

    return (
    <div className="flex flex-col">
        <div className="pt-4 md:pt-8 pb-4">
             <PageToolbar
                title="Users"
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search users..."
                count={filteredUsers.length}
                countLabel="Users"
                filters={
                  <FilterPopover 
                    title="Filter Users" 
                    activeCount={
                        (filterRole !== 'all' ? 1 : 0) + 
                        (filterStatus !== 'all' ? 1 : 0)
                    }
                    onReset={() => {
                        setFilterRole('all');
                        setFilterStatus('all');
                    }}
                  >
                     <div className="space-y-4">
                         <div className="space-y-1.5">
                            <Select value={filterRole} onValueChange={setFilterRole}>
                                <SelectTrigger className="h-9 w-full">
                                    <SelectValue>
                                        {filterRole === 'all' ? "All Roles" : null}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="frontend">Frontend</SelectItem>
                                    <SelectItem value="backend">Backend</SelectItem>
                                    <SelectItem value="fullstack">Full Stack</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                </SelectContent>
                            </Select>
                         </div>
                         <div className="space-y-1.5">
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="h-9 w-full">
                                    <SelectValue>
                                        {filterStatus === 'all' ? "All Statuses" : null}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="online">Online</SelectItem>
                                    <SelectItem value="break">Break</SelectItem>
                                    <SelectItem value="off">Off</SelectItem>
                                </SelectContent>
                            </Select>
                         </div>
                     </div>
                  </FilterPopover>
                }
                actions={
                    <>
                        {selectedUsers.length > 0 && (
                            <Button size="sm" variant="outline" onClick={() => openConfirmDelete()} className="h-8 text-xs text-destructive border-destructive/20 hover:bg-destructive/10">
                                <Trash2 className="w-3.5 h-3.5 mr-2" />
                                Delete ({selectedUsers.length})
                            </Button>
                        )}
                        <Button size="sm" onClick={() => setIsModalOpen(true)} className="h-8 text-xs rounded-lg">
                            <Plus className="w-3.5 h-3.5 mr-2" />
                            Add User
                        </Button>
                    </>
                }
            />
        </div>

        <div className="mt-4 bg-card rounded-2xl border shadow-sm overflow-hidden bg-white dark:bg-zinc-900">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b bg-zinc-50 dark:bg-zinc-800/50">
                            <th className="p-4 w-12 text-center">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-zinc-300 dark:border-zinc-700 accent-primary cursor-pointer"
                                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th className="p-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Member</th>
                            <th className="p-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Email</th>
                            <th className="p-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider text-center">Role</th>
                            <th className="p-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider text-center">Status</th>
                            <th className="p-4 w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-muted-foreground italic">
                                    No users found matching your filters.
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr 
                                    key={user.id} 
                                    onClick={() => handleEdit(user)}
                                    className={cn(
                                        "border-b last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group cursor-pointer",
                                        selectedUsers.includes(user.id) && "bg-primary/5"
                                    )}
                                >
                                    <td className="p-4 text-center">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-zinc-300 dark:border-zinc-700 accent-primary cursor-pointer"
                                            checked={selectedUsers.includes(user.id)}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => toggleSelectUser(user.id, e as any)}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 overflow-hidden ring-1 ring-border shadow-sm">
                                                {user.avatar ? (
                                                    <img src={user.avatar} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xs font-bold">{user.name.charAt(0).toUpperCase()}</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold">{user.name}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-tighter font-medium">Click to edit details</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
                                    <td className="p-4 text-center">
                                         <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0 border-zinc-200 dark:border-zinc-700">
                                            {user.role === 'fullstack' ? 'Full Stack' : user.role}
                                         </Badge>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter",
                                            user.status === 'online'
                                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                                                : user.status === 'break'
                                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-500"
                                        )}>
                                            {user.status}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                onClick={(e) => { e.stopPropagation(); handleEdit(user); }}
                                            >
                                                <Pencil size={14} />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                onClick={(e) => { e.stopPropagation(); openConfirmDelete(user.id); }}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleClose}
                title={editingId ? "Edit User" : (
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                            <Users size={20} />
                        </div>
                        Add New User
                    </div>
                )}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="flex flex-col items-center">
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-24 h-24 rounded-full border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all overflow-hidden bg-zinc-50 dark:bg-zinc-800 relative group"
                        >
                            {formData.avatar ? (
                                <div className="relative w-full h-full group">
                                  <img src={formData.avatar} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                                      <div className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors" title="Change Photo">
                                          <Camera size={20} />
                                      </div>
                                      <div 
                                        className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full text-white transition-colors" 
                                        title="Delete Photo"
                                        onClick={handleRemoveAvatar}
                                      >
                                          <Trash2 size={20} />
                                      </div>
                                  </div>
                                </div>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                                    <span className="text-[9px] font-medium text-muted-foreground uppercase">Photo</span>
                                </>
                            )}
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleAvatarUpload}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-primary mb-1 block">Full Name</label>
                            <Input
                                required
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-primary mb-1 block">Email Address</label>
                            <Input
                                required
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase text-primary mb-1 block">Role</label>
                                <Select 
                                    value={formData.role} 
                                    onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="frontend">Frontend</SelectItem>
                                        <SelectItem value="backend">Backend</SelectItem>
                                        <SelectItem value="fullstack">Full Stack</SelectItem>
                                        <SelectItem value="manager">Manager</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase text-primary mb-1 block">Status</label>
                                <Select 
                                    value={formData.status} 
                                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="online">Online</SelectItem>
                                        <SelectItem value="break">Break</SelectItem>
                                        <SelectItem value="off">Off</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 gap-2">
                        <Button type="button" variant="ghost" onClick={handleClose}>Cancel</Button>
                        <Button type="submit">{editingId ? "Save Changes" : "Add User"}</Button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog 
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
                onConfirm={handleConfirmAction}
                title={confirmConfig.title}
                description={confirmConfig.description}
                variant="danger"
                confirmText="Delete"
            />
        </div>
    );
};
