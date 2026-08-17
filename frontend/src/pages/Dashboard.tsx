import { useEffect, useState } from 'react';
import { Users, UserCheck, UserX, Shield, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { userService } from '../services/userService';
import type { DashboardStats } from '../types';
import { Loader } from '../components/ui/Loader';
import { formatDateTime } from '../lib/utils';
import { useAppSelector } from '../store/hooks';
import { UserRole } from '../types';

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const rolePermissions: Record<UserRole, string[]> = {
    [UserRole.ADMIN]: [
      'Full access to users',
      'System analytics',
      'Report management',
      'Role and permissions',
      'Account security',
    ],
    [UserRole.MODERATOR]: ['Moderate users', 'View analytics', 'Manage reports', 'Team oversight'],
    [UserRole.USER]: ['View profile', 'Edit account settings', 'Read reports', 'Access dashboard'],
  };

  const role = user?.role || UserRole.USER;
  const permissions = rolePermissions[role];

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.role === UserRole.ADMIN) {
        try {
          const data = await userService.getDashboardStats();
          setStats(data);
        } catch (error) {
          console.error('Failed to fetch stats:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-blue-50 p-6 shadow-sm dark:border-blue-900/50 dark:from-blue-950/40 dark:via-slate-900 dark:to-blue-950/30">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-100 px-2.5 py-1 text-xs font-semibold tracking-[0.2em] text-blue-700 uppercase dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
              {role}
            </span>
            <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
              Welcome back, {user?.firstName || 'Admin'}! 👋
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Role-based access dashboard with permission-aware controls.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {permissions.map((permission) => (
              <span
                key={permission}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {permission}
              </span>
            ))}
          </div>
        </div>
      </div>

      {role === UserRole.ADMIN && stats && (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalUsers}</div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  <TrendingUp className="mr-1 inline h-3 w-3" />
                  All registered users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <UserCheck className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.activeUsers}</div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Currently active accounts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
                <UserX className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.inactiveUsers}</div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Suspended or inactive
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
                <Shield className="h-4 w-4 text-violet-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.verifiedUsers}</div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Email verified accounts
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentUsers.map((recentUser) => (
                    <div
                      key={recentUser.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                          {recentUser.firstName[0]}
                          {recentUser.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {recentUser.firstName} {recentUser.lastName}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {recentUser.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {recentUser.role}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDateTime(recentUser.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Access Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {permissions.map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800/50"
                  >
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {permission}
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase dark:bg-emerald-900/30 dark:text-emerald-300">
                      Allowed
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {role === UserRole.MODERATOR && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Team Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-950/30">
                <p className="text-sm text-blue-700 dark:text-blue-200">Moderation permissions</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Enabled</p>
              </div>
              <div className="space-y-2">
                {permissions.map((permission) => (
                  <div key={permission} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">{permission}</span>
                    <span className="text-emerald-600">●</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-3"
                onClick={() => navigate('/reports')}
              >
                <div className="text-left">
                  <p className="font-medium">Review reports</p>
                  <p className="text-sm text-muted-foreground">
                    Handle new activity and alerts
                  </p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-3"
                onClick={() => navigate('/analytics')}
              >
                <div className="text-left">
                  <p className="font-medium">Analytics overview</p>
                  <p className="text-sm text-muted-foreground">
                    Track engagement and trends
                  </p>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {role === UserRole.USER && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Name</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Email</p>
                <p className="text-lg text-slate-900 dark:text-white">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Status</p>
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                  {user?.status}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Email Verification
                </p>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    user?.isEmailVerified
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}
                >
                  {user?.isEmailVerified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
              <div className="pt-4">
                <Button
                  className="w-full"
                  onClick={() => navigate('/profile')}
                >
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {permissions.map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
                  >
                    <span className="text-slate-700 dark:text-slate-200">{permission}</span>
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-semibold tracking-wide text-blue-700 uppercase dark:bg-blue-900/30 dark:text-blue-200">
                      Active
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/profile')}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/reports')}
                >
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
