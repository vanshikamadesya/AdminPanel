import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Package2, Plus, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Drawer } from '../components/ui/Drawer';
import { Input } from '../components/ui/Input';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setProducts as setProductsAction, setLoading, setError } from '../store/slices/productSlice';
import * as productService from '../services/productService';
import * as attributeService from '../services/attributeService';

type Product = productService.Product;

const emptyForm = {
  name: '',
  description: '',
  category: '',
  price: '',
  stock: 0,
  status: 'active' as NonNullable<Product['status']>,
  sku: '',
  attributes: [] as string[],
};

export function ProductsPage() {
  const dispatch = useAppDispatch();
  const { products: storeProducts, loading } = useAppSelector((state) => state.product);
  const [products, setProducts] = useState<Product[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [formData, setFormData] = useState(emptyForm);
  const [attributes, setAttributes] = useState<attributeService.Attribute[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    try {
      const response = await attributeService.getAttributes(1, 100);
      if (response.data.success && response.data.data) {
        setAttributes(response.data.data.filter((attribute) => attribute.isActive));
      }
    } catch {
      toast.error('Unable to load product attributes.');
    }
  };

  useEffect(() => {
    if (storeProducts) {
      setProducts(storeProducts);
    }
  }, [storeProducts]);

  const fetchProducts = async (requestedPage = page, search = searchTerm, limit = pageSize) => {
    try {
      dispatch(setLoading(true));
      const response = await productService.getProducts(requestedPage, limit, search);
      if (response.data.success && response.data.data) {
        dispatch(setProductsAction(response.data.data));
        setPagination({
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0,
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error fetching products';
      dispatch(setError(message));
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
    fetchProducts(1, value);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    fetchProducts(nextPage);
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    setPage(1);
    fetchProducts(1, searchTerm, nextPageSize);
  };

  const openCreateDrawer = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setDrawerOpen(true);
  };

  const openEditDrawer = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      category: product.category,
      price: String(product.price),
      stock: product.stock,
      status: product.status,
      sku: product.sku || '',
      attributes: (product.attributes || []).map((attribute) =>
        typeof attribute === 'string' ? attribute : attribute._id
      ),
    });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingProduct(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name || !formData.category) {
      toast.error('Please enter a product name and category.');
      return;
    }

    try {
      dispatch(setLoading(true));
      let response;

      const productData = {
        name: formData.name,
        description: formData.description,
        slug: formData.sku || formData.name.toLowerCase().replace(/\s+/g, '-'),
        category: formData.category,
        price: Number(formData.price),
        stock: formData.stock,
        status: formData.status,
        sku: formData.sku || `SKU-${Date.now()}`,
        attributes: formData.attributes,
      };

      if (editingProduct) {
        response = await productService.updateProduct(editingProduct._id, productData);
        toast.success('Product updated successfully.');
      } else {
        response = await productService.createProduct(productData);
        toast.success('New product added successfully.');
      }

      if (response.data.success) {
        fetchProducts(1, searchTerm);
        closeDrawer();
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error saving product';
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      dispatch(setLoading(true));
      const response = await productService.deleteProduct(id);
      if (response.data.success) {
        toast.success('Product deleted successfully.');
        fetchProducts(1, searchTerm);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error deleting product';
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const columns: Column<Product>[] = [
    { header: 'Name', className: 'font-medium', render: (p) => p.name },
    { header: 'Category', className: 'text-muted-foreground text-sm', render: (p) => p.category },
    { header: 'Price', render: (p) => `$${p.price}` },
    { header: 'Stock', render: (p) => p.stock },
    { header: 'Attributes', className: 'text-sm text-muted-foreground', render: (p) => p.attributes?.length || 0 },
    { header: 'Variants', className: 'text-sm text-muted-foreground', render: (p) => p.variants?.length || 0 },
    {
      header: 'Status',
      render: (p) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
            p.status === 'active'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
              : p.status === 'inactive'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {p.status.replace('_', ' ')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium tracking-[0.18em] text-blue-600 uppercase">Catalog</p>
          <h1 className="mt-2 text-3xl font-bold">Products</h1>
        </div>
        <Button onClick={openCreateDrawer} className="gap-2">
          <Package2 className="h-4 w-4" />
          Add product
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle>Inventory overview</CardTitle>
          <div className="relative w-full max-w-sm">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              value={searchTerm}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder="Search products"
              className="pl-9"
            />
          </div>
        </CardHeader>

        <CardContent>
          <DataTable
            data={products}
            columns={columns}
            loading={loading}
            emptyMessage="No products found"
            keyField="_id"
            onEdit={openEditDrawer}
            onDelete={(p) => handleDelete(p._id)}
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
        title={editingProduct ? 'Edit product' : 'Create product'}
        description={
          editingProduct
            ? 'Update product details and inventory status.'
            : 'Add a new product to the storefront.'
        }
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Product name"
            value={formData.name}
            onChange={(event) =>
              setFormData((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="Classic T-Shirt"
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(event) =>
                setFormData((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Product description"
              className="flex w-full rounded-lg border border-input bg-card text-foreground px-3.5 py-2.5 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary hover:border-primary/50 transition-all duration-200"
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Category"
              value={formData.category}
              onChange={(event) =>
                setFormData((current) => ({ ...current, category: event.target.value }))
              }
              placeholder="Clothing"
            />
            <Input
              label="SKU"
              value={formData.sku}
              onChange={(event) =>
                setFormData((current) => ({ ...current, sku: event.target.value }))
              }
              placeholder="TS-001"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Price"
              type="number"
              className="price-input"
              min="0"
              step="0.01"
              value={formData.price}
              required
              onChange={(event) =>
                setFormData((current) => ({ ...current, price: event.target.value }))
              }
            />
            <Input
              label="Stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(event) =>
                setFormData((current) => ({ ...current, stock: Number(event.target.value) }))
              }
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">Product attributes</label>
              <span className="text-xs text-muted-foreground">Used to define this product's variants</span>
            </div>
            {attributes.length === 0 ? (
              <p className="rounded-xl border border-dashed p-3 text-sm text-muted-foreground">
                Create attributes such as Color or Size before assigning them to a product.
              </p>
            ) : (
              <div className="grid gap-2 rounded-xl border border-border p-3 sm:grid-cols-2">
                {attributes.map((attribute) => {
                  const selected = formData.attributes.includes(attribute._id);
                  return (
                    <label key={attribute._id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() =>
                          setFormData((current) => ({
                            ...current,
                            attributes: selected
                              ? current.attributes.filter((id) => id !== attribute._id)
                              : [...current.attributes, attribute._id],
                          }))
                        }
                      />
                      <span className="text-sm font-medium">{attribute.name}</span>
                      <span className="text-xs text-muted-foreground">({attribute.values.length})</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Status</label>
            <select
              value={formData.status}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  status: event.target.value as NonNullable<Product['status']>,
                }))
              }
              className="border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={closeDrawer}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2" disabled={loading}>
              <Plus className="h-4 w-4" />
              {editingProduct ? 'Save changes' : 'Create product'}
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
