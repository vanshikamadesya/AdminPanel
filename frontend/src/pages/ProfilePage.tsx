import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { KeyRound, Save, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUser } from '../store/slices/authSlice';
import * as userService from '../services/userService';

export function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({ firstName: '', lastName: '', phoneNumber: '', dateOfBirth: '' });

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '',
      });
    }
  }, [user]);

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        ...(profile.phoneNumber ? { phoneNumber: profile.phoneNumber } : {}),
        ...(profile.dateOfBirth ? { dateOfBirth: profile.dateOfBirth } : {}),
      };
      const response = await userService.updateProfile(payload);
      const updatedUser = response.data.data?.user;
      if (updatedUser) dispatch(setUser(updatedUser));
      toast.success('Profile updated successfully.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-medium tracking-[0.18em] text-primary uppercase">Account</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">My profile</h1>
        <p className="mt-2 text-muted-foreground">Manage your personal details and account security.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-400 to-indigo-500 text-2xl font-bold text-white shadow-lg shadow-sky-500/20">
              {user?.firstName?.[0]?.toUpperCase()}{user?.lastName?.[0]?.toUpperCase()}
            </div>
            <h2 className="mt-4 text-lg font-semibold">{user?.firstName} {user?.lastName}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              {user?.isEmailVerified ? 'Email verified' : 'Email not verified'}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Personal information</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={saveProfile} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="First name" value={profile.firstName} required onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
                  <Input label="Last name" value={profile.lastName} required onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
                </div>
                <Input label="Email" value={user?.email || ''} disabled className="cursor-not-allowed" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Phone number" type="tel" value={profile.phoneNumber} placeholder="+91 98765 43210" onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })} />
                  <Input label="Date of birth" type="date" value={profile.dateOfBirth} onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })} />
                </div>
                <div className="flex justify-end border-t pt-4"><Button type="submit" isLoading={isSaving} className="gap-2"><Save className="h-4 w-4" />Save changes</Button></div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Change password</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">Update your password from the dedicated security page.</p>
                <Link to="/change-password" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-input bg-background px-4 text-sm font-semibold transition-colors hover:bg-accent">
                  <KeyRound className="h-4 w-4" />Change password
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
