'use server';

import { RegisterSchema, RegisterSchemaType } from '@/schema/register';

export const RegisterAction = async (values: RegisterSchemaType) => {
  const validationField = RegisterSchema.safeParse(values);

  if (!validationField) {
    return {
      error: 'invalid field',
    };
  }
  return { success: 'Successfully!' };
};
