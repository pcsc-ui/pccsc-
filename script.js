// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        window.scrollTo({
            top: targetSection.offsetTop - 70,
            behavior: 'smooth'
        });
    });
});

// Enhanced hover effects for brand cards
document.querySelectorAll('.brand-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// Initialize EmailJS
(function() {
    emailjs.init("t1tUOSA-Sg3wIhLv_"); // Replace with your actual EmailJS public key
})();

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = {
                name: contactForm.querySelector('input[name="name"]').value,
                email: contactForm.querySelector('input[name="email"]').value,
                phone: contactForm.querySelector('input[name="phone"]').value || 'Not provided',
                message: contactForm.querySelector('textarea[name="message"]').value,
                timestamp: new Date().toLocaleString('en-IN'),
                company: "PC Customer Service Centre"
            };
            
            try {
                // Try to save to Firebase first
                if (typeof window.addContactData === 'function') {
                    const firebaseResult = await window.addContactData(formData);
                    
                    if (!firebaseResult.success) {
                        throw new Error("Firebase error: " + firebaseResult.error);
                    }
                }
                
                // Then try to send email via EmailJS
                try {
                    console.log("Sending email via EmailJS...");
                    
                    // Send email using EmailJS
                    const response = await emailjs.send(
                        'pccsc', // Replace with your service ID
                        'template_20dzhmb', // Replace with your template ID
                        formData
                    );
                    
                    console.log("Email sent successfully!", response);
                } catch (emailError) {
                    console.warn("EmailJS Error (non-critical): ", emailError);
                    // Continue even if email fails as data is saved to Firebase
                }
                
                // Show success message
                showNotification('✅ Message sent successfully! We will contact you soon.', 'success');
                
                // Reset form
                contactForm.reset();
                
            } catch (error) {
                console.error("Form submission error: ", error);
                showNotification('❌ Error sending message. Please try again later.', 'error');
            } finally {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

// Simple notification function
function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.form-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    notification.innerHTML = `
        <strong>${type === 'success' ? '✅' : '❌'}</strong>
        ${message}
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 350px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        border-left: 4px solid ${type === 'success' ? '#2E7D32' : '#C62828'};
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    /* Loading animation for submit button */
    .loading {
        position: relative;
        color: transparent !important;
    }
    
    .loading::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        top: 50%;
        left: 50%;
        margin: -10px 0 0 -10px;
        border: 2px solid #ffffff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(style);
