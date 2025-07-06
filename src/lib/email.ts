import { Resend } from "resend";
import { pdfProcessor } from "@/lib/pdfProcessor";

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPolicyEmail(user: any, policy: any) {
  try {
    // Generate PDF certificate using the new PDF processor
    const pdfBuffer = await pdfProcessor.generatePolicyDocument(policy);

    const emailHtml = generateEmailTemplate(user, policy);

    const { data, error } = await resend.emails.send({
      from: "Esure Insurance <noreply@myavivacover.com>",
      to: [user.email],
      subject: `🎉 Your Esure Insurance Policy is Ready - ${policy.policyNumber}`,
      html: emailHtml,
      attachments: [
        {
          filename: `Policy_Certificate_${policy.policyNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    if (error) {
      console.error("Error sending policy email:", error);
      throw error;
    }

    console.log("Policy email sent successfully to:", user.email);
    return data;
  } catch (error) {
    console.error("Error sending policy email:", error);
    throw error;
  }
}

export function generateEmailTemplate(user: any, policy: any): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Esure Policy Confirmation</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes slideInFromTop { 0% { transform: translateY(-20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes fadeInUp { 0% { transform: translateY(15px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes carFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-5px); } }
        .email-container { font-family: 'Inter', 'Roboto', Arial, sans-serif; background: #f8fafc; padding: 20px; min-height: 100vh; line-height: 1.7; position: relative; }
        .car-background { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 300px; height: 150px; opacity: 0.05; z-index: 1; pointer-events: none; }
        .car { position: absolute; width: 80px; height: 40px; border-radius: 12px 12px 8px 8px; animation: carFloat 3s ease-in-out infinite; }
        .car-blue { background: #2563eb; left: 50px; top: 40px; animation-delay: 0s; }
        .car-orange { background: #f97316; right: 50px; top: 60px; animation-delay: 1.5s; }
        .car::before { content: ''; position: absolute; top: -8px; left: 15px; right: 15px; height: 20px; background: inherit; border-radius: 8px 8px 4px 4px; opacity: 0.8; }
        .car::after { content: ''; position: absolute; bottom: -5px; left: 8px; right: 8px; height: 3px; background: rgba(0,0,0,0.1); border-radius: 50%; box-shadow: -15px 0 0 -2px rgba(0,0,0,0.1), 15px 0 0 -2px rgba(0,0,0,0.1); }
        .road { position: absolute; bottom: 20px; left: 0; right: 0; height: 20px; background: linear-gradient(90deg, transparent 0%, rgba(148, 163, 184, 0.2) 20%, rgba(148, 163, 184, 0.3) 50%, rgba(148, 163, 184, 0.2) 80%, transparent 100%); border-radius: 10px; }
        .road::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 2px; background: repeating-linear-gradient( 90deg, transparent 0px, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px ); transform: translateY(-50%); }
        .email-card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); animation: slideInFromTop 0.6s ease-out; border: 1px solid #e2e8f0; position: relative; z-index: 2; }
        .header { background: #1e293b; padding: 40px 24px; text-align: center; position: relative; overflow: hidden; }
        .header::before { content: ''; position: absolute; top: -50%; right: -30%; width: 150px; height: 150px; background: #2563eb; opacity: 0.1; border-radius: 50%; }
        .header::after { content: ''; position: absolute; bottom: -30%; left: -20%; width: 120px; height: 120px; background: #f97316; opacity: 0.1; border-radius: 50%; }
        .header-content { position: relative; z-index: 1; }
        .logo { font-size: 32px; font-weight: 700; color: #ffffff; margin-bottom: 8px; letter-spacing: -0.5px; font-family: 'Inter', sans-serif; }
        .header-subtitle { color: #94a3b8; font-size: 16px; font-weight: 400; font-family: 'Roboto', sans-serif; }
        .success-section { background: #ffffff; padding: 32px 24px; text-align: center; animation: fadeInUp 0.8s ease-out 0.2s both; position: relative; }
        .success-title { font-size: 28px; font-weight: 700; color: #1e293b; margin-bottom: 12px; font-family: 'Inter', sans-serif; }
        .success-message { font-size: 16px; color: #64748b; line-height: 1.6; margin-bottom: 8px; font-family: 'Roboto', sans-serif; font-weight: 400; }
        .emoji-car { font-size: 24px; margin: 16px 0; }
        .policy-card { background: #f8fafc; border-radius: 12px; padding: 32px; margin: 24px; border: 1px solid #e2e8f0; position: relative; }
        .policy-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #2563eb 0%, #f97316 100%); border-radius: 12px 12px 0 0; }
        .section-title { font-size: 18px; font-weight: 600; color: #1e293b; margin-bottom: 24px; text-align: center; font-family: 'Inter', sans-serif; }
        .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #e2e8f0; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-weight: 500; color: #475569; font-size: 15px; font-family: 'Roboto', sans-serif; }
        .detail-value { font-weight: 600; color: #1e293b; font-size: 15px; text-align: right; font-family: 'Inter', sans-serif; }
        .policy-number { color: #2563eb !important; font-size: 16px !important; }
        .payment-highlight { background: #ffffff; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; border: 2px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); }
        .payment-label { font-size: 15px; color: #64748b; margin-bottom: 8px; font-family: 'Roboto', sans-serif; font-weight: 500; }
        .payment-amount { font-size: 32px; font-weight: 700; color: #f97316; font-family: 'Inter', sans-serif; }
        .help-section { background: #f1f5f9; margin: 24px; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0; }
        .help-title { font-size: 20px; font-weight: 700; color: #1e293b; margin-bottom: 20px; text-align: center; font-family: 'Inter', sans-serif; }
        .help-option { background: #ffffff; border-radius: 8px; padding: 20px; margin: 16px 0; display: flex; align-items: center; gap: 16px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); }
        .help-icon { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; }
        .help-icon.phone { background: #fef3c7; color: #f59e0b; }
        .help-icon.chat { background: #dbeafe; color: #2563eb; }
        .help-icon.email { background: #fed7aa; color: #ea580c; }
        .help-content h4 { color: #1e293b; font-size: 16px; font-weight: 600; margin-bottom: 4px; font-family: 'Inter', sans-serif; }
        .help-content p { color: #64748b; font-size: 14px; font-family: 'Roboto', sans-serif; }
        .help-content a { color: #2563eb; text-decoration: none; font-weight: 500; }
        .help-content a:hover { text-decoration: underline; }
        .footer { background: #f8fafc; color: #64748b; padding: 32px 24px; text-align: center; border-top: 1px solid #e2e8f0; }
        .footer-legal { font-size: 12px; line-height: 1.6; font-family: 'Roboto', sans-serif; font-weight: 400; }
        @media only screen and (max-width: 600px) { .car-background { width: 200px; height: 100px; } .car { width: 60px; height: 30px; } .car-blue { left: 30px; top: 25px; } .car-orange { right: 30px; top: 40px; } .email-container { padding: 12px; } .header { padding: 32px 20px; } .logo { font-size: 28px; } .success-section { padding: 24px 20px; } .success-title { font-size: 24px; } .policy-card, .help-section { margin: 16px; padding: 24px; } .detail-row { flex-direction: column; align-items: flex-start; gap: 4px; padding: 12px 0; } .detail-value { text-align: left !important; } .payment-amount { font-size: 28px; } .help-option { padding: 16px; } .section-title { font-size: 16px; } .help-title { font-size: 18px; } }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="car-background">
          <div class="car car-blue"></div>
          <div class="car car-orange"></div>
          <div class="road"></div>
        </div>
        <div class="email-card">
         <div class="header">
            <div class="header-content">
              <div class="logo">esure</div>
              <div class="header-subtitle">Your trusted insurance partner</div>
         </div>
          </div>
          <div class="success-section">
            <h1 class="success-title">Welcome on board!</h1>
            <p class="success-message">Your policy is now active and you're fully protected on the road. Drive with confidence!</p>
            <div class="emoji-car">🚗✨</div>
           </div>
          <div class="policy-card">
            <h2 class="section-title">📋 Policy Information</h2>
            <div class="detail-row">
              <span class="detail-label">Customer Name:</span>
              <span class="detail-value">${user.fullName || "-"}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Policy Number:</span>
              <span class="detail-value policy-number">${policy.policyNumber || "-"}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Vehicle:</span>
              <span class="detail-value">${policy.vehicleInfo ? `${policy.vehicleInfo.yearOfManufacture || ""} ${policy.vehicleInfo.make || ""} ${policy.vehicleInfo.model || ""}`.trim() : "-"}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Cover Start:</span>
              <span class="detail-value">${policy.startDate ? new Date(policy.startDate).toLocaleDateString("en-GB") : "-"}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Cover End:</span>
              <span class="detail-value">${policy.endDate ? new Date(policy.endDate).toLocaleDateString("en-GB") : "-"}</span>
            </div>
            <div class="payment-highlight">
              <div class="payment-label">Amount Paid:</div>
              <div class="payment-amount">£${policy.price ? policy.price.toLocaleString() : "-"}</div>
            </div>
          </div>
          <div class="help-section">
            <h3 class="help-title">Need Help? We're Here 24/7! 🚀</h3>
            <div class="help-option">
              <div class="help-icon phone">📞</div>
              <div class="help-content">
                <h4>Call us</h4>
                <p><a href="tel:03450451000">0345 045 1000</a></p>
              </div>
            </div>
            <div class="help-option">
              <div class="help-icon chat">💬</div>
              <div class="help-content">
                <h4>Live Chat</h4>
                <p>Available 24/7</p>
              </div>
            </div>
            <div class="help-option">
              <div class="help-icon email">📧</div>
              <div class="help-content">
                <h4>Email</h4>
                <p><a href="mailto:support@esure.com">support@esure.com</a></p>
              </div>
            </div>
          </div>
          <div class="footer">
            <div class="footer-legal">
              Esure Insurance Limited, Registered in England No. 2494086.<br>
              Authorised by the Prudential Regulation Authority and regulated by the Financial Conduct Authority and the Prudential Regulation Authority.
          </div>
           </div>
         </div>
      </div>
    </body>
    </html>
  `;
}
