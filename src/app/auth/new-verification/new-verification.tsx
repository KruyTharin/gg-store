'use client';

import { useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import { newVerification } from './action';
import Link from 'next/link';

function NewVerificationTokenForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const token = searchParams.get('token');

  const onSubmit = useCallback(() => {
    if (!token) {
      setError('No token provided');
      return;
    }

    newVerification(token)
      .then((data) => {
        if (data.error) {
          setError(data?.error);
        }
        if (data.success) {
          setSuccess(data?.success);
        }
      })
      .catch(() => {
        setError('Something went wrong!');
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="flex w-full h-dvh flex-col justify-center items-center">
      {error && <span className="text-rose-500">{error}</span>}
      {success && <span className="text-teal-500">{success}</span>}
      <h2 className="font-bold text-2xl">Verified Email</h2>
      <BeatLoader loading={true} />
      <Link href={'/auth/login'}>Login</Link>
    </div>
  );
}

export default NewVerificationTokenForm;
