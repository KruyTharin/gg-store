'use client';

import React from 'react';
import { Button } from './ui/button';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import { ROUTES } from '@/route';

function SocialLogin() {
  const onClick = (provider: 'google' | 'github') => {
    signIn(provider, {
      callbackUrl: ROUTES.DEFAULT_LOGIN_REDIRECT_URL,
    });
  };
  return (
    <div className="flex gap-3">
      <Button
        onClick={() => onClick('github')}
        className="w-full"
        variant={'outline'}
        type="button"
      >
        <FaGithub className="w-5 h-5" />
      </Button>
      <Button
        type="button"
        onClick={() => onClick('google')}
        className="w-full"
        variant={'outline'}
      >
        <FaGoogle className="w-5 h-5" />
      </Button>
    </div>
  );
}

export default SocialLogin;
