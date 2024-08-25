'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { Button } from './button';
import { ImagePlus, Trash } from 'lucide-react';

import { CldUploadWidget } from 'next-cloudinary';

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  onRemove,
  value,
  disabled,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative size-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                variant={'destructive'}
                onClick={() => onRemove(url)}
                size={'icon'}
                type="button"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>

            <Image fill className="object-cover" src={url} alt="image" />
          </div>
        ))}
      </div>

      <CldUploadWidget onUpload={onUpload} uploadPreset="rtbxdqha">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              disabled={disabled}
              variant={'secondary'}
              type="button"
              onClick={onClick}
            >
              <ImagePlus className="w-4 h-4" />
              <span>Upload image</span>
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
