'use client';

import { useRef, useState } from 'react';
import { AlertCircle, Camera, SwitchCamera } from 'lucide-react';
import Webcam from 'react-webcam';
import { Alert, AlertDescription, AlertTitle } from '@/app/ui/alert';
import { Button } from '@/app/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/ui/dialog';
import { ToggleGroup, ToggleGroupItem } from '@/app/ui/toggle-group';
import { SNAP, SNAP_CAMERA_BACK, SNAP_CAMERA_CAPTURE_FILE, SNAP_CAMERA_FRONT } from './constants';
import type { SnapCameraDialogProps, SnapCameraFacing } from './types';
import { fileFromJpegDataUrl } from './utils';

export function SnapCameraDialog({
  allowBackCamera,
  onCapture,
  onOpenChange,
  open,
}: SnapCameraDialogProps) {
  const webcamRef = useRef<Webcam>(null);
  const [phoneFacing, setPhoneFacing] = useState<SnapCameraFacing>(SNAP_CAMERA_BACK);
  const [error, setError] = useState<string | null>(null);
  const facing = allowBackCamera ? phoneFacing : SNAP_CAMERA_FRONT;

  function handleOpenChange(next: boolean) {
    if (!next) {
      setError(null);
    }

    onOpenChange(next);
  }

  async function handleCapture() {
    const screenshot = webcamRef.current?.getScreenshot();
    if (!screenshot) {
      setError(SNAP.ERROR_CAMERA);
      return;
    }

    try {
      onCapture(await fileFromJpegDataUrl(screenshot, SNAP_CAMERA_CAPTURE_FILE));
      handleOpenChange(false);
    } catch {
      setError(SNAP.ERROR_CAMERA);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{SNAP.CAMERA_TITLE}</DialogTitle>
          <DialogDescription>
            {allowBackCamera ? SNAP.CAMERA_BODY : SNAP.CAMERA_BODY_DESKTOP}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          {allowBackCamera ? (
            <ToggleGroup
              value={[facing]}
              onValueChange={([next]) => {
                if (next === SNAP_CAMERA_BACK || next === SNAP_CAMERA_FRONT) {
                  setPhoneFacing(next);
                }
              }}
              variant="outline"
              spacing={2}
              aria-label={SNAP.CAMERA_TITLE}
            >
              <ToggleGroupItem value={SNAP_CAMERA_BACK}>
                <Camera data-icon="inline-start" />
                {SNAP.CAMERA_BACK}
              </ToggleGroupItem>
              <ToggleGroupItem value={SNAP_CAMERA_FRONT}>
                <SwitchCamera data-icon="inline-start" />
                {SNAP.CAMERA_FRONT}
              </ToggleGroupItem>
            </ToggleGroup>
          ) : null}
          {open ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              mirrored={facing === SNAP_CAMERA_FRONT}
              videoConstraints={{ facingMode: { ideal: facing } }}
              onUserMediaError={() => setError(SNAP.ERROR_CAMERA)}
              className="bg-muted aspect-3/4 w-full rounded-lg object-cover"
              aria-label={SNAP.CAMERA_VIDEO_LABEL}
            />
          ) : null}
          {error ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>{SNAP.ERROR_TITLE}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => void handleCapture()} disabled={Boolean(error)}>
            <Camera data-icon="inline-start" />
            {SNAP.CAMERA_CAPTURE}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
