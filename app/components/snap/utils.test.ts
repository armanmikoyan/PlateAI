import { describe, expect, it } from 'vitest';
import { DEVICE_TYPE } from '@/lib/device-detection/types';
import { SNAP, SNAP_ANALYSIS_STATUS, SNAP_HEADING_PHASE } from './constants';
import {
  fileFromJpegDataUrl,
  firstAcceptedImageFile,
  snapHeadingCopy,
  snapHeadingPhase,
} from './utils';

describe('firstAcceptedImageFile', () => {
  it('returns the first file without checking mime type', () => {
    const file = new File([], 'meal.jpg', { type: '' });
    const list = {
      length: 1,
      item: (index: number) => (index === 0 ? file : null),
    } as FileList;

    expect(firstAcceptedImageFile(list)).toBe(file);
  });

  it('returns null for empty lists', () => {
    expect(firstAcceptedImageFile(null)).toBeNull();
  });
});

describe('fileFromJpegDataUrl', () => {
  it('builds a jpeg file from a data url', async () => {
    const dataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wAAAA==';
    const file = await fileFromJpegDataUrl(dataUrl, 'plate.jpg');

    expect(file.name).toBe('plate.jpg');
    expect(file.type).toBe('image/jpeg');
    expect(file.size).toBeGreaterThan(0);
  });
});

describe('snapHeadingCopy', () => {
  it('uses idle copy when no photo is selected', () => {
    expect(snapHeadingCopy(null, { STATUS: SNAP_ANALYSIS_STATUS.IDLE }, DEVICE_TYPE.DESKTOP)).toEqual({
      PHASE: SNAP_HEADING_PHASE.IDLE,
      TITLE: SNAP.TITLE,
      SUBTITLE: SNAP.SUBTITLE,
    });
  });

  it('uses photo ready copy when a photo is waiting to analyze', () => {
    expect(
      snapHeadingPhase({ FILE: new File([], 'plate.jpg'), PREVIEW_URL: 'blob:test' }, { STATUS: SNAP_ANALYSIS_STATUS.IDLE }),
    ).toBe(SNAP_HEADING_PHASE.PHOTO_READY);

    expect(
      snapHeadingCopy(
        { FILE: new File([], 'plate.jpg'), PREVIEW_URL: 'blob:test' },
        { STATUS: SNAP_ANALYSIS_STATUS.IDLE },
        DEVICE_TYPE.DESKTOP,
      ).TITLE,
    ).toBe(SNAP.HEADING_PHOTO_READY_TITLE);
  });

  it('uses analyzing copy while loading', () => {
    const photo = { FILE: new File([], 'plate.jpg'), PREVIEW_URL: 'blob:test' };

    expect(
      snapHeadingCopy(photo, { STATUS: SNAP_ANALYSIS_STATUS.LOADING }, DEVICE_TYPE.DESKTOP),
    ).toEqual({
      PHASE: SNAP_HEADING_PHASE.LOADING,
      TITLE: SNAP.HEADING_LOADING_TITLE,
      SUBTITLE: SNAP.HEADING_LOADING_SUBTITLE,
    });
  });

  it('uses locked copy after success', () => {
    const photo = { FILE: new File([], 'plate.jpg'), PREVIEW_URL: 'blob:test' };

    expect(
      snapHeadingCopy(photo, { STATUS: SNAP_ANALYSIS_STATUS.SUCCESS }, DEVICE_TYPE.DESKTOP),
    ).toEqual({
      PHASE: SNAP_HEADING_PHASE.SUCCESS,
      TITLE: SNAP.HEADING_LOCKED_TITLE,
      SUBTITLE: SNAP.HEADING_LOCKED_SUBTITLE,
    });
  });

  it('uses not detected copy after error', () => {
    expect(
      snapHeadingCopy(
        { FILE: new File([], 'plate.jpg'), PREVIEW_URL: 'blob:test' },
        { STATUS: SNAP_ANALYSIS_STATUS.ERROR, MESSAGE: SNAP.ANALYSIS_ERROR },
        DEVICE_TYPE.DESKTOP,
      ).TITLE,
    ).toBe(SNAP.HEADING_NOT_DETECTED_TITLE);
  });
});
