import { Suspense } from 'react';
import { SnapBgVideo } from './snap-bg-video';
import { SnapHeader } from './snap-header';
import { SnapUploadPanel } from './snap-upload-panel';

export default function Snap() {
  return (
    <section className="border-edge/60 bg-canvas relative isolate flex flex-1 flex-col overflow-hidden border-b py-8 sm:py-10 lg:py-12">
      <SnapBgVideo />
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
