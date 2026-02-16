// Ensure initial theme
if (!document.documentElement.getAttribute('data-theme')) {
    document.documentElement.setAttribute('data-theme', 'light');
}
// Close modal on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('active');
                }
            });
        });
function showToast(message, type = 'success', title = '') {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            
            const icons = {
                success: '✅',
                error: '❌',
                warning: '⚠️',
                info: 'ℹ️'
            };
            
            const titles = {
                success: title || 'Success!',
                error: title || 'Error!',
                warning: title || 'Warning!',
                info: title || 'Info'
            };
            
            toast.innerHTML = `
                <div class="toast-icon">${icons[type]}</div>
                <div class="toast-content">
                    <div class="toast-title">${titles[type]}</div>
                    <div class="toast-message">${message}</div>
                </div>
            `;
            
            container.appendChild(toast);
            
            setTimeout(() => {
                toast.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        // Theme Toggle
        function toggleTheme() {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            
            const icon = newTheme === 'dark' ? '☀️' : '🌙';
            document.getElementById('themeIcon').textContent = icon;
            
            // Update auth page icons if they exist
            const authIcon1 = document.getElementById('themeIconAuth');
            const authIcon2 = document.getElementById('themeIconAuth2');
            if (authIcon1) authIcon1.textContent = icon;
            if (authIcon2) authIcon2.textContent = icon;
            
            if (isLoggedIn) {
                showToast(`Switched to ${newTheme} mode`, 'info');
            }
        }

        function openModal(modalId) {
            document.getElementById(modalId).classList.add('active');
        }
        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }
        // Navigation
        function showPage(page) {
            document.querySelectorAll('[id$="Page"]').forEach(p => p.classList.add('hidden'));
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
            
            const pageMap = {
                'dashboard': 0,
                'calendar': 1,
                'patients': 2,
                'profile': 3
            };
            
            document.getElementById(page + 'Page').classList.remove('hidden');
            document.querySelectorAll('.nav-btn')[pageMap[page]].classList.add('active');
            
            if (page === 'calendar') renderCalendar();
            if (page === 'patients') renderPatientsTable();
            if (page === 'profile') updateProfilePage();
        }