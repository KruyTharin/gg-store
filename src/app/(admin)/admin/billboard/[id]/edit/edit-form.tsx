'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import ImageUpload from '@/components/ui/image-upload';
import {
  CreateBillboardSchema,
  CreateBillboardSchemaType,
} from '@/schema/billboard';
import { useTransition } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { IBillboard } from '@/types/interface';
import {
  BillboardDeleteAction,
  EditBillboardAction,
} from '@/actions/billboard';
import { Trash } from 'lucide-react';
import { useDeleteAlertStore } from '@/app/stores/useDeleteStore';
import { useMutation } from '@tanstack/react-query';
import { AlertDeleteDialog } from '@/components/alert/delete';

export function EditBillboardForm({
  defaultValues,
}: {
  defaultValues: IBillboard | null;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onDeleteShow = useDeleteAlertStore((state) => state.onShow);
  const onShowClose = useDeleteAlertStore((state) => state.onClose);

  const { mutate: onDeleteConfirm } = useMutation({
    mutationFn: async (id: string) => await BillboardDeleteAction(id),

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

      router.push('/admin/billboard');
      onShowClose();
    },
  });

  const form = useForm<CreateBillboardSchemaType>({
    resolver: zodResolver(CreateBillboardSchema),
    defaultValues: {
      label: defaultValues?.label,
      imageUrl: defaultValues?.imageUrl,
    },
  });

  function onSubmit(values: CreateBillboardSchemaType) {
    startTransition(() => {
      EditBillboardAction(values, defaultValues!.id).then((data) => {
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
          router.push('/admin/billboard');
        }
      });
    });
  }

  return (
    <div className="container my-5">
      <div className="flex justify-between">
        <div>
          <h2 className="font-bold text-2xl"> Edit Billboards</h2>
          <span>edit the new billboard</span>
        </div>

        <Button
          variant={'destructive'}
          className="space-x-1"
          onClick={() =>
            onDeleteShow({
              text: 'Delete Category',
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
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
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input placeholder="billboard label" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isPending}>
            Edit
          </Button>
        </form>
      </Form>

      <AlertDeleteDialog />
    </div>
  );
}
