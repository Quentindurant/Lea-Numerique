document.addEventListener('DOMContentLoaded', function() {
    // Navigation scroll effect
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    let lastScrollTop = 0;
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
            // Scrolling down & past threshold
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up or at top
            header.style.transform = 'translateY(0)';
            if (currentScroll > 100) {
                header.style.background = '#ffffff';
                header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });

    // Menu mobile
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Fermer le menu mobile lors du clic sur un lien
    const mobileLinks = document.querySelectorAll('.nav-links a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });

    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupération des valeurs du formulaire
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Ici, vous pouvez ajouter le code pour envoyer les données à votre backend
            console.log('Données du formulaire :', data);

            // Afficher un message de confirmation
            alert('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
            contactForm.reset();
        });
    }

    // Animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.solution-card, .stat-item');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const isVisible = (elementTop < window.innerHeight) && (elementBottom >= 0);
            
            if (isVisible) {
                element.classList.add('animate');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check

    // Animation du header au scroll
    // let lastScroll = 0;

    // window.addEventListener('scroll', () => {
    //     const currentScroll = window.pageYOffset;

    //     if (currentScroll <= 0) {
    //         header.classList.remove('scroll-up');
    //         return;
    //     }

    //     if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
    //         // Scroll vers le bas
    //         header.classList.remove('scroll-up');
    //         header.classList.add('scroll-down');
    //     } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
    //         // Scroll vers le haut
    //         header.classList.remove('scroll-down');
    //         header.classList.add('scroll-up');
    //     }
    //     lastScroll = currentScroll;
    // });

    // Add CSS class for animations
    const style = document.createElement('style');
    style.textContent = `
        .solution-card, .stat-item {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .solution-card.animate, .stat-item.animate {
            opacity: 1;
            transform: translateY(0);
        }

        .nav-links.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 80px;
            left: 0;
            right: 0;
            background: white;
            padding: 1rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .nav-links.active a {
            margin: 0.5rem 0;
        }

        .menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }

        .menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }

        .menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }

        .header {
            transition: transform 0.3s ease;
        }

        .header.scroll-down {
            transform: translateY(-100%);
        }

        .header.scroll-up {
            transform: translateY(0);
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        @media (max-width: 768px) {
            .nav-links {
                display: none;
                width: 100%;
                text-align: center;
            }

            .menu-toggle {
                display: block;
            }

            .nav-links.active {
                display: flex;
                animation: slideDown 0.3s ease forwards;
            }
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
