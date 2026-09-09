const { Resend } = require('resend');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    const { email } = req.body || {};

    if (!email || typeof email !== 'string' || !EMAIL_PATTERN.test(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL) {
        console.error('Missing RESEND_API_KEY or CONTACT_TO_EMAIL environment variable.');
        return res.status(500).json({ error: 'Contact form is not configured yet. Please try again later.' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { error } = await resend.emails.send({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: process.env.CONTACT_TO_EMAIL,
            replyTo: email,
            subject: 'New portfolio contact form submission',
            text: `Someone submitted your portfolio contact form.\n\nTheir email: ${email}`
        });

        if (error) {
            console.error('Resend send error:', error);
            return res.status(502).json({ error: 'Something went wrong sending your message. Please try again later.' });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Resend send threw:', error);
        return res.status(500).json({ error: 'Something went wrong sending your message. Please try again later.' });
    }
};
