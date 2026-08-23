'use client';

import { useRef, useState, type DragEvent, type MouseEvent, type ReactNode } from 'react';
import { AlertCircle, Camera, ImageUp, LoaderCircle, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/app/ui/alert';
import { Button } from '@/app/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/app/ui/empty';
import { cn } from '@/lib/utils';
import { DEVICE_TYPE } from '@/lib/device-detection/types';
import { useDeviceType } from '@/lib/device-detection/use-device-type';
import { ACCEPTED_IMAGE_ACCEPT, SNAP, SNAP_ANALYSIS_STATUS } from './constants';
import { useSnapAnalyze, useSnapPhoto, useSnapSavedMealLoader } from './hooks';
import { SnapAnalysisStage, SnapPhotoStage } from './snap-stage';
import { SnapCameraDialog } from './snap-camera-dialog';
import { canUseCameraStream, firstAcceptedImageFile } from './utils';

export function SnapUploadPanel() {
  const { photo, setPhoto } = useSnapPhoto();
  const { analysisState, analyzePhoto } = useSnapAnalyze();
  const { loadingSavedMeal } = useSnapSavedMealLoader();
  const deviceType = useDeviceType();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const dragCountRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showAnalysisLayout = Boolean(photo) && analysisState.STATUS !== SNAP_ANALYSIS_STATUS.IDLE;
  const photoActionsDisabled = analysisState.STATUS === SNAP_ANALYSIS_STATUS.LOADING;

  function applyFile(file: File | null) {
    if (!file) {
      setError(SNAP.ERROR_TYPE);
      return;
    }

    setError(null);
    setPhoto(file);
  }

  function handleZoneClick(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest('button')) {
      return;
    }

    fileInputRef.current?.click();
  }

  function handleDragEnter(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragCountRef.current += 1;
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragCountRef.current -= 1;
    if (dragCountRef.current <= 0) {
      dragCountRef.current = 0;
      setIsDragging(false);
    }
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragCountRef.current = 0;
    setIsDragging(false);
    applyFile(firstAcceptedImageFile(event.dataTransfer.files));
  }

  function openGallery() {
    fileInputRef.current?.click();
  }

  function openCamera() {
    if (!canUseCameraStream()) {
      if (deviceType === DEVICE_TYPE.PHONE) {
        cameraInputRef.current?.click();
        return;
      }

      setError(SNAP.ERROR_CAMERA_SECURE);
      return;
    }

    setIsCameraOpen(true);
  }

  function removePhoto() {
    setError(null);
    setPhoto(null);
  }

  const emptyActions = (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button type="button" variant="outline" onClick={openGallery}>
        <ImageUp data-icon="inline-start" />
        {SNAP.GALLERY}
      </Button>
      <Button type="button" onClick={openCamera}>
        <Camera data-icon="inline-start" />
        {SNAP.CAMERA}
      </Button>
    </div>
  );

  const photoActions = {
    onReplace: openGallery,
    onCamera: openCamera,
    onRemove: removePhoto,
  };

  let mainContent: ReactNode;

  if (loadingSavedMeal && !photo) {
    mainContent = (
      <div className="flex min-h-72 flex-1 flex-col items-center justify-center gap-3 sm:min-h-112 lg:min-h-128">
        <LoaderCircle className="text-muted-foreground size-8 animate-spin" aria-hidden />
        <p className="text-muted-foreground text-sm">{SNAP.LOADING_SAVED_MEAL}</p>
      </div>
    );
  } else if (showAnalysisLayout && photo) {
    mainContent = (
      <SnapAnalysisStage
        analysisState={analysisState}
        photo={photo}
        photoActions={photoActions}
        photoActionsDisabled={photoActionsDisabled}
      />
    );
  } else if (photo) {
    mainContent = (
      <SnapPhotoStage
        photo={photo}
        photoActions={photoActions}
        onAnalyze={() => {
          void analyzePhoto();
        }}
      />
    );
  } else {
    mainContent = (
      <Empty
        className={cn(
          'min-h-72 flex-1 sm:min-h-112 lg:min-h-128',
          deviceType === DEVICE_TYPE.PHONE
            ? 'border'
            : 'cursor-pointer border-4 border-dashed',
          deviceType === DEVICE_TYPE.DESKTOP && isDragging && 'border-cta bg-muted/40',
        )}
        onClick={handleZoneClick}
        {...(deviceType === DEVICE_TYPE.PHONE
          ? {}
          : {
              onDragEnter: handleDragEnter,
              onDragLeave: handleDragLeave,
              onDragOver: handleDragOver,
              onDrop: handleDrop,
            })}
      >
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Upload aria-hidden />
          </EmptyMedia>
          <EmptyTitle>
            {deviceType === DEVICE_TYPE.PHONE ? SNAP.DROP_TITLE_PHONE : SNAP.DROP_TITLE}
          </EmptyTitle>
          <EmptyDescription>{SNAP.DROP_BODY}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          {deviceType === DEVICE_TYPE.DESKTOP ? <p>{SNAP.DROP_HINT}</p> : null}
          {emptyActions}
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_ACCEPT}
        className="sr-only"
        aria-label={SNAP.FILE_INPUT_LABEL}
        onChange={(event) => {
          applyFile(firstAcceptedImageFile(event.target.files));
          event.target.value = '';
        }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_ACCEPT}
        capture="environment"
        className="sr-only"
        aria-label={SNAP.CAMERA}
        onChange={(event) => {
          applyFile(firstAcceptedImageFile(event.target.files));
          event.target.value = '';
        }}
      />
      {mainContent}
      {error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>{SNAP.ERROR_TITLE}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <SnapCameraDialog
        open={isCameraOpen}
        allowBackCamera={deviceType === DEVICE_TYPE.PHONE}
        onOpenChange={setIsCameraOpen}
        onCapture={(file) => {
          applyFile(file);
        }}
      />
    </div>
  );
}
