import { Suspense } from 'react';
import { SnapHeader } from './snap-header';
import { SnapUploadPanel } from './snap-upload-panel';

export default function Snap() {
  return (
    <section className="border-edge/60 flex flex-1 flex-col border-b bg-canvas py-8 sm:py-10 lg:py-12">
      <div className="layout-page-shell flex flex-1 flex-col">
        <SnapHeader />
        <div className="mt-8 flex min-w-0 flex-col md:mt-10 lg:min-h-0 lg:flex-1">
          <Suspense fallback={null}>
            <SnapUploadPanel />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
