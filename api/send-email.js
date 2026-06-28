import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)
const SALES_TEAM_EMAIL = 'manudev2987@gmail.com' // TODO: Change to info@alfaelevator.in after domain verification
const SENDER_EMAIL = 'onboarding@resend.dev' // Free Resend onboarding email for development. TODO: Change to 'noreply@alfaelevator.in' after domain verification at https://resend.com/domains

// Initialize Supabase for signature image
const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables: SUPABASE_URL and SUPABASE_ANON_KEY')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Initialize Supabase for signature image
const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(req, res) {
  // Fetch signature image URL from Supabase storage
  const { data: { publicUrl: SIGNATURE_IMAGE_URL } } = supabase.storage
    .from('resumes')
    .getPublicUrl('signature.png')
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
      emailContent = formatQuoteEmail(data, SIGNATURE_IMAGE_URL)
    } else if (type === 'contact') {
      emailContent = formatContactEmail(data, SIGNATURE_IMAGE_URL)
    } else if (subject && html) {
      emailContent = { subject, html }
    } else {
      return res.status(400).json({ error: 'Invalid email type' })
    }

    const result = await resend.emails.send({
      from: `ALFAFUJI Elevator <${SENDER_EMAIL}>`,
      to: recipient || SALES_TEAM_EMAIL,
      subject: emailContent.subject,
      html: emailContent.html,
    })

    return res.status(200).json({ success: true, result })
  } catch (error) {
    console.error('Email sending error:', error)
    return res.status(500).json({ error: 'Failed to send email', message: error.message })
  }
}

function formatQuoteEmail(data, SIGNATURE_IMAGE_URL) {
  return {
    subject: `New Quote Request - ${data.full_name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Quote Request</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff;">
        <div style="max-width: 650px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          
          <div style="margin-bottom: 30px;">
            <h1 style="font-size: 22px; font-weight: bold; color: #222; margin: 0 0 10px 0;">ALFAFUJI Elevators</h1>
            <div style="width: 100%; height: 1px; background-color: #ddd; margin: 10px 0 20px 0;"></div>
          </div>
          
          <div style="margin-bottom: 30px; font-size: 14px; color: #222; line-height: 1.7;">
            <p style="margin: 0 0 10px 0;">Dear Sales Team,</p>
            <p style="margin: 0 0 15px 0;">Greetings!</p>
            
            <p style="margin: 0 0 15px 0;">
              A new quote request has been received. Please find the client details below and approach them for review.
            </p>
          </div>
          
          <div style="margin-bottom: 30px; background-color: #f9f9f9; padding: 20px; border-left: 4px solid #E87722;">
            <h3 style="margin: 0 0 15px 0; color: #222; font-size: 16px; font-weight: bold;">Client Details</h3>
            <div style="font-size: 14px; color: #222; line-height: 1.8;">
              <p style="margin: 5px 0;"><strong>Name:</strong> ${data.full_name}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
              <p style="margin: 5px 0;"><strong>Phone:</strong> +91 ${data.phone}</p>
              <p style="margin: 5px 0;"><strong>City:</strong> ${data.city}</p>
            </div>
          </div>
          
          <div style="margin-bottom: 30px; background-color: #f9f9f9; padding: 20px; border-left: 4px solid #E87722;">
            <h3 style="margin: 0 0 15px 0; color: #222; font-size: 16px; font-weight: bold;">Quote Details</h3>
            <div style="font-size: 14px; color: #222; line-height: 1.8;">
              <p style="margin: 5px 0;"><strong>Elevator Type:</strong> ${data.elevator_type}</p>
              <p style="margin: 5px 0;"><strong>Building Type:</strong> ${data.building_type}</p>
              <p style="margin: 5px 0;"><strong>Number of Floors:</strong> ${data.num_floors}</p>
            </div>
          </div>
          
          ${data.message ? `
          <div style="margin-bottom: 30px; background-color: #f9f9f9; padding: 20px; border-left: 4px solid #E87722;">
            <h3 style="margin: 0 0 15px 0; color: #222; font-size: 16px; font-weight: bold;">Client Message</h3>
            <p style="margin: 0; font-size: 14px; color: #222; line-height: 1.7; white-space: pre-wrap;">${data.message}</p>
          </div>
          ` : ''}
          
          <div style="margin-bottom: 30px; background-color: #FFF5EE; padding: 20px; border-left: 4px solid #E87722;">
            <h3 style="margin: 0 0 10px 0; color: #E87722; font-size: 16px; font-weight: bold;">Action Required</h3>
            <p style="margin: 0; font-size: 14px; color: #222; line-height: 1.7;">
              Please approach this client for review and update the status with the manager.
            </p>
          </div>
          
          <div style="margin-bottom: 30px; font-size: 14px; color: #222; line-height: 1.7;">
            <p style="margin: 0 0 10px 0;">Best Regards,</p>
            <p style="margin: 0 0 5px 0; font-weight: bold;">Admin</p>
            <p style="margin: 0; font-weight: bold;">ALFAFUJI Elevators</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="width: 45%; vertical-align: top; padding-right: 20px;">
                <img src="${SIGNATURE_IMAGE_URL}" alt="Signature" style="max-width: 100%; height: auto; display: block;">
              </td>
              <td style="width: 55%; vertical-align: top; font-size: 12px; color: #666;">
                <p style="margin: 0 0 5px 0;"><strong>ALFAFUJI Elevators</strong></p>
                <p style="margin: 0 0 5px 0;">[REPLACE THIS - Address]</p>
                <p style="margin: 0 0 5px 0;">Phone: [REPLACE THIS]</p>
                <!-- TODO: Uncomment after domain verification -->
                <!-- <p style="margin: 0;">Email: info@alfaelevator.in</p> -->
              </td>
            </tr>
          </table>
          
        </div>
      </body>
      </html>
    `
  }
}

