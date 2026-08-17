# Database Seeder

This is a single seeder file that populates the database with 10 records for each collection.

## What Gets Seeded

The seeder creates **10 records** for each of the following collections:

- ✅ **10 Permissions** - System permissions for access control
- ✅ **10 Roles** - User roles (Super Admin, Admin, Manager, Moderator, etc.)
- ✅ **10 Users** - Test users with different roles and statuses
- ✅ **10 Attributes** - Product attributes (Color, Size, Material, etc.)
- ✅ **10 Products** - Sample products across different categories
- ✅ **10 Variants** - Product variants with different attribute combinations

## How to Run

### Using npm script (Recommended):

```bash
# Navigate to backend directory
cd backend

# Run the seeder
npm run seed
```

### Direct execution:

```bash
npx ts-node src/seeders/seed.ts
```

## Test Credentials

All users have the same password: **Password123!**

| Email                  | Role          | Status    |
|------------------------|---------------|-----------|
| admin@example.com      | Super Admin   | Active    |
| john@example.com       | Admin         | Active    |
| jane@example.com       | Manager       | Active    |
| mike@example.com       | Moderator     | Active    |
| sarah@example.com      | Editor        | Active    |
| david@example.com      | Viewer        | Active    |
| emily@example.com      | Support       | Inactive  |
| chris@example.com      | Analyst       | Active    |
| lisa@example.com       | Developer     | Suspended |
| tom@example.com        | Guest         | Active    |

## Sample Data Included

### Permissions (10)
- View Users, Create User, Edit User, Delete User
- View Roles, Manage Roles
- View Products, Manage Products
- View Reports
- Manage Settings

### Roles (10)
- Super Admin (all permissions)
- Admin (most permissions)
- Manager, Moderator, Editor
- Viewer, Support, Analyst
- Developer, Guest

### Products (10)
- Classic T-Shirt
- Denim Jeans
- Leather Jacket
- Running Shoes
- Smartphone Pro
- Wireless Headphones
- Smart Watch
- Laptop Backpack
- Coffee Maker
- Desk Lamp

### Attributes (10)
- Color, Size, Material
- Brand, Weight
- Storage, RAM
- Screen Size, Battery
- Warranty

### Variants (10)
Various product variants with different color, size, and other attribute combinations.

## ⚠️ Important Warning

**Running this seeder will DELETE ALL existing data** in these collections:
- permissions
- roles
- users
- attributes
- products
- variants

Make sure to backup your data before running the seeder!

## Features

✅ Single file seeder - easy to maintain
✅ Exactly 10 records per collection
✅ Automatically creates relationships between collections
✅ Clears existing data before seeding
✅ Detailed console output with progress
✅ Professional test data ready to use

## Requirements

- MongoDB must be running
- `.env` file must be configured with `MONGODB_URI`
- All dependencies must be installed (`npm install`)

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env` file
- Verify database credentials

**Module Not Found Error:**
- Run `npm install` to install dependencies
- Check that all model files exist

**Seeding Fails Midway:**
- Check MongoDB connection stability
- Ensure sufficient disk space
- Review error messages for specific issues
