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

    /* ==========================================================================
       CONTACT FORM ENHANCEMENTS & API SUBMISSIONS
       ========================================================================== */
    const textarea = document.getElementById('form-message');
    const charCounter = document.getElementById('message-char-counter');
    const templatePills = document.querySelectorAll('.template-pill');
    const formSubject = document.getElementById('form-subject');
    const formMessage = document.getElementById('form-message');

    // 1. Toast Notification Helper
    const showToast = (message, type = 'info') => {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        
        let iconHtml = '<i class="fa-solid fa-circle-info"></i>';
        if (type === 'success') iconHtml = '<i class="fa-solid fa-circle-check"></i>';
        if (type === 'error') iconHtml = '<i class="fa-solid fa-triangle-exclamation"></i>';
        
        toast.innerHTML = `<span class="toast-icon ${type}">${iconHtml}</span> <span>${message}</span>`;
        toastContainer.appendChild(toast);
        
        // Trigger active slide-in
        setTimeout(() => toast.classList.add('active'), 50);
        
        // Remove after 4s
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    };

    // 2. Character Counter
    textarea.addEventListener('input', () => {
        const remaining = textarea.value.length;
        charCounter.textContent = `${remaining} / 1000`;
        
        if (remaining >= 900) {
            charCounter.className = 'char-counter error';
        } else if (remaining >= 750) {
            charCounter.className = 'char-counter warning';
        } else {
            charCounter.className = 'char-counter';
        }
    });

    // 3. Quick Templates
    const templates = {
        collab: {
            subject: 'Collaboration Opportunity - [Your Project Name]',
            body: 'Hi Khushal,\n\nI was looking through your portfolio and saw your projects. I\'d love to collaborate on a new project relating to [insert topic]. Let me know if you are interested!\n\nBest regards,\n[Your Name]'
        },
        internship: {
            subject: 'Internship / Job Inquiry - [Company Name]',
            body: 'Dear Khushal,\n\nI am writing to inquire about your availability for Data Science / Python Developer roles. We are impressed by your work as a Google Gemini Student Ambassador.\n\nSincerely,\n[Your Name]'
        },
        hello: {
            subject: 'Just wanted to say Hello!',
            body: 'Hi Khushal,\n\nJust visiting your portfolio and wanted to reach out to say hello! Your projects look fantastic.\n\nCheers,\n[Your Name]'
        }
    };

    templatePills.forEach(pill => {
        pill.addEventListener('click', () => {
            const templateKey = pill.getAttribute('data-template');
            const template = templates[templateKey];
            
            if (template) {
                // Toggle active pill state
                templatePills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                
                // Set form values
                formSubject.value = template.subject;
                formMessage.value = template.body;
                
                // Trigger event to float labels correctly
                formSubject.setAttribute('placeholder', ' ');
                formMessage.setAttribute('placeholder', ' ');
                
                // Update character counter
                textarea.dispatchEvent(new Event('input'));
                
                showToast(`Loaded ${pill.textContent.trim()} Template`, 'info');
            }
        });
    });

    // 4. Form Submissions Logic (POSTs to backend /api/contact)
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const subject = document.getElementById('form-subject').value.trim();
        const message = document.getElementById('form-message').value.trim();

        if (!name || !email || !subject || !message) {
            showToast('Please fill out all fields.', 'error');
            return;
        }

        // Change button state to sending
        submitBtn.disabled = true;
        const origBtnHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Sending Message...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    subject,
                    message
                })
            });

            if (response.ok) {
                showToast('Message sent and saved to database successfully!', 'success');
                contactForm.reset();
                charCounter.textContent = '0 / 1000';
                templatePills.forEach(p => p.classList.remove('active'));
            } else {
                throw new Error('Backend database submission failed.');
            }
        } catch (err) {
            console.error(err);
            showToast('Failed to connect to backend server. Falling back to email client...', 'error');
            
            // Staggered fallback trigger
            setTimeout(() => {
                triggerMailto(name, email, subject, message);
            }, 1000);
        }

        // Restore button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnHtml;
    });

    const triggerMailto = (name, email, subject, message) => {
        const mailtoUrl = `mailto:khushalkumarsk@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " <" + email + ">\n\n" + message)}`;
        window.location.href = mailtoUrl;
        showToast('Opening default email client...', 'success');
        contactForm.reset();
        charCounter.textContent = '0 / 1000';
        templatePills.forEach(p => p.classList.remove('active'));
    };

    // 5. Click-to-copy details toaster
    const emailLink = document.querySelector('#info-row-email .info-value');
    const phoneLink = document.querySelector('#info-row-phone .info-value');

    if (emailLink) {
        emailLink.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(emailLink.textContent.trim()).then(() => {
                showToast('Email copied to clipboard!', 'success');
            });
        });
    }

    if (phoneLink) {
        phoneLink.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(phoneLink.textContent.trim().replace(/\s+/g, '')).then(() => {
                showToast('Phone number copied to clipboard!', 'success');
            });
        });
    }

    // Deprecated but mapped for safety
    const showFeedback = (text, type) => {
        showToast(text, type === 'success' ? 'success' : 'error');
    };

    /* ==========================================================================
       CV & RESUME DROPDOWN DOWNLOADS
       ========================================================================== */
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('show');
                    otherDropdown.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
                }
            });

            const isOpen = dropdown.classList.contains('show');
            dropdown.classList.toggle('show');
            toggle.setAttribute('aria-expanded', !isOpen);
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
            dropdown.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
        });
    });



});
