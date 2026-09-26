(() => {
  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const formMessage = document.getElementById('form-message');
  const overlay = document.getElementById('oauth-overlay');
  const oauthWindow = document.getElementById('oauth-window');
  const oauthBrand = document.getElementById('oauth-brand');
  const oauthBody = document.getElementById('oauth-body');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const demoEmail = 'demo@nexusvpn.test';
  const demoPassword = 'VPNdemo123!';
  const demoGoogleEmail = 'alex@nexus.test';
  const demoGooglePassword = 'GoogleDemo123!';
  const demoAppleEmail = 'demo@icloud.test';
  const demoApplePassword = 'AppleDemo123!';
  const demoAppleCode = '246810';
  let previousFocus = null;
  let oauth = {};

  function clearErrors() {
    document.getElementById('email-error').textContent = '';
    document.getElementById('password-error').textContent = '';
    document.getElementById('email-shell').classList.remove('has-error');
    document.getElementById('password-shell').classList.remove('has-error');
    formMessage.textContent = '';
    formMessage.classList.remove('visible');
  }

  function setFieldError(field, message) {
    document.getElementById(`${field}-error`).textContent = message;
    document.getElementById(`${field}-shell`).classList.add('has-error');
  }

  function saveSession(method, email = '') {
    localStorage.setItem('nexus-vpn-demo-session', JSON.stringify({ method, email }));
    window.location.href = './success.html';
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    let invalid = false;

    if (!email) {
      setFieldError('email', 'กรุณากรอกอีเมล');
      invalid = true;
    } else if (!emailPattern.test(email)) {
      setFieldError('email', 'รูปแบบอีเมลไม่ถูกต้อง');
      invalid = true;
    }

    if (!password) {
      setFieldError('password', 'กรุณากรอกรหัสผ่าน');
      invalid = true;
    }

    if (invalid) return;

    if (email.toLowerCase() !== demoEmail || password !== demoPassword) {
      formMessage.textContent = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง';
      formMessage.classList.add('visible');
      passwordInput.value = '';
      passwordInput.focus();
      return;
    }

    saveSession('Email', email);
  });

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function openProvider(provider) {
    previousFocus = document.activeElement;
    oauth = { provider, stage: provider === 'Google Account' ? 'google-chooser' : 'apple-login', email: '', backStep: '', error: '', shareEmail: true };
    oauthWindow.className = `oauth-window ${provider === 'Google Account' ? 'google-window' : 'apple-window'}`;
    oauthBrand.innerHTML = provider === 'Google Account'
      ? '<svg class="oauth-google-logo" viewBox="0 0 48 48" aria-hidden="true"><path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.9 6.1-15Z"/><path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.2 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2A20 20 0 0 0 24 44Z"/><path fill="#FBBC05" d="M12.6 27.5a12 12 0 0 1 0-7V15H5.8a20 20 0 0 0 0 18l6.8-5.5Z"/><path fill="#EA4335" d="M24 12.1c3 0 5.7 1 7.8 3.1l5.9-5.9C34.1 6 29.5 4 24 4A20 20 0 0 0 5.8 15l6.8 5.5c1.6-4.8 6.1-8.4 11.4-8.4Z"/></svg><span>Google</span>'
      : '<svg class="oauth-apple-logo" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.2 12.8c0-2.5 2-3.7 2.1-3.8-1.2-1.8-3.1-2-3.8-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.8 1.3 10.2.9 1.2 1.9 2.4 3.1 2.4 1.3 0 1.8-.8 3.4-.8s2.1.8 3.4.8c1.4 0 2.2-1.2 3.1-2.4 1-1.4 1.4-2.7 1.4-2.8-.1 0-2.7-1-2.7-4.1ZM14.8 5.2c.8-1 1.3-2.4 1.2-3.8-1.2 0-2.5.8-3.3 1.8-.7.8-1.3 2.2-1.2 3.5 1.3.1 2.5-.6 3.3-1.5Z"/></svg><span>Apple</span>';
    overlay.hidden = false;
    document.body.classList.add('oauth-open');
    renderOAuth();
  }

  function closeProvider() {
    overlay.hidden = true;
    document.body.classList.remove('oauth-open');
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  }

  function showOAuthError(message) {
    const error = document.getElementById('oauth-error');
    if (!error) return;
    error.textContent = message;
    error.hidden = false;
  }

  function renderOAuth() {
    const email = escapeHTML(oauth.email);
    let content = '';

    if (oauth.stage === 'google-chooser') {
      content = `
        <div class="oauth-heading"><span class="oauth-small-mark">G</span><h2 id="oauth-title">Choose an account</h2><p>to continue to <b>NEXUS VPN</b></p></div>
        <div class="account-list">
          <button class="account-choice" type="button" data-action="google-demo-account"><span class="account-avatar">A</span><span><strong>Alex Morgan</strong><small>${demoGoogleEmail}</small></span><span class="account-arrow">›</span></button>
          <button class="account-choice" type="button" data-action="google-other-account"><span class="account-avatar account-avatar-outline">＋</span><span><strong>Use another account</strong></span><span class="account-arrow">›</span></button>
        </div>
        <p class="oauth-legal">To continue, Google will share your name, email address, and profile picture with NEXUS VPN.</p>`;
    } else if (oauth.stage === 'google-email') {
      content = `
        <div class="oauth-heading"><span class="oauth-small-mark">G</span><h2 id="oauth-title">Sign in</h2><p>Use your Google Account</p></div>
        <form class="oauth-form" data-oauth-form="google-email" novalidate>
        <label for="google-email">Email or phone</label><input id="google-email" type="email" autocomplete="username" value="${email}" placeholder="Email address">
          <small class="oauth-hint">Demo account: <b>${demoGoogleEmail}</b> · Password: <b>${demoGooglePassword}</b></small>
          <p class="oauth-error" id="oauth-error" hidden></p>
          <div class="oauth-actions"><button class="oauth-text-button" type="button" data-action="google-back">Back</button><button class="provider-primary" type="submit">Next</button></div>
        </form>`;
    } else if (oauth.stage === 'google-password') {
      content = `
        <div class="oauth-heading"><span class="oauth-small-mark">G</span><h2 id="oauth-title">Welcome</h2><p class="identity-chip">${email}</p></div>
        <form class="oauth-form" data-oauth-form="google-password" novalidate>
          <label for="google-password">Enter your password</label><input id="google-password" type="password" autocomplete="current-password" placeholder="Password">
          <small class="oauth-hint">Demo password: <b>${demoGooglePassword}</b></small>
          <p class="oauth-error" id="oauth-error" hidden></p>
          <div class="oauth-actions"><button class="oauth-text-button" type="button" data-action="google-back">Back</button><button class="provider-primary" type="submit">Next</button></div>
        </form>`;
    } else if (oauth.stage === 'google-consent') {
      content = `
        <div class="oauth-heading"><span class="oauth-small-mark">G</span><h2 id="oauth-title">NEXUS VPN wants to access your Google Account</h2><p class="identity-chip">${email || demoGoogleEmail}</p></div>
        <div class="permission-list"><div class="permission-row"><span class="permission-avatar">A</span><span><strong>View your basic profile info</strong><small>Name and profile picture</small></span><span class="permission-check">✓</span></div><div class="permission-row"><span class="permission-mail">@</span><span><strong>View your email address</strong><small>${email || demoGoogleEmail}</small></span><span class="permission-check">✓</span></div></div>
        <p class="oauth-legal">This demo shows a simulated Google consent screen. Your Google Account is not contacted.</p>
        <div class="oauth-actions"><button class="oauth-text-button" type="button" data-action="back-consent">Back</button><button class="provider-primary" type="button" data-action="google-approve">Continue</button></div>`;
    } else if (oauth.stage === 'apple-login') {
      content = `
        <div class="oauth-heading apple-heading"><h2 id="oauth-title">Sign in with your Apple Account</h2><p>Use your Apple Account to continue to <b>NEXUS VPN</b>.</p></div>
        <form class="oauth-form apple-form" data-oauth-form="apple-login" novalidate>
          <label for="apple-email">Apple Account</label><input id="apple-email" type="email" autocomplete="username" value="${email}" placeholder="name@example.com">
          <label for="apple-password">Password</label><input id="apple-password" type="password" autocomplete="current-password" placeholder="Password">
          <small class="oauth-hint">Demo: <b>${demoAppleEmail}</b> · <b>${demoApplePassword}</b></small>
          <p class="oauth-error" id="oauth-error" hidden></p>
          <button class="provider-primary apple-primary" type="submit">Continue</button>
        </form>
        <p class="oauth-legal apple-legal">Your Apple Account information is used only for this simulated sign-in.</p>`;
    } else if (oauth.stage === 'apple-verification') {
      content = `
        <div class="oauth-heading apple-heading"><div class="verification-symbol">•••</div><h2 id="oauth-title">Enter the verification code</h2><p>A verification code was sent to a trusted device signed in to your Apple Account.</p></div>
        <form class="oauth-form apple-form" data-oauth-form="apple-verification" novalidate>
          <label for="apple-code">Verification code</label><input id="apple-code" class="verification-input" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="● ● ● ● ● ●">
          <small class="oauth-hint">Demo verification code: <b>${demoAppleCode}</b></small>
          <p class="oauth-error" id="oauth-error" hidden></p>
          <div class="oauth-actions"><button class="oauth-text-button" type="button" data-action="apple-back">Back</button><button class="provider-primary apple-primary" type="submit">Continue</button></div>
        </form>`;
    } else if (oauth.stage === 'apple-consent') {
      content = `
        <div class="oauth-heading apple-heading"><h2 id="oauth-title">Continue with Apple</h2><p>Choose what to share with <b>NEXUS VPN</b>.</p></div>
        <div class="apple-identity"><span class="apple-avatar">${escapeHTML(email.slice(0, 1).toUpperCase() || 'D')}</span><span><strong>Demo User</strong><small>${email || demoAppleEmail}</small></span></div>
        <div class="share-options"><label class="share-option"><input type="radio" name="apple-email-choice" value="share" ${oauth.shareEmail ? 'checked' : ''}><span class="fake-radio"></span><span><strong>Share My Email</strong><small>${email || demoAppleEmail}</small></span></label><label class="share-option"><input type="radio" name="apple-email-choice" value="hide" ${!oauth.shareEmail ? 'checked' : ''}><span class="fake-radio"></span><span><strong>Hide My Email</strong><small>Use a private relay address</small></span></label></div>
        <p class="oauth-legal apple-legal">NEXUS VPN will use this information to create your account and sign you in.</p>
        <div class="oauth-actions"><button class="oauth-text-button" type="button" data-action="apple-back">Back</button><button class="provider-primary apple-primary" type="button" data-action="apple-approve">Continue</button></div>`;
    }

    oauthBody.innerHTML = content;
    const focusTarget = oauthBody.querySelector('input, .account-choice, [data-action]');
    if (focusTarget) focusTarget.focus();
  }

  oauthBody.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-action]');
    if (!actionButton) return;
    const action = actionButton.dataset.action;

    if (action === 'google-demo-account') {
      oauth.email = demoGoogleEmail;
      oauth.backStep = 'google-chooser';
      oauth.stage = 'google-consent';
    } else if (action === 'google-other-account') {
      oauth.stage = 'google-email';
    } else if (action === 'google-back') {
      oauth.stage = oauth.stage === 'google-password' ? 'google-email' : 'google-chooser';
    } else if (action === 'back-consent') {
      oauth.stage = oauth.backStep || 'google-chooser';
    } else if (action === 'google-approve') {
      saveSession('Google Account', oauth.email || demoGoogleEmail);
      return;
    } else if (action === 'apple-back') {
      oauth.stage = oauth.stage === 'apple-consent' ? 'apple-verification' : 'apple-login';
    } else if (action === 'apple-approve') {
      const returnedEmail = oauth.shareEmail ? oauth.email : 'nexus-vpn@privaterelay.appleid.com';
      saveSession('Apple ID', returnedEmail);
      return;
    }

    oauth.error = '';
    renderOAuth();
  });

  oauthBody.addEventListener('change', (event) => {
    if (event.target.name === 'apple-email-choice') oauth.shareEmail = event.target.value === 'share';
  });

  oauthBody.addEventListener('submit', (event) => {
    const oauthForm = event.target.closest('[data-oauth-form]');
    if (!oauthForm) return;
    event.preventDefault();
    const formType = oauthForm.dataset.oauthForm;

    if (formType === 'google-email') {
      const email = document.getElementById('google-email').value.trim();
      if (!emailPattern.test(email)) {
        showOAuthError(email ? 'Enter a valid email address.' : 'Enter an email address or phone number.');
        return;
      }
      oauth.email = email;
      oauth.stage = 'google-password';
    } else if (formType === 'google-password') {
      const password = document.getElementById('google-password').value;
      if (!password) {
        showOAuthError('Enter your password.');
        return;
      }
      if (oauth.email.toLowerCase() !== demoGoogleEmail || password !== demoGooglePassword) {
        showOAuthError('Wrong email or password. Try again.');
        return;
      }
      oauth.backStep = 'google-password';
      oauth.stage = 'google-consent';
    } else if (formType === 'apple-login') {
      const email = document.getElementById('apple-email').value.trim();
      const password = document.getElementById('apple-password').value;
      if (!emailPattern.test(email)) {
        showOAuthError(email ? 'Enter a valid Apple Account email address.' : 'Enter your Apple Account email address.');
        document.getElementById('apple-email').focus();
        return;
      }
      if (!password) {
        showOAuthError('Enter your Apple Account password.');
        document.getElementById('apple-password').focus();
        return;
      }
      if (email.toLowerCase() !== demoAppleEmail || password !== demoApplePassword) {
        showOAuthError('Your Apple Account or password is incorrect. Try again.');
        return;
      }
      oauth.email = email;
      oauth.stage = 'apple-verification';
    } else if (formType === 'apple-verification') {
      const code = document.getElementById('apple-code').value.trim();
      if (code !== demoAppleCode) {
        showOAuthError('The verification code is incorrect. Enter the demo code shown above.');
        return;
      }
      oauth.stage = 'apple-consent';
    }

    oauth.error = '';
    renderOAuth();
  });

  document.querySelectorAll('.social-button').forEach((button) => {
    button.addEventListener('click', () => openProvider(button.dataset.provider));
  });

  document.getElementById('oauth-close').addEventListener('click', closeProvider);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeProvider();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !overlay.hidden) closeProvider();
  });

  document.getElementById('toggle-password').addEventListener('click', (event) => {
    const button = event.currentTarget;
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    button.textContent = isHidden ? 'ซ่อน' : 'แสดง';
    button.setAttribute('aria-label', isHidden ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน');
  });

  emailInput.addEventListener('input', clearErrors);
  passwordInput.addEventListener('input', clearErrors);
})();
