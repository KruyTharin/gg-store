'use client';

import { CreateConfigAction } from '@/actions/config';
import CustomLabel from '@/components/custom-label';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { toast } from '@/components/ui/use-toast';
import { CreateConfigSchema, CreateConfigSchemaType } from '@/schema/config';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';

function CreateConfigForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<CreateConfigSchemaType>({
    resolver: zodResolver(CreateConfigSchema),
    defaultValues: {
      email: '',
      facebookUrl: '',
      location: '',
      locationUrl: '',
      phoneNumber: '',
      slogan: '',
      telegramUrl: '',
    },
  });

  function onSubmit(values: CreateConfigSchemaType) {
    startTransition(() => {
      CreateConfigAction(values).then((data) => {
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

          router.push('/admin/config');
        }
      });
    });
  }

  return (
    <div className="container my-5">
      <div className="flex justify-between">
        <div>
          <h2 className="font-bold text-2xl"> Create Config</h2>
          <span>manage your config</span>
        </div>
      </div>
      <div className="bg-gray-200 w-full h-[1px] mt-5"></div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <CustomLabel>Phone Number</CustomLabel>
                  <FormControl>
                    <Input placeholder="Product Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slogan"
              render={({ field }) => (
                <FormItem>
                  <CustomLabel>Slogan</CustomLabel>
                  <FormControl>
                    <Input placeholder="Product Slogan" {...field} />
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
                  <CustomLabel>Email</CustomLabel>
                  <FormControl>
                    <Input placeholder="Product Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <CustomLabel>location</CustomLabel>
                  <FormControl>
                    <Input placeholder="Product location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="locationUrl"
              render={({ field }) => (
                <FormItem>
                  <CustomLabel>locationUrl</CustomLabel>
                  <FormControl>
                    <Input placeholder="Product locationUrl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facebookUrl"
              render={({ field }) => (
                <FormItem>
                  <CustomLabel>facebookUrl</CustomLabel>
                  <FormControl>
                    <Input placeholder="Product facebookUrl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telegramUrl"
              render={({ field }) => (
                <FormItem>
                  <CustomLabel>telegramUrl</CustomLabel>
                  <FormControl>
                    <Input placeholder="Product telegramUrl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isPending}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default CreateConfigForm;
