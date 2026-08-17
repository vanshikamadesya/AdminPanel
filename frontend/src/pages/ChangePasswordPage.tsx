import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, KeyRound, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import * as userService from '../services/userService';

export function ChangePasswordPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const changePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setIsSaving(true);
    try {
      await userService.changePassword(passwords);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to change password.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link to="/profile" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to profile
        </Link>
        <p className="mt-5 text-sm font-medium tracking-[0.18em] text-primary uppercase">Security</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Change password</h1>
        <p className="mt-2 text-muted-foreground">Use a strong, unique password to keep your account secure.</p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><ShieldCheck className="h-5 w-5" /></div>
          <CardTitle>Update your password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={changePassword} className="space-y-5">
            <Input label="Current password" type="password" value={passwords.currentPassword} required onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} />
            <Input label="New password" type="password" value={passwords.newPassword} required minLength={8} placeholder="At least 8 characters" onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
            <Input label="Confirm new password" type="password" value={passwords.confirmPassword} required minLength={8} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} />
            <div className="flex justify-end border-t pt-4">
              <Button type="submit" isLoading={isSaving} className="gap-2"><KeyRound className="h-4 w-4" />Update password</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
