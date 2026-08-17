const toast = document.getElementById('toast');
let toastTimer;

function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3600);
}

document.querySelectorAll('[data-action]').forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const messages = {
      'new-campaign': 'Campaign brief workspace is ready. Privileged creation remains server-side and starts paused.',
      review: 'Approval review opened. No campaign will spend until an authorized administrator confirms launch.',
      refresh: 'Asset status refresh requested. The protected backend will return only authorized assets.',
      'select-assets': 'Asset selector opened. Client visibility is limited by tenant authorization.',
      payments: 'Finance center is protected. Payment operations will require verified provider webhooks and approval.'
    };
    notify(messages[action] || 'This protected workflow is being prepared.');
  });
});

document.querySelectorAll('.nav-link[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
  });
});

const API_ORIGIN = 'https://bayezid-agency-api.sayadmdbayezidhosan.workers.dev';
const apiStatus = document.getElementById('api-status');

async function checkBackend() {
  try {
    const response = await fetch(`${API_ORIGIN}/api/console/health`, { headers: { Accept: 'application/json' } });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error('health check failed');
    const metaReady = result.console?.metaBusinessTokenConfigured;
    apiStatus.innerHTML = `<span class="status-dot"></span><span>${metaReady ? 'Backend protected' : 'Backend online · setup pending'}</span>`;
    apiStatus.title = metaReady ? 'Protected backend is online.' : 'Backend is online; META_BM_TOKEN still needs to be added in Cloudflare.';
  } catch {
    apiStatus.innerHTML = '<span class="status-dot" style="background:#ff967c"></span><span>Backend unavailable</span>';
    apiStatus.title = 'The protected backend health endpoint could not be reached.';
  }
}

checkBackend();
