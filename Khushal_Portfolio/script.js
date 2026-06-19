document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       MOBILE NAVIGATION MENU
       ========================================================================== */
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileNavToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileNavToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars';
        }
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileNavToggle.querySelector('i').className = 'fa-solid fa-bars';
        });
    });


    /* ==========================================================================
       HEADER SCROLL STATE
       ========================================================================== */
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    /* ==========================================================================
       SCROLL REVEAL & INTERSECTION OBSERVER
       ========================================================================== */
    const sections = document.querySelectorAll('.section, .reveal');
    const scrollLinks = document.querySelectorAll('.nav-link');
    
    let skillsAnimated = false;
    let statsAnimated = false;

    const sectionObserverOptions = {
        root: null,
        threshold: 0.05, // Trigger when 5% of section is visible
        rootMargin: '0px'
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Trigger Skills animation when skills section enters view
                if (entry.target.id === 'skills' && !skillsAnimated) {
                    animateSkills();
                    skillsAnimated = true;
                }

                // Trigger Stats counter when achievements section enters view
                if (entry.target.id === 'achievements' && !statsAnimated) {
                    animateStats();
                    statsAnimated = true;
                }
            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    /* ==========================================================================
       SCROLL SPY (ACTIVE NAV LINK)
       ========================================================================== */
    const spySections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 150; // offset for sticky header

        spySections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        scrollLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    /* ==========================================================================
       SKILLS PROGRESS BARS & COUNT-UP ANIMATION
       ========================================================================== */
    const animateSkills = () => {
        const skillFills = document.querySelectorAll('.skill-fill');
        const skillPcts = document.querySelectorAll('.skill-pct');

        // Animate fill width
        skillFills.forEach(fill => {
            const container = fill.closest('.skill-item');
            const pctText = container.querySelector('.skill-pct');
            const targetPct = pctText.getAttribute('data-target');
            fill.style.width = `${targetPct}%`;
        });

        // Animate percentage text count-up
        skillPcts.forEach(pctElement => {
            const target = parseInt(pctElement.getAttribute('data-target'), 10);
            const duration = 1200; // 1.2s duration
            let startTime = null;

            const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = timestamp - startTime;
                const percentage = Math.min(progress / duration, 1);
                
                // Ease out curve
                const currentVal = Math.floor(target * (1 - Math.pow(2, -10 * percentage)));
                
                pctElement.textContent = `${percentage === 1 ? target : currentVal}%`;

                if (progress < duration) {
                    requestAnimationFrame(step);
                } else {
                    pctElement.textContent = `${target}%`;
                }
            };
            requestAnimationFrame(step);
        });
    };


    /* ==========================================================================
       ACHIEVEMENTS STAT COUNTERS ANIMATION
       ========================================================================== */
    const animateStats = () => {
        const statNums = document.querySelectorAll('.stat-num');

        statNums.forEach(statElement => {
            const target = parseInt(statElement.getAttribute('data-val'), 10);
            const duration = 1500; // 1.5s duration
            let startTime = null;

            const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = timestamp - startTime;
                const percentage = Math.min(progress / duration, 1);
                
                // Ease out curve
                const currentVal = Math.floor(target * (1 - Math.pow(2, -10 * percentage)));
                
                statElement.textContent = percentage === 1 ? target : currentVal;

                if (progress < duration) {
                    requestAnimationFrame(step);
                } else {
                    statElement.textContent = target;
                }
            };
            requestAnimationFrame(step);
        });
    };


    /* ==========================================================================
       PROJECTS CATEGORY FILTER
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Reset card reveal animation state
                card.classList.remove('active');

                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hide');
                    // Small delay to trigger animation
                    setTimeout(() => {
                        card.classList.add('active');
                    }, 50);
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // Make sure initial project grid is activated (the ones currently visible)
    setTimeout(() => {
        projectCards.forEach(card => {
            if (!card.classList.contains('hide')) {
                card.classList.add('active');
            }
        });
    }, 500);


    /* ==========================================================================
       CERTIFICATIONS 3D MOUSE-TILT EFFECT
       ========================================================================== */
    const certCards = document.querySelectorAll('.cert-card');

    certCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const cardWidth = cardRect.width;
            const cardHeight = cardRect.height;
            
            // Cursor coordinates relative to the center of the card
            const centerX = cardRect.left + cardWidth / 2;
            const centerY = cardRect.top + cardHeight / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            // Normalize tilt coefficients (maximum 8 degrees of rotation)
            const rotateX = (-mouseY / (cardHeight / 2)) * 8;
            const rotateY = (mouseX / (cardWidth / 2)) * 8;
            
            // Apply translation offset for depth
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            // Smoothly snap back to flat position
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });


    /* ==========================================================================
       CONTACT FORM VALIDATION & INTERACTIVE SUBMISSION
       ========================================================================== */
    const contactForm = document.getElementById('portfolio-contact-form');
    const feedbackMsg = document.getElementById('form-feedback-message');
    const submitBtn = document.getElementById('btn-submit-form');
    const inputs = contactForm.querySelectorAll('.form-input');

    // Float label visual state handler
    inputs.forEach(input => {
        // Run on load in case browser pre-fills
        if (input.value.trim() !== '') {
            input.setAttribute('placeholder', ' ');
        }
        
        input.addEventListener('blur', () => {
            if (input.value.trim() !== '') {
                input.setAttribute('placeholder', ' ');
            }
        });
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const subject = document.getElementById('form-subject').value.trim();
        const message = document.getElementById('form-message').value.trim();

        // Simple validation check
        if (!name || !email || !subject || !message) {
            showFeedback('Please fill out all fields.', 'error');
            return;
        }

        // Change button state to sending
        submitBtn.disabled = true;
        const origBtnHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Sending Message...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;
        feedbackMsg.textContent = '';
        feedbackMsg.className = 'form-feedback';

        // Simulate sending animation (1.5s)
        setTimeout(() => {
            // Open local mail client
            const mailtoUrl = `mailto:khushalkumarsk@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " <" + email + ">\n\n" + message)}`;
            window.location.href = mailtoUrl;

            // Display success
            showFeedback('Redirecting to mail client to send message...', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Restore button
            submitBtn.disabled = false;
            submitBtn.innerHTML = origBtnHtml;
        }, 1500);
    });

    const showFeedback = (text, type) => {
        feedbackMsg.textContent = text;
        feedbackMsg.className = `form-feedback ${type}`;
        
        // Hide after 5 seconds
        setTimeout(() => {
            feedbackMsg.textContent = '';
            feedbackMsg.className = 'form-feedback';
        }, 5000);
    };

});
