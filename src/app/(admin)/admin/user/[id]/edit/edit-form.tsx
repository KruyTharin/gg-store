'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useTransition } from 'react';
import { EditUserAction } from '@/actions/user';
import { updateUserSchema, UpdateUserSchemaSchemaType } from '@/schema/user';
import { useRouter } from 'next/navigation';
import { User, UserRole } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ImageUpload from '@/components/ui/image-upload';

export function EditUserForm({ defaultValues }: { defaultValues: User }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<UpdateUserSchemaSchemaType>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: defaultValues?.name || undefined,
      email: defaultValues?.email || undefined,
      password: undefined,
      newPassword: undefined,
      role: defaultValues?.role as any,
      image: defaultValues?.image || undefined,
    },
  });

  function onSubmit(values: UpdateUserSchemaSchemaType) {
    startTransition(() => {
      EditUserAction(values, defaultValues.id!).then((data) => {
        if (data.error) {
          toast({
            title: 'Error',
            description: data.error,
          });
        }

        if (data?.success) {
          toast({
            title: 'Success',
            description: data.success,
          });

          router.push('/admin/user');
        }
      });
    });
  }

  return (
    <div className="container my-5">
      <div className="flex justify-between">
        <div>
          <h2 className="font-bold text-2xl"> Edit User</h2>
          <span>edit a user</span>
        </div>
      </div>
      <div className="bg-gray-200 w-full h-[1px] mt-5"></div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="jonh doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="new password..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={UserRole.ADMIN}>
                        {UserRole.ADMIN}
                      </SelectItem>
                      <SelectItem value={UserRole.USER}>
                        {UserRole.USER}
                      </SelectItem>
                      <SelectItem value={UserRole.DELIVERY}>
                        {UserRole.DELIVERY}
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-fit" disabled={isPending}>
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
}
