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
