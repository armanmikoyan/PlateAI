import { describe, expect, it } from 'vitest';
import { mealAnalysisImageUrl } from './image';

describe('mealAnalysisImageUrl', () => {
  it('points at the authenticated image endpoint for the analysis id', () => {
    expect(mealAnalysisImageUrl('64f0c8f3a1b2c3d4e5f6a7b8')).toBe(
      '/api/meal-analyses/64f0c8f3a1b2c3d4e5f6a7b8/image',
    );
  });

  it('encodes ids that would otherwise break the path', () => {
    expect(mealAnalysisImageUrl('a/b c')).toBe('/api/meal-analyses/a%2Fb%20c/image');
  });
});