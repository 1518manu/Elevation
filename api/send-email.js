import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const RECIPIENT_EMAIL = 'manudev2987@gmail.com'
const SENDER_EMAIL = 'onboarding@resend.dev' // Free Resend onboarding email for development. TODO: Change to 'noreply@alfaelevator.in' after domain verification at https://resend.com/domains
const SIGNATURE_IMAGE_URL = process.env.SIGNATURE_IMAGE_URL || 'https://[SUPABASE_SIGNATURE_IMAGE_URL]' // TODO: Replace with actual Supabase image URL

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { type, data, recipient, subject, html } = req.body

    if (!type || !data) {
      return res.status(400).json({ error: 'Missing type or data' })
    }

    let emailContent

    if (type === 'quote') {
      emailContent = formatQuoteEmail(data)
    } else if (type === 'contact') {
      emailContent = formatContactEmail(data)
    } else if (subject && html) {
      emailContent = { subject, html }
    } else {
      return res.status(400).json({ error: 'Invalid email type' })
    }

    const result = await resend.emails.send({
      from: `ALFAFUJI Elevator <${SENDER_EMAIL}>`,
      to: recipient || RECIPIENT_EMAIL,
      subject: emailContent.subject,
      html: emailContent.html,
    })

    return res.status(200).json({ success: true, result })
  } catch (error) {
    console.error('Email sending error:', error)
    return res.status(500).json({ error: 'Failed to send email', message: error.message })
  }
}

function formatQuoteEmail(data) {
  return {
    subject: `New Quote Request - ${data.full_name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">New Quote Request</h2>
        
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin: 0 0 10px 0;">Customer Details</h3>
          <p><strong>Name:</strong> ${data.full_name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> +91 ${data.phone}</p>
          <p><strong>City:</strong> ${data.city}</p>
        </div>

        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin: 0 0 10px 0;">Elevator Requirements</h3>
          <p><strong>Elevator Type:</strong> ${data.elevator_type}</p>
          <p><strong>Number of Floors:</strong> ${data.num_floors}</p>
          <p><strong>Building Type:</strong> ${data.building_type}</p>
          ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
        </div>

        <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
          This inquiry was submitted on ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}
        </p>
      </div>
    `
  }
}

function formatContactEmail(data) {
  return {
    subject: `New Contact Inquiry - ${data.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">New Contact Inquiry</h2>
        
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin: 0 0 10px 0;">Contact Details</h3>
          <p><strong>Name:</strong> ${data.full_name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
        </div>

        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin: 0 0 10px 0;">Message</h3>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${data.message}</p>
        </div>

        <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
          This inquiry was submitted on ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}
        </p>
      </div>
    `
  }
}
