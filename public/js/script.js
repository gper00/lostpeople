try {
    const aboutBtn = document.getElementById('about-btn')
    const contactBtn = document.getElementById('contact-btn')
    const aboutSection = document.getElementById('about-section')
    const contactSection = document.getElementById('contact-section')

    aboutBtn.onclick = (e) => {
        e.preventDefault()

        aboutBtn.classList.add('active')
        aboutSection.classList.remove('d-none')
        contactBtn.classList.remove('active')
        contactSection.classList.add('d-none')
    }
    contactBtn.onclick = (e) => {
        e.preventDefault()

        contactBtn.classList.add('active')
        contactSection.classList.remove('d-none')
        aboutBtn.classList.remove('active')
        aboutSection.classList.add('d-none')
    }
} catch (error) {
    console.log(error)
}

// Contact form
try {
    const scriptURL =
        'https://script.google.com/macros/s/AKfycbzt54iJ4fwGDJEbR2ds7jIIXrlaaenojLz2-S-4sy1SGe5bv0LNviy_CYrV6Whw57k/exec'
    const form = document.forms['contact-form']
    const input = {
        name: document.querySelector('#name'),
        email: document.querySelector('#email'),
        message: document.querySelector('#message')
    }
    let nameValidation = null
    let emailValidation = null
    let messageValidation = null
    const button = document.querySelector('#button')
    const alert = document.querySelector('#alert')
    const alertFailed = document.querySelector('#alert-danger')

    form.addEventListener('submit', (e) => {
        e.preventDefault()

        button.innerHTML = 'Loading...'
        button.setAttribute('disabled', '')

        if (!input.name.value.length) {
            nameValidation = 'Fullname is required'
        } else if (input.name.value.length < 5) {
            nameValidation = 'Fullname should not less then 5 chars'
        } else if (input.name.value.length > 50) {
            nameValidation = 'Fullname should not more then 50 chars'
        } else {
            nameValidation = null
        }
        if (nameValidation) {
            input.name.classList.add('is-invalid')
            document.querySelector('#name-validation').innerHTML =
                nameValidation
        } else {
            input.name.classList.remove('is-invalid')
        }

        if (!input.email.value.length) {
            emailValidation = 'Email is required'
        } else {
            emailValidation = null
        }
        if (emailValidation) {
            input.email.classList.add('is-invalid')
            document.querySelector('#email-validation').innerHTML =
                emailValidation
        } else {
            input.email.classList.remove('is-invalid')
        }

        if (!input.message.value.length) {
            messageValidation = 'Message is required'
        } else if (input.message.value.length < 10) {
            messageValidation = 'Message should not less then 10 chars'
        } else if (input.message.value.length > 750) {
            messageValidation = 'Message should not more then 750 chars'
        } else {
            messageValidation = null
        }
        if (messageValidation) {
            input.message.classList.add('is-invalid')
            document.querySelector('#message-validation').innerHTML =
                messageValidation
        } else {
            input.message.classList.remove('is-invalid')
        }

        if (nameValidation || emailValidation || messageValidation) {
            button.innerHTML = 'Submit'
            button.removeAttribute('disabled')
            return
        } else {
            fetch(scriptURL, { method: 'POST', body: new FormData(form) })
                .then((response) => {
                    console.log(response)

                    alert.classList.add('show')
                    alert.classList.remove('d-none')
                    button.innerHTML = 'Submit'
                    button.removeAttribute('disabled')
                    form.reset()
                })
                .catch((error) => {
                    console.error('Error!', error.message)

                    alertFailed.classList.add('show')
                    alertFailed.classList.remove('d-none')
                    button.innerHTML = 'Submit'
                    button.removeAttribute('disabled')
                })
        }
    })
} catch (error) {
    console.log(error)
}

// Additional JavaScript for header and footer functionality

// Theme Toggle Function
function toggleTheme() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    const currentTheme = html.getAttribute('data-bs-theme');

    if (currentTheme === 'dark') {
        html.setAttribute('data-bs-theme', 'light');
        themeIcon.className = 'bi bi-sun-fill';
        localStorage.setItem('theme', 'light');
    } else {
        html.setAttribute('data-bs-theme', 'dark');
        themeIcon.className = 'bi bi-moon-fill';
        localStorage.setItem('theme', 'dark');
    }
}

// Initialize theme on page load
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-bs-theme', theme);
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
    }
}

// Back to Top Button Functionality
function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');

    if (backToTopButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.remove('d-none');
                backToTopButton.classList.add('d-block');
            } else {
                backToTopButton.classList.remove('d-block');
                backToTopButton.classList.add('d-none');
            }
        });
    }
}

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeBackToTop();

    // Close mobile menu when clicking on nav links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.getElementById('navbarNav');

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            const theme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-bs-theme', theme);
            const themeIcon = document.getElementById('theme-icon');
            if (themeIcon) {
                themeIcon.className = theme === 'dark' ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
            }
        }
    });
}
