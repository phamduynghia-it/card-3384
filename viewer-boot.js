const HOME_ENTRY = './build/assets/home-BHIVrSJRE.js';

function getAppPage() {
  const app = document.getElementById('app');
  if (!app) return null;
  try {
    return { app, page: JSON.parse(app.getAttribute('data-page')) };
  } catch {
    return null;
  }
}

function syncPageUrl(page) {
  if (!page || typeof page !== 'object') return;
  page.url = location.pathname + location.search + location.hash;
}

function showViewerOpenPrompt() {
  const el = document.getElementById('loverain-viewer-loading');
  if (!el || el.dataset.dismissed === '1' || el.dataset.ready === '1') return;
  el.dataset.ready = '1';
  el.classList.add('loverain-viewer-loading--ready');
  el.setAttribute('aria-busy', 'false');
  const btn = document.getElementById('loverainViewerOpenBtn');
  if (btn) btn.hidden = false;
}

function hideViewerLoading() {
  const el = document.getElementById('loverain-viewer-loading');
  if (!el || el.dataset.dismissed === '1') return;
  el.dataset.dismissed = '1';
  el.classList.add('loverain-viewer-loading--hidden');
  el.setAttribute('aria-busy', 'false');
  window.setTimeout(() => el.remove(), 500);
}

function notifyPreviewAudioReady() {
  window.__LOVERAIN_PREVIEW_AUDIO_READY__ = true;
  window.dispatchEvent(new CustomEvent('loverain-preview-audio'));
}

function openViewerFromLoading() {
  hideViewerLoading();
  window.__LOVERAIN_VIEWER_OPENED__ = true;
  notifyPreviewAudioReady();
  window.dispatchEvent(new CustomEvent('loverain-viewer-opened'));
}

function initViewerOpenButton() {
  const btn = document.getElementById('loverainViewerOpenBtn');
  if (!btn || btn.dataset.bound === '1') return;
  btn.dataset.bound = '1';
  btn.addEventListener('click', openViewerFromLoading);
}

window.addEventListener('loverain-viewer-ready', showViewerOpenPrompt, { once: true });
initViewerOpenButton();

async function boot() {
  const ctx = getAppPage();
  if (ctx?.page) syncPageUrl(ctx.page);
  if (ctx?.app && ctx?.page) {
    ctx.app.setAttribute('data-page', JSON.stringify(ctx.page));
  }

  if (ctx?.page?.props?.client) {
     const client = ctx.page.props.client;
     window.__LOVERAIN_PREVIEW_AUDIO__ = {
       type_music: client.type_music || 'system',
       music: client.music
     };
  }

  try {
    const textEl = document.getElementById('loverainViewerLoadingText');
    if (textEl) textEl.textContent = 'Đang dựng hiệu ứng mưa…';
    
    await import(HOME_ENTRY);
    window.setTimeout(showViewerOpenPrompt, 2000); 
  } catch (e) {
    console.error('[LoveRain viewer] boot', e);
  }
}

boot();
