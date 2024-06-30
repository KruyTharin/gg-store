import React from 'react';
import { Button } from './ui/button';
import { FaGithub, FaGoogle } from 'react-icons/fa';

function SocialLogin() {
  return (
    <div className="flex gap-3">
      <Button className="w-full" variant={'outline'}>
        <FaGithub className="w-5 h-5" />
      </Button>
      <Button className="w-full" variant={'outline'}>
        <FaGoogle className="w-5 h-5" />
      </Button>
    </div>
  );
}

export default SocialLogin;
