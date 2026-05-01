import { useEffect, useState } from 'react';

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const waitForWindowLoad = () => new Promise(resolve => {
  if (document.readyState === 'complete') {
    resolve();
    return;
  }
  window.addEventListener('load', resolve, { once: true });
});

const waitForFonts = () => {
  if (!document.fonts?.ready) return Promise.resolve();
  return document.fonts.ready.catch(() => undefined);
};

const nextPaint = () => new Promise(resolve => {
  requestAnimationFrame(() => requestAnimationFrame(resolve));
});

const waitForImage = image => new Promise(resolve => {
  if (!image || image.complete) {
    resolve();
    return;
  }
  const done = () => resolve();
  image.addEventListener('load', done, { once: true });
  image.addEventListener('error', done, { once: true });
});

const waitForCriticalImages = async () => {
  await nextPaint();
  const images = [...document.querySelectorAll('img[data-critical-image="true"]')];
  if (!images.length) return;
  await Promise.all(images.map(async image => {
    await waitForImage(image);
    if (image.decode) {
      await image.decode().catch(() => undefined);
    }
  }));
};

const AppLoader = () => {
  const [hasBootLoader] = useState(() => Boolean(document.getElementById('app-loader')));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loader = document.getElementById('app-loader');

    Promise.race([
      Promise.all([waitForWindowLoad(), waitForFonts(), waitForCriticalImages(), wait(900)]),
      wait(5200),
    ]).then(() => {
      if (cancelled) return;
      setReady(true);
      if (loader) {
        loader.classList.add('app-loader--done');
        window.setTimeout(() => loader.remove(), 520);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (ready || hasBootLoader) return null;

  return (
    <div className="app-loader-fallback" role="status" aria-live="polite" aria-label="Loading Ummah Directory">
      <div className="app-loader__inner">
        <div className="app-loader__brand">Ummah Directory</div>
        <div className="app-loader__line">
          <span></span>
        </div>
        <div className="app-loader__copy">Preparing the directory</div>
      </div>
    </div>
  );
};

export default AppLoader;
