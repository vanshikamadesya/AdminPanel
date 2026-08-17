import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Search, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Drawer } from '../components/ui/Drawer';
import { Input } from '../components/ui/Input';
import { UserRole, UserStatus, type User } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUsers as setUsersAction, setLoading, setError } from '../store/slices/userSlice';
import * as userService from '../services/userService';

const emptyForm: {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
} = {
  firstName: '',
  lastName: '',
  email: '',
  role: UserRole.USER,
  status: UserStatus.ACTIVE,
};

export function UsersPage() {
  const dispatch = useAppDispatch();
  const { users: storeUsers, loading } = useAppSelector((state) => state.user);
  const [users, setUsers] = useState<User[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (storeUsers) {
      setUsers(storeUsers);
    }
  }, [storeUsers]);

  const fetchUsers = async (requestedPage = page, search = searchTerm, limit = pageSize) => {
    try {
      dispatch(setLoading(true));
      const response = await userService.getUsers(requestedPage, limit, search);
      if (response.data.success && response.data.data) {
        dispatch(setUsersAction(response.data.data.users));
        setPagination({
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0,
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error fetching users';
      dispatch(setError(message));
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
    fetchUsers(1, value);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    fetchUsers(nextPage);
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    setPage(1);
    fetchUsers(1, searchTerm, nextPageSize);
  };

  const columns: Column<User>[] = [
    {
      header: 'Name',
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
            {u.firstName[0]}{u.lastName[0]}
          </div>
          <div>
            <p className="font-medium">{u.firstName} {u.lastName}</p>
            <p className="text-muted-foreground text-sm">{u.isEmailVerified ? 'Verified' : 'Pending'}</p>
          </div>
        </div>
      ),
    },
    { header: 'Email', className: 'text-muted-foreground text-sm', render: (u) => u.email },
    {
      header: 'Role',
      render: (u) => (
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 capitalize dark:bg-slate-800 dark:text-slate-200">
          {u.role}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (u) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
            u.status === UserStatus.ACTIVE
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
              : u.status === UserStatus.SUSPENDED
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
          }`}
        >
          {u.status}
        </span>
      ),
    },
  ];

  const openCreateDrawer = () => {
    setEditingUser(null);
    setFormData(emptyForm);
    setDrawerOpen(true);
  };

  const openEditDrawer = (user: User) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingUser(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      dispatch(setLoading(true));
      let response;

      if (editingUser) {
        response = await userService.updateUser(editingUser.id, formData);
        toast.success('User updated successfully.');
      } else {
        const userData = {
          ...formData,
          password: 'Password123!', // Default password for new users
        };
        response = await userService.createUser(userData);
        toast.success('New user created successfully.');
      }

      if (response.data.success) {
        fetchUsers(1, searchTerm);
        closeDrawer();
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error saving user';
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      dispatch(setLoading(true));
      const response = await userService.deleteUser(deleteId);
      if (response.data.success) {
        toast.success('User removed successfully.');
        fetchUsers(1, searchTerm);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error deleting user';
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium tracking-[0.18em] text-blue-600 uppercase">Users</p>
          <h1 className="mt-2 text-3xl font-bold">User management</h1>
        </div>
        <Button onClick={openCreateDrawer} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add user
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle>All users</CardTitle>
          <div className="relative w-full max-w-sm">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              value={searchTerm}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder="Search users"
              className="pl-9"
            />
          </div>
        </CardHeader>

        <CardContent>
          <DataTable
            data={users}
            columns={columns}
            loading={loading}
            emptyMessage="No users found"
            keyField="id"
            onEdit={openEditDrawer}
            onDelete={(u) => handleDelete(u.id)}
            page={page}
            pageSize={pageSize}
            total={pagination.total}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardContent>
      </Card>

      <Drawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        title={editingUser ? 'Edit user' : 'Create new user'}
        description={
          editingUser
            ? 'Update account information and permissions.'
            : 'Add a new team member to the workspace.'
        }
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="First name"
              value={formData.firstName}
              onChange={(event) =>
                setFormData((current) => ({ ...current, firstName: event.target.value }))
              }
              placeholder="Jane"
            />
            <Input
              label="Last name"
              value={formData.lastName}
              onChange={(event) =>
                setFormData((current) => ({ ...current, lastName: event.target.value }))
              }
              placeholder="Doe"
            />
          </div>

          <Input
            label="Email address"
            type="email"
            value={formData.email}
            onChange={(event) =>
              setFormData((current) => ({ ...current, email: event.target.value }))
            }
            placeholder="jane@company.com"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Role</label>
              <select
                value={formData.role}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, role: event.target.value as UserRole }))
                }
                className="border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value={UserRole.USER}>User</option>
                <option value={UserRole.MODERATOR}>Moderator</option>
                <option value={UserRole.ADMIN}>Admin</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Status</label>
              <select
                value={formData.status}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    status: event.target.value as UserStatus,
                  }))
                }
                className="border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value={UserStatus.ACTIVE}>Active</option>
                <option value={UserStatus.INACTIVE}>Inactive</option>
                <option value={UserStatus.SUSPENDED}>Suspended</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={closeDrawer}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2" disabled={loading}>
              <Plus className="h-4 w-4" />
              {editingUser ? 'Save changes' : 'Create user'}
            </Button>
          </div>
        </form>
      </Drawer>

      <ConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        isLoading={loading}
      />
    </div>
  );
}
