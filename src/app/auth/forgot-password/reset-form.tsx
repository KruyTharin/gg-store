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
import {
  ResetPasswordSchema,
  ResetPasswordSchemaType,
} from '@/schema/reset-password';
import { useTransition } from 'react';
import { ResetPasswordAction } from './action';

export function ResetForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(values: ResetPasswordSchemaType) {
    startTransition(() => {
      ResetPasswordAction(values).then((data) => {
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
            Reset Password Form
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

          <Button type="submit" className="w-full">
            Send Reset Password
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
