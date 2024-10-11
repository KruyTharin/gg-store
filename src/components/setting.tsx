import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Switch } from '@/components/ui/switch';
import { Lock, User } from 'lucide-react';
import { Button } from './ui/button';
import { UserSession } from '@/types/next-auth';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';

function Setting({ user }: { user: UserSession }) {
  //   const goBack = () => {
  //     if (user.role === UserRole.ADMIN) {
  //       router.push('/admin/overview');
  //     }

  //     if (user.role === UserRole.USER) {
  //       router.push('/user');
  //     }
  //   };
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        {/* <Button onClick={goBack}>Back</Button> */}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 mt-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={user.name}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Password</Label>
              <Input placeholder="password" disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Confirm Password</Label>
              <Input placeholder="confirm password" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={user.email}
                disabled
              />
            </div>
          </CardContent>
        </Card>

        <Card className="p-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Privacy
            </CardTitle>
            <CardDescription>Profile Visibility</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 mt-5">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">
                Two Factor Authentication
              </Label>
              <Switch
                id="email-notifications"
                disabled
                checked={user.isTwoFactorEnabled}
              />
            </div>
            <Select value={user.role} disabled>
              <SelectTrigger>
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>User Role</SelectLabel>
                  <SelectItem value="USER">USER</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
      <div className="mt-5 flex justify-end">
        <Button disabled>Update</Button>
      </div>
    </div>
  );
}

export default Setting;
