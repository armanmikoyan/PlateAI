'use client';

import { useSyncExternalStore } from 'react';

import { DEVICE_TYPE, type DeviceType } from './types';
import { detectDeviceType, readDeviceHints } from './utils';

export function useDeviceType(): DeviceType {
  return useSyncExternalStore(
    () => () => {},
    () => detectDeviceType(readDeviceHints()),
    () => DEVICE_TYPE.DESKTOP,
  );
}
