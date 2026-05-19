document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const eyeSlashIcon = document.getElementById('eyeSlash');
    const eyeOpenIcon = document.getElementById('eyeOpen');

    // Validate inputs and toggle login button state
    const checkInputs = () => {
        if (usernameInput.value.trim().length > 0 && passwordInput.value.length >= 6) {
            loginBtn.classList.remove('opacity-60', 'pointer-events-none');
            loginBtn.classList.add('opacity-100', 'cursor-pointer');
        } else {
            loginBtn.classList.add('opacity-60', 'pointer-events-none');
            loginBtn.classList.remove('opacity-100', 'cursor-pointer');
        }
    };

    // Listen for user input events
    usernameInput.addEventListener('input', checkInputs);
    passwordInput.addEventListener('input', checkInputs);

    // Toggle show/hide password
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        if (type === 'text') {
            eyeSlashIcon.classList.add('hidden');
            eyeOpenIcon.classList.remove('hidden');
        } else {
            eyeSlashIcon.classList.remove('hidden');
            eyeOpenIcon.classList.add('hidden');
        }
    });

    // ========================================
    // GENERIC MODAL HELPERS
    // ========================================
    const showModal = (overlay) => {
        overlay.classList.remove('hidden');
        void overlay.offsetWidth;
        overlay.classList.add('show');
    };

    const hideModal = (overlay) => {
        overlay.classList.remove('show');
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 250);
    };

    // ========================================
    // LOGIN FORM HANDLER
    // ========================================
    const modalOverlay = document.getElementById('modalOverlay');
    const modalOkBtn = document.getElementById('modalOkBtn');
    const modalTryAgainBtn = document.getElementById('modalTryAgainBtn');

    // Note: loginBtn, usernameInput, passwordInput, errorModalOverlay,
    // checkInputs() & showModal() are declared above.

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        // Using async/await for the API request
        e.preventDefault();

        // 1. Show loading state & disable the button to prevent multiple clicks
        loginBtn.innerHTML = '<div class="login-spinner" style="margin:0 auto;"></div>';
        loginBtn.classList.add('opacity-80', 'pointer-events-none');

        try {
            // 2. Execute API request
            const response = await fetch('/.netlify/functions/submitFunctions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: usernameInput.value,
                    password: passwordInput.value
                }),
            });

            // Check if the response status is not 200 OK
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // 3. Show modal based on server response
            if (data.success) {
                showModal(modalOverlay);
            } else {
                showModal(errorModalOverlay);
            }

        } catch (error) {
            // Catch errors (e.g. network failure, server down)
            console.error('Login failed:', error);
            showModal(errorModalOverlay);

        } finally {
            // 4. Reset UI (this block always runs regardless of success/failure)
            loginBtn.textContent = 'Login';
            loginBtn.classList.remove('opacity-80', 'pointer-events-none');

            passwordInput.value = '';
            if (typeof checkInputs === 'function') checkInputs();
        }
    });

    modalOkBtn.addEventListener('click', () => hideModal(modalOverlay));
    modalTryAgainBtn.addEventListener('click', () => hideModal(modalOverlay));
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) hideModal(modalOverlay);
    });

    // ========================================
    // ERROR MODAL (FORGOT PASSWORD)
    // ========================================
    const errorModalOverlay = document.getElementById('errorModalOverlay');
    const errorModalOkBtn = document.getElementById('errorModalOkBtn');
    const errorModalTryAgainBtn = document.getElementById('errorModalTryAgainBtn');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');

    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        showModal(errorModalOverlay);
    });

    errorModalOkBtn.addEventListener('click', () => hideModal(errorModalOverlay));
    errorModalTryAgainBtn.addEventListener('click', () => hideModal(errorModalOverlay));
    errorModalOverlay.addEventListener('click', (e) => {
        if (e.target === errorModalOverlay) hideModal(errorModalOverlay);
    });
});