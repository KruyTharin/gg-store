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
import { useTransition } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { Config } from '@prisma/client';
import { Trash } from 'lucide-react';
import { useDeleteAlertStore } from '@/app/stores/useDeleteStore';
import { useMutation } from '@tanstack/react-query';
import { AlertDeleteDialog } from '@/components/alert/delete';
import { CreateConfigSchema, CreateConfigSchemaType } from '@/schema/config';
import { ConfigDeleteAction, EditConfigAction } from '@/actions/config';

export function EditColorForm({
  defaultValues,
}: {
  defaultValues: Config | null;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const onDeleteShow = useDeleteAlertStore((state) => state.onShow);
  const onShowClose = useDeleteAlertStore((state) => state.onClose);

  const { mutate: onDeleteConfirm } = useMutation({
    mutationFn: async (id: string) => await ConfigDeleteAction(id),

    onSuccess: (data) => {
      if (data?.success) {
        toast({
          title: 'Success',
          description: data.success,
        });
      }

      if (data?.error) {
        toast({
          title: 'Error',
          description: data.error,
        });
      }

      router.push('/admin/config');
      onShowClose();
    },
  });

  const form = useForm<CreateConfigSchemaType>({
    resolver: zodResolver(CreateConfigSchema),
    defaultValues: defaultValues!,
  });

  function onSubmit(values: CreateConfigSchemaType) {
    startTransition(() => {
      EditConfigAction(values, defaultValues!.id).then((data) => {
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
          <h2 className="font-bold text-2xl"> Edit config</h2>
          <span>edit the configuration</span>
        </div>
        <Button
          variant={'destructive'}
          className="space-x-1"
          onClick={() =>
            onDeleteShow({
              text: 'Delete Color',
              onAccept: () => onDeleteConfirm(defaultValues!.id),
            })
          }
        >
          <span>Delete</span>
          <Trash className="size-4" />
        </Button>
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

      <AlertDeleteDialog />
    </div>
  );
}
