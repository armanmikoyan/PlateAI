'use client';

import { Camera, ImageUp, Trash2 } from 'lucide-react';
import { Button } from '@/app/ui/button';
import { SNAP } from './constants';
import type { SnapPhotoActionsProps } from './types';

export function SnapPhotoActions({
  disabled,
  onCamera,
  onRemove,
  onReplace,
}: SnapPhotoActionsProps) {
  return (
    <div className="flex w-full max-w-52 flex-col gap-2">
      <Button type="button" variant="secondary" disabled={disabled} onClick={onReplace}>
        <ImageUp data-icon="inline-start" />
        {SNAP.REPLACE}
      </Button>
      <Button type="button" variant="secondary" disabled={disabled} onClick={onCamera}>
        <Camera data-icon="inline-start" />
        {SNAP.CAMERA}
      </Button>
      <Button type="button" variant="secondary" disabled={disabled} onClick={onRemove}>
        <Trash2 data-icon="inline-start" />
        {SNAP.REMOVE}
      </Button>
    </div>
  );
}
