import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setVariants, setLoading, setError } from '../store/slices/variantSlice';
import * as variantService from '../services/variantService';
import * as productService from '../services/productService';
import toast from 'react-hot-toast';
import { Plus, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

const VariantsPage = () => {
  const dispatch = useAppDispatch();
  const { variants, loading } = useAppSelector((state) => state.variant);
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginationState, setPaginationState] = useState({ total: 0, totalPages: 0 });
  const [formData, setFormData] = useState({
    product: '',
    name: '',
    sku: '',
    price: '',
    costPrice: '',
    discountPrice: '',
    stock: 0,
    attributeValues: [] as Array<{ attribute: string; value: string }>,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchVariants();
    fetchProducts();
  }, []);

  const fetchVariants = async (requestedPage = page, search = searchTerm, limit = pageSize) => {
    try {
      dispatch(setLoading(true));
      const response = await variantService.getVariants(requestedPage, limit, search);
      if (response.data.success && response.data.data) {
        dispatch(setVariants(response.data.data));
        setPaginationState({
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0,
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error fetching variants';
      dispatch(setError(message));
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productService.getProducts(1, 100);
      if (response.data.success && response.data.data) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1);
    fetchVariants(1, value);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    fetchVariants(nextPage);
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    setPage(1);
    fetchVariants(1, searchTerm, nextPageSize);
  };

  const columns: Column<any>[] = [
    { header: 'Product', className: 'text-muted-foreground text-sm', render: (v) => typeof v.product === 'string' ? v.product : v.product?.name },
    { header: 'Name', className: 'font-medium', render: (v) => v.name },
    { header: 'SKU', className: 'text-muted-foreground text-sm', render: (v) => v.sku },
    { header: 'Price', className: 'font-medium', render: (v) => `$${v.price.toFixed(2)}` },
    { header: 'Stock', className: 'text-muted-foreground text-sm', render: (v) => v.stock },
    {
      header: 'Status',
      render: (v) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            v.status === 'active'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          {v.status}
        </span>
      ),
    },
  ];

  const handleOpenModal = (variant?: any) => {
    if (variant) {
      setEditingId(variant._id);
      setFormData({
        product: variant.product._id || variant.product,
        name: variant.name,
        sku: variant.sku,
        price: String(variant.price),
        costPrice: variant.costPrice == null ? '' : String(variant.costPrice),
        discountPrice: variant.discountPrice == null ? '' : String(variant.discountPrice),
        stock: variant.stock,
        attributeValues: variant.attributeValues || [],
      });
    } else {
      setEditingId(null);
      setFormData({
        product: '',
        name: '',
        sku: '',
        price: '',
        costPrice: '',
        discountPrice: '',
        stock: 0,
        attributeValues: [],
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.product || !formData.name.trim() || !formData.sku.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      dispatch(setLoading(true));
      let response;

      if (editingId) {
        response = await variantService.updateVariant(editingId, {
          ...formData,
          price: Number(formData.price),
          costPrice: formData.costPrice === '' ? undefined : Number(formData.costPrice),
          discountPrice: formData.discountPrice === '' ? undefined : Number(formData.discountPrice),
        });
        toast.success('Variant updated successfully');
      } else {
        response = await variantService.createVariant({
          ...formData,
          price: Number(formData.price),
          costPrice: formData.costPrice === '' ? undefined : Number(formData.costPrice),
          discountPrice: formData.discountPrice === '' ? undefined : Number(formData.discountPrice),
        });
        toast.success('Variant created successfully');
      }

      if (response.data.success) {
        fetchVariants(1, searchTerm);
        setShowModal(false);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error saving variant';
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this variant?')) return;

    try {
      dispatch(setLoading(true));
      const response = await variantService.deleteVariant(id);
      if (response.data.success) {
        toast.success('Variant deleted successfully');
        fetchVariants(1, searchTerm);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error deleting variant';
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Variants</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Manage product variants</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={20} />
          New Variant
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute top-3 left-3 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="Search variants by name or SKU..."
          className="pl-10"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Variants Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <DataTable
          data={variants}
          columns={columns}
          loading={loading}
          emptyMessage="No variants found"
          keyField="_id"
          onEdit={handleOpenModal}
          onDelete={(v) => handleDelete(v._id)}
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
        title={editingId ? 'Edit Variant' : 'Create New Variant'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Product *
            </label>
            <select
              value={formData.product}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select a product</option>
              {products.map((prod) => (
                <option key={prod._id} value={prod._id}>
                  {prod.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Variant Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Red - Size M"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                SKU *
              </label>
              <Input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                placeholder="Enter SKU"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Price *
              </label>
              <Input
                type="number"
                className="price-input"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Stock
              </label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cost Price
              </label>
              <Input
                type="number"
                className="price-input"
                step="0.01"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Discount Price
              </label>
              <Input
                type="number"
                className="price-input"
                step="0.01"
                value={formData.discountPrice}
                onChange={(e) =>
                  setFormData({ ...formData, discountPrice: e.target.value })
                }
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {editingId ? 'Update Variant' : 'Create Variant'}
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

export default VariantsPage;
