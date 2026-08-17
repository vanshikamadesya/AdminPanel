import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setAttributes, setLoading, setError } from '../store/slices/attributeSlice';
import * as attributeService from '../services/attributeService';
import toast from 'react-hot-toast';
import { Plus, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

const AttributesPage = () => {
  const dispatch = useAppDispatch();
  const { attributes, loading } = useAppSelector((state) => state.attribute);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginationState, setPaginationState] = useState({ total: 0, totalPages: 0 });
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    type: 'text' as const,
    values: [] as Array<{ value: string; label: string }>,
    isRequired: false,
    isFilterable: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newValue, setNewValue] = useState({ value: '', label: '' });

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async (requestedPage = page, search = searchTerm, limit = pageSize) => {
    try {
      dispatch(setLoading(true));
      const response = await attributeService.getAttributes(requestedPage, limit, search);
      if (response.data.success && response.data.data) {
        dispatch(setAttributes(response.data.data));
        setPaginationState({
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0,
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error fetching attributes';
      dispatch(setError(message));
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1);
    fetchAttributes(1, value);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    fetchAttributes(nextPage);
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    setPage(1);
    fetchAttributes(1, searchTerm, nextPageSize);
  };

  const columns: Column<any>[] = [
    { header: 'Name', className: 'font-medium', render: (a) => a.name },
    { header: 'Code', className: 'text-muted-foreground text-sm', render: (a) => a.code },
    {
      header: 'Type',
      render: (a) => (
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {a.type}
        </span>
      ),
    },
    { header: 'Values', className: 'text-muted-foreground text-sm', render: (a) => `${a.values.length} values` },
  ];

  const handleOpenModal = (attribute?: any) => {
    if (attribute) {
      setEditingId(attribute._id);
      setFormData({
        name: attribute.name,
        code: attribute.code,
        description: attribute.description || '',
        type: attribute.type,
        values: attribute.values || [],
        isRequired: attribute.isRequired,
        isFilterable: attribute.isFilterable,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        code: '',
        description: '',
        type: 'text',
        values: [],
        isRequired: false,
        isFilterable: true,
      });
    }
    setNewValue({ value: '', label: '' });
    setShowModal(true);
  };

  const addAttributeValue = () => {
    if (newValue.value && newValue.label) {
      setFormData({
        ...formData,
        values: [...formData.values, newValue],
      });
      setNewValue({ value: '', label: '' });
    }
  };

  const removeAttributeValue = (index: number) => {
    setFormData({
      ...formData,
      values: formData.values.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.code.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      dispatch(setLoading(true));
      let response;

      if (editingId) {
        response = await attributeService.updateAttribute(editingId, formData);
        toast.success('Attribute updated successfully');
      } else {
        response = await attributeService.createAttribute(formData);
        toast.success('Attribute created successfully');
      }

      if (response.data.success) {
        fetchAttributes(1, searchTerm);
        setShowModal(false);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error saving attribute';
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this attribute?')) return;

    try {
      dispatch(setLoading(true));
      const response = await attributeService.deleteAttribute(id);
      if (response.data.success) {
        toast.success('Attribute deleted successfully');
        fetchAttributes(1, searchTerm);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error deleting attribute';
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Attributes</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Manage product attributes</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={20} />
          New Attribute
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute top-3 left-3 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="Search attributes..."
          className="pl-10"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Attributes Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <DataTable
          data={attributes}
          columns={columns}
          loading={loading}
          emptyMessage="No attributes found"
          keyField="_id"
          onEdit={handleOpenModal}
          onDelete={(a) => handleDelete(a._id)}
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
        title={editingId ? 'Edit Attribute' : 'Create New Attribute'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Attribute Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter attribute name"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Code *
              </label>
              <Input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase() })}
                placeholder="e.g., color, size"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="text">Text</option>
              <option value="dropdown">Dropdown</option>
              <option value="checkbox">Checkbox</option>
              <option value="color">Color</option>
              <option value="size">Size</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter attribute description"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              rows={2}
            />
          </div>

          {['dropdown', 'checkbox', 'color', 'size'].includes(formData.type) && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Values
              </label>
              <div className="space-y-2">
                {formData.values.map((val, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {val.value} - {val.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttributeValue(idx)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Value"
                    value={newValue.value}
                    onChange={(e) => setNewValue({ ...newValue, value: e.target.value })}
                  />
                  <Input
                    type="text"
                    placeholder="Label"
                    value={newValue.label}
                    onChange={(e) => setNewValue({ ...newValue, label: e.target.value })}
                  />
                  <Button type="button" onClick={addAttributeValue} className="px-4">
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isRequired}
                onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
                className="rounded"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Required</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isFilterable}
                onChange={(e) => setFormData({ ...formData, isFilterable: e.target.checked })}
                className="rounded"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Filterable</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {editingId ? 'Update Attribute' : 'Create Attribute'}
            </Button>
            <Button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AttributesPage;