function formatContactEmail(data, SIGNATURE_IMAGE_URL) {
  return {
    subject: `New Contact Inquiry - ${data.subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Inquiry</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff;">
        <div style="max-width: 650px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          
          <div style="margin-bottom: 30px;">
            <h1 style="font-size: 22px; font-weight: bold; color: #222; margin: 0 0 10px 0;">ALFAFUJI Elevators</h1>
            <div style="width: 100%; height: 1px; background-color: #ddd; margin: 10px 0 20px 0;"></div>
          </div>
          
          <div style="margin-bottom: 30px; font-size: 14px; color: #222; line-height: 1.7;">
            <p style="margin: 0 0 10px 0;">Dear Sales Team,</p>
            <p style="margin: 0 0 15px 0;">Greetings!</p>
            
            <p style="margin: 0 0 15px 0;">
              A new contact inquiry has been received. Please find the client details below and approach them for review.
            </p>
          </div>
          
          <div style="margin-bottom: 30px; background-color: #f9f9f9; padding: 20px; border-left: 4px solid #E87722;">
            <h3 style="margin: 0 0 15px 0; color: #222; font-size: 16px; font-weight: bold;">Client Details</h3>
            <div style="font-size: 14px; color: #222; line-height: 1.8;">
              <p style="margin: 5px 0;"><strong>Name:</strong> ${data.full_name}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
              ${data.phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${data.phone}</p>` : ''}
            </div>
          </div>
          
          <div style="margin-bottom: 30px; background-color: #f9f9f9; padding: 20px; border-left: 4px solid #E87722;">
            <h3 style="margin: 0 0 15px 0; color: #222; font-size: 16px; font-weight: bold;">Inquiry Details</h3>
            <div style="font-size: 14px; color: #222; line-height: 1.8;">
              <p style="margin: 5px 0;"><strong>Subject:</strong> ${data.subject}</p>
            </div>
          </div>
          
          <div style="margin-bottom: 30px; background-color: #f9f9f9; padding: 20px; border-left: 4px solid #E87722;">
            <h3 style="margin: 0 0 15px 0; color: #222; font-size: 16px; font-weight: bold;">Client Message</h3>
            <p style="margin: 0; font-size: 14px; color: #222; line-height: 1.7; white-space: pre-wrap;">${data.message}</p>
          </div>
          
          <div style="margin-bottom: 30px; background-color: #FFF5EE; padding: 20px; border-left: 4px solid #E87722;">
            <h3 style="margin: 0 0 10px 0; color: #E87722; font-size: 16px; font-weight: bold;">Action Required</h3>
            <p style="margin: 0; font-size: 14px; color: #222; line-height: 1.7;">
              Please approach this client for review and update the status with the manager.
            </p>
          </div>
          
          <div style="margin-bottom: 30px; font-size: 14px; color: #222; line-height: 1.7;">
            <p style="margin: 0 0 10px 0;">Best Regards,</p>
            <p style="margin: 0 0 5px 0; font-weight: bold;">Admin</p>
            <p style="margin: 0; font-weight: bold;">ALFAFUJI Elevators</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="width: 45%; vertical-align: top; padding-right: 20px;">
                <img src="${SIGNATURE_IMAGE_URL}" alt="Signature" style="max-width: 100%; height: auto; display: block;">
              </td>
              <td style="width: 55%; vertical-align: top; font-size: 12px; color: #666;">
                <p style="margin: 0 0 5px 0;"><strong>ALFAFUJI Elevators</strong></p>
                <p style="margin: 0 0 5px 0;">[REPLACE THIS - Address]</p>
                <p style="margin: 0 0 5px 0;">Phone: [REPLACE THIS]</p>
                <!-- TODO: Uncomment after domain verification -->
                <!-- <p style="margin: 0;">Email: info@alfaelevator.in</p> -->
              </td>
            </tr>
          </table>
          
        </div>
      </body>
      </html>
    `
  }
}
