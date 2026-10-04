'use client';

import { useRef, useState, type DragEvent, type MouseEvent, type ReactNode } from 'react';
import { AlertCircle, Camera, ImageUp, LoaderCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/app/ui/alert';
import { Button } from '@/app/ui/button';
import { cn } from '@/app/utils/cn';
import { DEVICE_TYPE } from '@/app/utils/device-detection/types';
import { useDeviceType } from '@/app/utils/device-detection/use-device-type';
import { trackSnapPhoto } from '@/app/utils/analytics';
import {
  ACCEPTED_IMAGE_ACCEPT,
  SNAP,
  SNAP_ANALYSIS_STATUS,
  SNAP_PANEL_STAGE,
  SNAP_STAGE_MIN_HEIGHT_CLASS,
  SNAP_STAGE_SHELL_CLASS,
} from './constants';
import { useSnapAnalyze, useSnapPhoto, useSnapSavedMealLoader } from './hooks';
import { SnapAnalysisStage, SnapPhotoStage, SnapPlanRequiredStage } from './snap-stage';
import { SnapCameraDialog } from './snap-camera-dialog';
import { SnapUploadZone } from './snap-upload-zone';
import { canUseCameraStream, firstAcceptedImageFile, snapPanelStageKey } from './utils';

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

  const photoActionsDisabled =
    analysisState.STATUS === SNAP_ANALYSIS_STATUS.LOADING ||
    (analysisState.STATUS === SNAP_ANALYSIS_STATUS.SUCCESS && analysisState.LOCKED === true);

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
    trackSnapPhoto('drag');
    applyFile(firstAcceptedImageFile(event.dataTransfer.files));
  }

  function openGallery() {
    trackSnapPhoto('gallery');
    fileInputRef.current?.click();
  }

  function openCamera() {
    trackSnapPhoto('camera');
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

  const stageKey = snapPanelStageKey({
    analysisState,
    hasPhoto: Boolean(photo),
    loadingSavedMeal,
  });

  let mainContent: ReactNode;

  if (stageKey === SNAP_PANEL_STAGE.LOADING) {
    mainContent = (
      <div className="flex min-h-72 flex-1 flex-col items-center justify-center gap-3 sm:min-h-112 lg:min-h-128">
        <LoaderCircle
          className="text-muted-foreground size-8 animate-spin motion-reduce:animate-none"
          aria-hidden
        />
        <p className="text-muted-foreground text-sm">{SNAP.LOADING_SAVED_MEAL}</p>
      </div>
    );
  } else if (stageKey === SNAP_PANEL_STAGE.ANALYSIS && photo) {
    mainContent = (
      <SnapAnalysisStage
        analysisState={analysisState}
        photo={photo}
        photoActions={photoActions}
        photoActionsDisabled={photoActionsDisabled}
        onRetry={() => {
          analyzePhoto();
        }}
      />
    );
  } else if (stageKey === SNAP_PANEL_STAGE.PLAN_REQUIRED && photo) {
    mainContent = <SnapPlanRequiredStage photo={photo} photoActions={photoActions} />;
  } else if (stageKey === SNAP_PANEL_STAGE.PHOTO && photo) {
    mainContent = (
      <SnapPhotoStage
        photo={photo}
        photoActions={photoActions}
        onAnalyze={() => {
          analyzePhoto();
        }}
      />
    );
  } else {
    mainContent = (
      <SnapUploadZone
        title={deviceType === DEVICE_TYPE.PHONE ? SNAP.DROP_TITLE_PHONE : SNAP.DROP_TITLE}
        description={SNAP.DROP_BODY}
        {...(deviceType === DEVICE_TYPE.PHONE ? {} : { hint: SNAP.DROP_HINT })}
        actions={emptyActions}
        interactive={deviceType === DEVICE_TYPE.DESKTOP}
        isDragging={isDragging}
        onClick={handleZoneClick}
        dragHandlers={
          deviceType === DEVICE_TYPE.PHONE
            ? undefined
            : {
                onDragEnter: handleDragEnter,
                onDragLeave: handleDragLeave,
                onDragOver: handleDragOver,
                onDrop: handleDrop,
              }
        }
      />
    );
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-3 lg:min-h-0 lg:flex-1">
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_ACCEPT}
        className="sr-only"
        aria-label={SNAP.FILE_INPUT_LABEL}
        onChange={(event) => {
          trackSnapPhoto('click');
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
          trackSnapPhoto('camera');
          applyFile(firstAcceptedImageFile(event.target.files));
          event.target.value = '';
        }}
      />
      <div className={cn(SNAP_STAGE_SHELL_CLASS, SNAP_STAGE_MIN_HEIGHT_CLASS)}>{mainContent}</div>
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
