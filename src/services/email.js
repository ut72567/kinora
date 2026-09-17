import emailjs from '@emailjs/browser'

export async function sendContactEmail({ toEmail, ownerName, identityName, kinoraId, senderName, senderEmail, message, identityUrl }) {
  if (!toEmail || !senderName || !senderEmail || !message) {
    throw new Error('Missing required message fields.')
  }

  const templateParams = {
    to_email: toEmail,
    owner_name: ownerName,
    identity_name: identityName,
    kinora_id: kinoraId,
    sender_name: senderName,
    sender_email: senderEmail,
    message,
    identity_url: identityUrl,
  }

  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID

  if (!publicKey || !serviceId || !templateId) {
    throw new Error('EmailJS configuration is missing.')
  }

  emailjs.init({ publicKey })

  return emailjs.send(serviceId, templateId, templateParams)
}
