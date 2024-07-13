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
import { useState, useTransition } from 'react';
import { LoginAction } from './action';
import { useSearchParams } from 'next/navigation';

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const [twoFactor, setTwoFactor] = useState(false);

  const errorMessage =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'This email is already use in another provider!'
      : '';

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

        if (data?.twoFactor) {
          setTwoFactor(data?.twoFactor);
          toast({
            title: 'Two Factor Authentication',
            description: '2FA sent to your email!',
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

          {!twoFactor && (
            <>
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
                      <Input
                        placeholder="password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {twoFactor && (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>code</FormLabel>
                  <FormControl>
                    <Input placeholder="2FA code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* TODO: add get new 2FA code */}

          <span className="text-rose-500 pt-5">{errorMessage}</span>

          {!twoFactor && (
            <Button asChild variant={'link'} className="flex justify-end">
              <Link href="/auth/forgot-password">Forgot password?</Link>
            </Button>
          )}

          <Button type="submit" className="w-full">
            {twoFactor ? 'Confirm' : 'Login'}
          </Button>

          <SocialLogin />

          <Button
            asChild
            variant={'link'}
            className="flex justify-center"
            disabled={isPending}
          >
            <Link href="/auth/register">Didn't have account?</Link>
          </Button>
        </form>
      </Form>
    </FormWrapper>
  );
}
