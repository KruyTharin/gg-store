'use client';

import { useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { MoonLoader } from 'react-spinners';
import { newVerification } from './action';
import { useRouter } from 'next/navigation';
import { LoginAction } from '../login/action';

function NewVerificationTokenForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const password = searchParams.get('password') as string;
  const email = searchParams.get('email') as string;

  const token = searchParams.get('token');

  const onSubmit = useCallback(() => {
    if (!token) {
      setError('No token provided');
      return;
    }

    newVerification(token)
      .then(async (data) => {
        if (data.error) {
          setError(data?.error);
        }
        if (data.success) {
          setSuccess(data?.success);
          await handleLogin();
        }
      })
      .catch(() => {
        setError('Something went wrong!');
      });
  }, [token]);

  const handleLogin = async () => {
    await LoginAction({ email, password });
  };

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="flex w-full h-dvh flex-col justify-center items-center bg-white">
      <MoonLoader loading={true} />
    </div>
  );
}

export default NewVerificationTokenForm;
