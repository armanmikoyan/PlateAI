'use client';

import { atom } from 'jotai';
import { SNAP_ANALYSIS_STATUS } from './constants';
import type { SnapAnalysisState, SnapPhoto } from './types';

export const snapPhotoAtom = atom<SnapPhoto | null>(null);
export const snapAnalysisAtom = atom<SnapAnalysisState>({ STATUS: SNAP_ANALYSIS_STATUS.IDLE });
export const snapResumeAnalysisIdAtom = atom<string | null>(null);
