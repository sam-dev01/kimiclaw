/**
 * static-contact-patch.js
 * Patches the contact form for the static site version.
 * Instead of POSTing to /api/contact (which doesn't exist),
 * it assembles a mailto: link and opens the user's email client.
 * Replace CONTACT_EMAIL below with your real email address.
 */
(function () {
  'use strict';

  const CONTACT_EMAIL = 'hello@kimiclaw.ai'; // ← change this to your real email

  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  // Intercept the fetch in script.js by monkey-patching window.fetch
  // only for the /api/contact endpoint
  const originalFetch = window.fetch;
  window.fetch = function (url, options) {
    const urlStr = typeof url === 'string' ? url : url?.url || '';
    if (urlStr.includes('/api/contact')) {
      // Extract form data and open mailto
      const formData = options && options.body ? new URLSearchParams(options.body.toString()) : new URLSearchParams();
      const name    = formData.get('name')    || '';
      const email   = formData.get('email')   || '';
      const business= formData.get('business')|| '';
      const budget  = formData.get('budget')  || '';
      const message = formData.get('message') || '';

      const subject = encodeURIComponent(`New Website Inquiry from ${name || 'Visitor'}`);
      const body    = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nBusiness: ${business}\nBudget: ${budget}\n\nMessage:\n${message}`
      );

      window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, '_self');

      // Return a fake successful JSON response so script.js shows the success panel
      return Promise.resolve(new Response(
        JSON.stringify({ success: true, message: "Thank you! Your email client has opened. We'll reply within 24 hours." }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      ));
    }
    return originalFetch.apply(this, arguments);
  };
})();
