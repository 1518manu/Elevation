import { supabase } from '@/lib/supabase'

// Fetch signature image URL from Supabase storage
const { data: { publicUrl: SIGNATURE_IMAGE_URL } } = supabase.storage
  .from('resumes')
  .getPublicUrl('resumes-signature.png')

const SALES_TEAM_EMAIL = 'manudev2987@gmail.com' // TODO: Change to info@alfaelevator.in after domain verification

// Client acknowledgment email - sent to the quote/contact sender
export function formatQuoteAcknowledgmentEmail(data) {
  return {
    subject: 'Thank you for your quote request - ALFAFUJI Elevators',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank you for your quote request</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff;">
        <div style="max-width: 650px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          
          <div style="margin-bottom: 30px;">
            <h1 style="font-size: 22px; font-weight: bold; color: #222; margin: 0 0 10px 0;">ALFAFUJI Elevators</h1>
            <div style="width: 100%; height: 1px; background-color: #ddd; margin: 10px 0 20px 0;"></div>
          </div>
          
          <div style="margin-bottom: 30px; font-size: 14px; color: #222; line-height: 1.7;">
            <p style="margin: 0 0 10px 0;">Dear ${data.full_name},</p>
            <p style="margin: 0 0 15px 0;">Thank you for your interest in ALFAFUJI Elevators!</p>
            
            <p style="margin: 0 0 15px 0;">
              We have received your quote request for a ${data.elevator_type} elevator for your ${data.building_type} with ${data.num_floors} floors. Our sales team will review your requirements and contact you within 24-48 hours with a detailed quotation.
            </p>
            
            <p style="margin: 0 0 15px 0;">
              In the meantime, if you have any urgent questions, please feel free to reach out to us at:
            </p>
            
            <p style="margin: 0 0 5px 0;">Email: <a href="mailto:info@alfaelevator.in" style="color: #E87722; text-decoration: none;">info@alfaelevator.in</a></p>
            <p style="margin: 0;">Phone: [REPLACE THIS]</p>
          </div>
          
          <div style="margin-bottom: 30px; font-size: 14px; color: #222; line-height: 1.7;">
            <p style="margin: 0 0 10px 0;">Best Regards,</p>
            <p style="margin: 0 0 5px 0; font-weight: bold;">ALFAFUJI Elevators Team</p>
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
                <p style="margin: 0;">Email: info@alfaelevator.in</p>
              </td>
            </tr>
          </table>
          
        </div>
      </body>
      </html>
    `
  }
}

// Client acknowledgment email - sent to the contact sender
export function formatContactAcknowledgmentEmail(data) {
  return {
    subject: 'Thank you for contacting us - ALFAFUJI Elevators',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank you for contacting us</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff;">
        <div style="max-width: 650px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          
          <div style="margin-bottom: 30px;">
            <h1 style="font-size: 22px; font-weight: bold; color: #222; margin: 0 0 10px 0;">ALFAFUJI Elevators</h1>
            <div style="width: 100%; height: 1px; background-color: #ddd; margin: 10px 0 20px 0;"></div>
          </div>
          
          <div style="margin-bottom: 30px; font-size: 14px; color: #222; line-height: 1.7;">
            <p style="margin: 0 0 10px 0;">Dear ${data.full_name},</p>
            <p style="margin: 0 0 15px 0;">Thank you for contacting ALFAFUJI Elevators!</p>
            
            <p style="margin: 0 0 15px 0;">
              We have received your inquiry regarding "${data.subject}". Our team will review your message and get back to you within 24-48 hours.
            </p>
            
            <p style="margin: 0 0 15px 0;">
              If you have any urgent questions, please feel free to reach out to us at:
            </p>
            
            <p style="margin: 0 0 5px 0;">Email: <a href="mailto:info@alfaelevator.in" style="color: #E87722; text-decoration: none;">info@alfaelevator.in</a></p>
            <p style="margin: 0;">Phone: [REPLACE THIS]</p>
          </div>
          
          <div style="margin-bottom: 30px; font-size: 14px; color: #222; line-height: 1.7;">
            <p style="margin: 0 0 10px 0;">Best Regards,</p>
            <p style="margin: 0 0 5px 0; font-weight: bold;">ALFAFUJI Elevators Team</p>
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
                <p style="margin: 0;">Email: info@alfaelevator.in</p>
              </td>
            </tr>
          </table>
          
        </div>
      </body>
      </html>
    `
  }
}

// Internal email to sales team with detailed quote information
export function formatQuoteEmail(data) {
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

export function formatContactEmail(data) {
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

async function sendEmailToRecipient(recipient, subject, html) {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'custom',
      recipient,
      subject,
      html,
    }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to send email')
  }
  
  return await response.json()
}

export async function sendQuoteEmail(data) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'quote',
        data,
      }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to send email')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Failed to send quote email:', error)
    throw error
  }
}

export async function sendContactEmail(data) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'contact',
        data,
      }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to send email')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Failed to send contact email:', error)
    throw error
  }
}
