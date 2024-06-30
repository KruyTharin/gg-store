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
import { toast } from '@/components/ui/use-toast';
import { FormWrapper } from '@/components/form-wrapper';
import Link from 'next/link';
import SocialLogin from '@/components/social';
import { LoginSchema, LoginSchemaType } from '@/schema/login';
import { useTransition } from 'react';
import { LoginAction } from './action';

export function LoginForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: LoginSchemaType) {
    startTransition(() => {
      LoginAction(values).then((data) => {
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
            Login Form
          </h2>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
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

          <Button type="submit" className="w-full">
            Login
          </Button>

          <SocialLogin />

          <Button
            asChild
            variant={'link'}
            className="flex justify-center"
            disabled={isPending}
          >
            <Link href="/register">Didn't have account?</Link>
          </Button>
        </form>
      </Form>
    </FormWrapper>
  );
}
