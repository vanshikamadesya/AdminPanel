import { BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium tracking-[0.18em] text-blue-600 uppercase">Insights</p>
        <h1 className="mt-2 text-3xl font-bold">Analytics</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$128.4K</div>
            <p className="text-muted-foreground mt-1 text-xs">+18.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active users</CardTitle>
            <BarChart3 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24.8K</div>
            <p className="text-muted-foreground mt-1 text-xs">+7.4% this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-violet-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">6.89%</div>
            <p className="text-muted-foreground mt-1 text-xs">Improved pipeline health</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
