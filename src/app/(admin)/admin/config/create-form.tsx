'use client';

import { CreateConfigAction } from '@/actions/config';
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
import { CreateConfigSchema, CreateConfigSchemaType } from '@/schema/config';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category, Color, Size } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';

function CreateConfigForm() {
  const [isPending, startTransition] = useTransition();

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
                  <FormLabel>Phone Number</FormLabel>
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
                  <FormLabel>Slogan</FormLabel>
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
                  <FormLabel>Email</FormLabel>
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
                  <FormLabel>location</FormLabel>
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
                  <FormLabel>locationUrl</FormLabel>
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
                  <FormLabel>facebookUrl</FormLabel>
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
                  <FormLabel>telegramUrl</FormLabel>
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
