import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setRoles,
  setPermissions,
  setLoading,
  setError,
  setPagination,
} from '../store/slices/roleSlice';
import * as roleService from '../services/roleService';
import toast from 'react-hot-toast';
import { Plus, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

const RolesPage = () => {
  const dispatch = useAppDispatch();
  const { roles, permissions, loading } = useAppSelector((state) => state.role);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginationState, setPaginationState] = useState({ total: 0, totalPages: 0 });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async (requestedPage = page, search = searchTerm, limit = pageSize) => {
    try {
      dispatch(setLoading(true));
      const response = await roleService.getRoles(requestedPage, limit, search);
      if (response.data.success && response.data.data) {
        dispatch(setRoles(response.data.data));
        if (response.data.pagination) {
          dispatch(setPagination(response.data.pagination));
          setPaginationState({
            total: response.data.pagination.total || 0,
            totalPages: response.data.pagination.totalPages || 0,
          });
        }
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error fetching roles';
      dispatch(setError(message));
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await roleService.getPermissions(1, 100);
      if (response.data.success && response.data.data) {
        dispatch(setPermissions(response.data.data));
      }
    } catch (error: any) {
      console.error('Error fetching permissions:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1);
    fetchRoles(1, value);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    fetchRoles(nextPage);
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    setPage(1);
    fetchRoles(1, searchTerm, nextPageSize);
  };

  const columns: Column<any>[] = [
    { header: 'Name', className: 'font-medium', render: (r) => r.name },
    { header: 'Description', className: 'text-muted-foreground text-sm', render: (r) => r.description || '-' },
    { header: 'Permissions', className: 'text-muted-foreground text-sm', render: (r) => `${Array.isArray(r.permissions) ? r.permissions.length : 0} permissions` },
  ];

  const handleOpenModal = (role?: any) => {
    if (role) {
      setEditingId(role._id);
      setFormData({
        name: role.name,
        description: role.description || '',
        permissions: role.permissions.map((p: any) => p._id || p),
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', permissions: [] });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Role name is required');
      return;
    }

    try {
      dispatch(setLoading(true));
      let response;

      if (editingId) {
        response = await roleService.updateRole(editingId, formData);
        toast.success('Role updated successfully');
      } else {
        response = await roleService.createRole(formData);
        toast.success('Role created successfully');
      }

      if (response.data.success) {
        fetchRoles(1, searchTerm);
        setShowModal(false);
        setFormData({ name: '', description: '', permissions: [] });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error saving role';
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
      const response = await roleService.deleteRole(deleteId);
      if (response.data.success) {
        toast.success('Role deleted successfully');
        fetchRoles(1, searchTerm);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error deleting role';
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Roles</h1>
          <p className="mt-1 text-muted-foreground">Manage user roles and permissions</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={20} />
          New Role
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute top-3 left-3 text-muted-foreground" size={20} />
        <Input
          type="text"
          placeholder="Search roles..."
          className="pl-10"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Roles Table */}
      <div className="overflow-hidden rounded-lg bg-card shadow">
        <DataTable
          data={roles}
          columns={columns}
          loading={loading}
          emptyMessage="No roles found"
          keyField="_id"
          onEdit={(r) => handleOpenModal(r)}
          onDelete={(r) => handleDelete(r._id)}
          canEdit={(r) => !r.isSystem}
          canDelete={(r) => !r.isSystem}
          page={page}
          pageSize={pageSize}
          total={paginationState.total}
          totalPages={paginationState.totalPages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Edit Role' : 'Create New Role'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Role Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter role name"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter role description"
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:ring-2 focus:ring-ring"
              rows={3}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Permissions
            </label>
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {permissions.map((permission) => (
                <label key={permission._id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          permissions: [...formData.permissions, permission._id],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          permissions: formData.permissions.filter((p) => p !== permission._id),
                        });
                      }
                    }}
                    className="rounded"
                  />
                  <span className="ml-2 text-sm text-foreground">
                    {permission.name} ({permission.action})
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {editingId ? 'Update Role' : 'Create Role'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Role"
        description="Are you sure you want to delete this role? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        isLoading={loading}
      />
    </div>
  );
};

export default RolesPage;
