import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Permission from '../models/Permission';
import Role from '../models/Role';
import User from '../models/User';
import Attribute from '../models/Attribute';
import Product from '../models/Product';
import Variant from '../models/Variant';

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🚀 Starting database seeding...\n');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-saas';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Clear all collections
    console.log('🗑️  Clearing existing data...');
    await Permission.deleteMany({});
    await Role.deleteMany({});
    await User.deleteMany({});
    await Attribute.deleteMany({});
    await Product.deleteMany({});
    await Variant.deleteMany({});
    console.log('✅ Data cleared\n');

    // ==================== SEED PERMISSIONS (10) ====================
    console.log('🌱 Seeding 10 Permissions...');
    const permissions = await Permission.insertMany([
      { name: 'View Users', code: 'USERS_READ', description: 'View all users', category: 'users', resource: 'users', action: 'read', isActive: true },
      { name: 'Create User', code: 'USERS_CREATE', description: 'Create new users', category: 'users', resource: 'users', action: 'create', isActive: true },
      { name: 'Update User', code: 'USERS_UPDATE', description: 'Update users', category: 'users', resource: 'users', action: 'update', isActive: true },
      { name: 'Delete User', code: 'USERS_DELETE', description: 'Delete users', category: 'users', resource: 'users', action: 'delete', isActive: true },
      { name: 'View Roles', code: 'ROLES_READ', description: 'View all roles', category: 'roles', resource: 'roles', action: 'read', isActive: true },
      { name: 'Manage Roles', code: 'ROLES_UPDATE', description: 'Manage roles', category: 'roles', resource: 'roles', action: 'update', isActive: true },
      { name: 'View Products', code: 'PRODUCTS_READ', description: 'View products', category: 'products', resource: 'products', action: 'read', isActive: true },
      { name: 'Manage Products', code: 'PRODUCTS_UPDATE', description: 'Manage products', category: 'products', resource: 'products', action: 'update', isActive: true },
      { name: 'View Reports', code: 'REPORTS_READ', description: 'View reports', category: 'reports', resource: 'reports', action: 'read', isActive: true },
      { name: 'Export Analytics', code: 'ANALYTICS_EXPORT', description: 'Export analytics data', category: 'analytics', resource: 'analytics', action: 'export', isActive: true },
    ]);
    console.log(`✅ Seeded ${permissions.length} permissions\n`);

    // ==================== SEED ROLES (10) ====================
    console.log('🌱 Seeding 10 Roles...');
    const roles = await Role.insertMany([
      { name: 'Super Admin', description: 'Full system access', permissions: permissions.map(p => p._id), isSystem: true, isActive: true },
      { name: 'Admin', description: 'Administrative access', permissions: permissions.slice(0, 8).map(p => p._id), isSystem: false, isActive: true },
      { name: 'Manager', description: 'Management access', permissions: permissions.slice(0, 6).map(p => p._id), isSystem: false, isActive: true },
      { name: 'Moderator', description: 'Moderation access', permissions: permissions.slice(6, 9).map(p => p._id), isSystem: false, isActive: true },
      { name: 'Editor', description: 'Content editing access', permissions: [permissions[6]._id, permissions[7]._id], isSystem: false, isActive: true },
      { name: 'Viewer', description: 'View-only access', permissions: [permissions[0]._id, permissions[4]._id, permissions[6]._id], isSystem: false, isActive: true },
      { name: 'Support', description: 'Customer support access', permissions: [permissions[0]._id, permissions[8]._id], isSystem: false, isActive: true },
      { name: 'Analyst', description: 'Analytics access', permissions: [permissions[8]._id], isSystem: false, isActive: true },
      { name: 'Developer', description: 'Development access', permissions: permissions.slice(0, 4).map(p => p._id), isSystem: false, isActive: true },
      { name: 'Guest', description: 'Limited guest access', permissions: [], isSystem: false, isActive: true },
    ]);
    console.log(`✅ Seeded ${roles.length} roles\n`);

    // ==================== SEED USERS (10) ====================
    console.log('🌱 Seeding 10 Users...');
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    const users = await User.insertMany([
      { firstName: 'Admin', lastName: 'User', email: 'admin@example.com', password: hashedPassword, role: 'admin', status: 'active', isEmailVerified: true },
      { firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: hashedPassword, role: 'admin', status: 'active', isEmailVerified: true },
      { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', password: hashedPassword, role: 'moderator', status: 'active', isEmailVerified: true },
      { firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', password: hashedPassword, role: 'moderator', status: 'active', isEmailVerified: true },
      { firstName: 'Sarah', lastName: 'Williams', email: 'sarah@example.com', password: hashedPassword, role: 'user', status: 'active', isEmailVerified: false },
      { firstName: 'David', lastName: 'Brown', email: 'david@example.com', password: hashedPassword, role: 'user', status: 'active', isEmailVerified: true },
      { firstName: 'Emily', lastName: 'Davis', email: 'emily@example.com', password: hashedPassword, role: 'moderator', status: 'inactive', isEmailVerified: true },
      { firstName: 'Chris', lastName: 'Wilson', email: 'chris@example.com', password: hashedPassword, role: 'user', status: 'active', isEmailVerified: true },
      { firstName: 'Lisa', lastName: 'Moore', email: 'lisa@example.com', password: hashedPassword, role: 'admin', status: 'suspended', isEmailVerified: true },
      { firstName: 'Tom', lastName: 'Taylor', email: 'tom@example.com', password: hashedPassword, role: 'user', status: 'active', isEmailVerified: false },
    ]);
    console.log(`✅ Seeded ${users.length} users\n`);

    // ==================== SEED ATTRIBUTES (10) ====================
    console.log('🌱 Seeding 10 Attributes...');
    const attributes = await Attribute.insertMany([
      { 
        name: 'Color', 
        code: 'color', 
        description: 'Product color', 
        type: 'dropdown', 
        values: [
          { value: 'red', label: 'Red' },
          { value: 'blue', label: 'Blue' },
          { value: 'green', label: 'Green' },
          { value: 'black', label: 'Black' },
          { value: 'white', label: 'White' }
        ], 
        isRequired: true, 
        isActive: true,
        displayOrder: 1
      },
      { 
        name: 'Size', 
        code: 'size', 
        description: 'Product size', 
        type: 'dropdown', 
        values: [
          { value: 'xs', label: 'XS' },
          { value: 's', label: 'S' },
          { value: 'm', label: 'M' },
          { value: 'l', label: 'L' },
          { value: 'xl', label: 'XL' }
        ], 
        isRequired: true, 
        isActive: true,
        displayOrder: 2
      },
      { 
        name: 'Material', 
        code: 'material', 
        description: 'Product material', 
        type: 'dropdown', 
        values: [
          { value: 'cotton', label: 'Cotton' },
          { value: 'polyester', label: 'Polyester' },
          { value: 'leather', label: 'Leather' },
          { value: 'denim', label: 'Denim' }
        ], 
        isRequired: false, 
        isActive: true,
        displayOrder: 3
      },
      { 
        name: 'Brand', 
        code: 'brand', 
        description: 'Product brand', 
        type: 'text', 
        values: [], 
        isRequired: false, 
        isActive: true,
        displayOrder: 4
      },
      { 
        name: 'Weight', 
        code: 'weight', 
        description: 'Product weight (kg)', 
        type: 'text', 
        values: [], 
        isRequired: false, 
        isActive: true,
        displayOrder: 5
      },
      { 
        name: 'Storage', 
        code: 'storage', 
        description: 'Storage capacity', 
        type: 'dropdown', 
        values: [
          { value: '16gb', label: '16GB' },
          { value: '32gb', label: '32GB' },
          { value: '64gb', label: '64GB' },
          { value: '128gb', label: '128GB' },
          { value: '256gb', label: '256GB' }
        ], 
        isRequired: false, 
        isActive: true,
        displayOrder: 6
      },
      { 
        name: 'RAM', 
        code: 'ram', 
        description: 'RAM capacity', 
        type: 'dropdown', 
        values: [
          { value: '4gb', label: '4GB' },
          { value: '6gb', label: '6GB' },
          { value: '8gb', label: '8GB' },
          { value: '12gb', label: '12GB' },
          { value: '16gb', label: '16GB' }
        ], 
        isRequired: false, 
        isActive: true,
        displayOrder: 7
      },
      { 
        name: 'Screen Size', 
        code: 'screen_size', 
        description: 'Screen size (inches)', 
        type: 'text', 
        values: [], 
        isRequired: false, 
        isActive: true,
        displayOrder: 8
      },
      { 
        name: 'Battery', 
        code: 'battery', 
        description: 'Battery capacity (mAh)', 
        type: 'text', 
        values: [], 
        isRequired: false, 
        isActive: true,
        displayOrder: 9
      },
      { 
        name: 'Warranty', 
        code: 'warranty', 
        description: 'Warranty period', 
        type: 'dropdown', 
        values: [
          { value: '6m', label: '6 months' },
          { value: '1y', label: '1 year' },
          { value: '2y', label: '2 years' },
          { value: '3y', label: '3 years' }
        ], 
        isRequired: false, 
        isActive: true,
        displayOrder: 10
      },
    ]);
    console.log(`✅ Seeded ${attributes.length} attributes\n`);

    // ==================== SEED PRODUCTS (10) ====================
    console.log('🌱 Seeding 10 Products...');
    const products = await Product.insertMany([
      { name: 'Classic T-Shirt', slug: 'classic-t-shirt', description: 'Comfortable cotton t-shirt', price: 29.99, comparePrice: 39.99, costPrice: 15.00, sku: 'TS-001', stock: 100, category: 'Clothing', tags: ['casual', 't-shirt'], status: 'active', isActive: true },
      { name: 'Denim Jeans', slug: 'denim-jeans', description: 'Classic blue denim jeans', price: 79.99, comparePrice: 99.99, costPrice: 40.00, sku: 'DJ-001', stock: 75, category: 'Clothing', tags: ['denim', 'jeans'], status: 'active', isActive: true },
      { name: 'Leather Jacket', slug: 'leather-jacket', description: 'Premium leather jacket', price: 299.99, comparePrice: 399.99, costPrice: 150.00, sku: 'LJ-001', stock: 30, category: 'Clothing', tags: ['leather', 'jacket'], status: 'active', isActive: true },
      { name: 'Running Shoes', slug: 'running-shoes', description: 'Lightweight running shoes', price: 89.99, comparePrice: 120.00, costPrice: 45.00, sku: 'RS-001', stock: 60, category: 'Footwear', tags: ['shoes', 'running'], status: 'active', isActive: true },
      { name: 'Smartphone Pro', slug: 'smartphone-pro', description: 'Latest flagship smartphone', price: 899.99, comparePrice: 999.99, costPrice: 500.00, sku: 'SP-001', stock: 40, category: 'Electronics', tags: ['phone', 'tech'], status: 'active', isActive: true },
      { name: 'Wireless Headphones', slug: 'wireless-headphones', description: 'Noise-cancelling headphones', price: 199.99, comparePrice: 249.99, costPrice: 100.00, sku: 'WH-001', stock: 50, category: 'Electronics', tags: ['audio', 'wireless'], status: 'active', isActive: true },
      { name: 'Smart Watch', slug: 'smart-watch', description: 'Fitness tracking smartwatch', price: 249.99, comparePrice: 299.99, costPrice: 120.00, sku: 'SW-001', stock: 45, category: 'Electronics', tags: ['watch', 'fitness'], status: 'active', isActive: true },
      { name: 'Laptop Backpack', slug: 'laptop-backpack', description: 'Durable laptop backpack', price: 59.99, comparePrice: 79.99, costPrice: 30.00, sku: 'BP-001', stock: 80, category: 'Accessories', tags: ['backpack', 'laptop'], status: 'active', isActive: true },
      { name: 'Coffee Maker', slug: 'coffee-maker', description: 'Programmable coffee maker', price: 79.99, comparePrice: 99.99, costPrice: 40.00, sku: 'CM-001', stock: 35, category: 'Home', tags: ['coffee', 'appliance'], status: 'active', isActive: true },
      { name: 'Desk Lamp', slug: 'desk-lamp', description: 'LED desk lamp', price: 39.99, comparePrice: 49.99, costPrice: 20.00, sku: 'DL-001', stock: 55, category: 'Home', tags: ['lamp', 'led'], status: 'active', isActive: true },
    ]);
    console.log(`✅ Seeded ${products.length} products\n`);

    // ==================== SEED VARIANTS (10) ====================
    console.log('🌱 Seeding 10 Variants...');
    const variants = await Variant.insertMany([
      { product: products[0]._id, name: 'T-Shirt Red S', sku: 'TS-001-RED-S', attributeValues: [{ attribute: attributes[0]._id, value: 'red' }, { attribute: attributes[1]._id, value: 's' }], price: 29.99, costPrice: 15.00, stock: 20, status: 'active', isActive: true },
      { product: products[0]._id, name: 'T-Shirt Blue M', sku: 'TS-001-BLUE-M', attributeValues: [{ attribute: attributes[0]._id, value: 'blue' }, { attribute: attributes[1]._id, value: 'm' }], price: 29.99, costPrice: 15.00, stock: 25, status: 'active', isActive: true },
      { product: products[1]._id, name: 'Jeans Blue 32', sku: 'DJ-001-BLUE-32', attributeValues: [{ attribute: attributes[0]._id, value: 'blue' }, { attribute: attributes[1]._id, value: 'l' }], price: 79.99, costPrice: 40.00, stock: 15, status: 'active', isActive: true },
      { product: products[1]._id, name: 'Jeans Black 30', sku: 'DJ-001-BLACK-30', attributeValues: [{ attribute: attributes[0]._id, value: 'black' }, { attribute: attributes[1]._id, value: 'm' }], price: 79.99, costPrice: 40.00, stock: 18, status: 'active', isActive: true },
      { product: products[4]._id, name: 'Phone Black 128GB', sku: 'SP-001-BLACK-128', attributeValues: [{ attribute: attributes[0]._id, value: 'black' }, { attribute: attributes[5]._id, value: '128gb' }], price: 899.99, costPrice: 500.00, stock: 12, status: 'active', isActive: true },
      { product: products[4]._id, name: 'Phone White 256GB', sku: 'SP-001-WHITE-256', attributeValues: [{ attribute: attributes[0]._id, value: 'white' }, { attribute: attributes[5]._id, value: '256gb' }], price: 999.99, costPrice: 550.00, stock: 10, status: 'active', isActive: true },
      { product: products[3]._id, name: 'Shoes Black 42', sku: 'RS-001-BLACK-42', attributeValues: [{ attribute: attributes[0]._id, value: 'black' }, { attribute: attributes[1]._id, value: 'l' }], price: 89.99, costPrice: 45.00, stock: 14, status: 'active', isActive: true },
      { product: products[3]._id, name: 'Shoes White 40', sku: 'RS-001-WHITE-40', attributeValues: [{ attribute: attributes[0]._id, value: 'white' }, { attribute: attributes[1]._id, value: 'm' }], price: 89.99, costPrice: 45.00, stock: 16, status: 'active', isActive: true },
      { product: products[6]._id, name: 'Watch Black', sku: 'SW-001-BLACK', attributeValues: [{ attribute: attributes[0]._id, value: 'black' }], price: 249.99, costPrice: 120.00, stock: 20, status: 'active', isActive: true },
      { product: products[6]._id, name: 'Watch White', sku: 'SW-001-WHITE', attributeValues: [{ attribute: attributes[0]._id, value: 'white' }], price: 249.99, costPrice: 120.00, stock: 18, status: 'active', isActive: true },
    ]);
    console.log(`✅ Seeded ${variants.length} variants\n`);

    // ==================== SUMMARY ====================
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Database seeding completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📊 Summary:');
    console.log(`   ✓ ${permissions.length} Permissions`);
    console.log(`   ✓ ${roles.length} Roles`);
    console.log(`   ✓ ${users.length} Users`);
    console.log(`   ✓ ${attributes.length} Attributes`);
    console.log(`   ✓ ${products.length} Products`);
    console.log(`   ✓ ${variants.length} Variants`);
    console.log('\n🔑 Login Credentials (Password: Password123!):');
    console.log('   • admin@example.com    - Admin');
    console.log('   • john@example.com     - Admin');
    console.log('   • jane@example.com     - Moderator');
    console.log('   • mike@example.com     - Moderator');
    console.log('   • sarah@example.com    - User');
    console.log('   • david@example.com    - User');
    console.log('   • emily@example.com    - Moderator (Inactive)');
    console.log('   • chris@example.com    - User');
    console.log('   • lisa@example.com     - Admin (Suspended)');
    console.log('   • tom@example.com      - User\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
