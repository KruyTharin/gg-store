/* eslint-disable react/no-unescaped-entities */
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
import { FormWrapper } from '@/components/form-wrapper';
import Link from 'next/link';
import {
  NewPasswordSchema,
  NewPasswordSchemaType,
} from '@/schema/new-password';
import { useTransition } from 'react';
import { NewPasswordAction } from './action';
import { useSearchParams } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

export function NewPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();

  const token = searchParams?.get('token');

  const form = useForm<NewPasswordSchemaType>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: NewPasswordSchemaType) {
    if (!token)
      return toast({
        title: 'Error',
        description: 'Missing token!',
      });

    startTransition(() => {
      NewPasswordAction(values, token).then((data) => {
        if (data?.error) {
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
        }
      });
    });
  }

  return (
    <FormWrapper>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-1/3 space-y-6 border p-5 shadow-md rounded-md"
        >
          <h2 className="font-bold text-3xl uppercase text-center underline">
            New Password Form
          </h2>

          <FormField
            control={form.control}
            name="password"
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
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm password..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Reset Password
          </Button>

          <Button
            asChild
            variant={'link'}
            className="flex justify-center"
            disabled={isPending}
          >
            <Link href="/auth/login">Back to login</Link>
          </Button>
        </form>
      </Form>
    </FormWrapper>
  );
}
