import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Policy from "@/lib/models/Policy";
import User from "@/lib/models/User";
import { pdfProcessor } from "@/lib/pdfProcessor";
import { Resend } from "resend";
import { requireAuth } from "@/lib/auth";
import fs from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(["sub-admin"])(request);

    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await connectToDatabase();

    const { policyId } = await request.json();

    if (!policyId) {
      return NextResponse.json(
        { error: "Policy ID is required" },
        { status: 400 }
      );
    }

    // Fetch the policy with populated user data
    // Sub-admins can only access policies they created
    const policy = await Policy.findOne({
      _id: policyId,
      createdBy: authResult.user.userId,
    })
      .populate("userId", "fullName email address dateOfBirth")
      .populate("createdBy", "fullName email")
      .lean();

    if (!policy) {
      return NextResponse.json(
        { error: "Policy not found or access denied" },
        { status: 404 }
      );
    }

    // Generate the policy document
    const documentBuffer = await pdfProcessor.generatePolicyDocument(
      policy as any
    );

    // Read the additional terms PDF file
    const termsFilePath = path.join(process.cwd(), "public", "NMDMG10249.pdf");
    const termsBuffer = fs.readFileSync(termsFilePath);

    // Prepare email content
    const policyData = policy as any;
    const emailSubject = `Your Aviva Insurance Policy Certificate - ${policyData.policyNumber}`;

    // Calculate policy duration
    const startDate = new Date(policyData.startDate);
    const endDate = new Date(policyData.endDate);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Esure Insurance Policy - ${policyData.policyNumber}</title>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
              }
              
              body {
                  font-family: 'Poppins', Arial, sans-serif;
                  line-height: 1.6;
                  color: #2c2c2c;
                  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              }
              
              .email-container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  border-radius: 24px;
                  overflow: hidden;
                  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
                  border: 1px solid rgba(255, 255, 255, 0.2);
              }
              
              .header {
                  background: linear-gradient(135deg, #0072ce 0%, #0056d6 50%, #003398 100%);
                  padding: 50px 30px;
                  text-align: center;
                  position: relative;
                  overflow: hidden;
              }
              
              .header::before {
                  content: '';
                  position: absolute;
                  top: -50%;
                  left: -50%;
                  width: 200%;
                  height: 200%;
                  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
                  animation: shimmer 4s ease-in-out infinite;
              }
              
              @keyframes shimmer {
                  0%, 100% { transform: rotate(0deg); }
                  50% { transform: rotate(180deg); }
              }
              
              .logo-svg {
                  width: 120px;
                  height: 40px;
                  margin-bottom: 20px;
                  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
              }
              
              .tagline {
                  color: rgba(255, 255, 255, 0.9);
                  font-size: 18px;
                  font-weight: 500;
                  margin-top: 15px;
                  position: relative;
                  z-index: 1;
              }
              
              .banner-section {
                  position: relative;
                  width: 100%;
                  height: 200px;
                  overflow: hidden;
              }
              
              .banner-img {
                  width: 100%;
                  height: 200px;
                  object-fit: cover;
                  display: block;
              }
              
              .banner-overlay {
                  background: linear-gradient(135deg, rgba(0, 114, 206, 0.8), rgba(0, 114, 206, 0.6));
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
              }
              
              .banner-text {
                  color: white;
                  text-align: center;
                  z-index: 2;
                  position: relative;
              }
              
              .banner-title {
                  font-size: 32px;
                  font-weight: bold;
                  margin-bottom: 10px;
                  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
              }
              
              .banner-subtitle {
                  font-size: 18px;
                  font-weight: 500;
                  opacity: 0.95;
                  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
              }
              
              .content {
                  padding: 50px 30px;
              }
              
              .thank-you {
                  font-size: 28px;
                  color: #0072ce;
                  margin-bottom: 30px;
                  text-align: center;
                  font-weight: 700;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 12px;
              }
              
              .thank-you::before {
                  content: '🎉';
                  font-size: 32px;
              }
              
              .vehicle-card {
                  background: linear-gradient(135deg, #0072ce, #0056d6);
                  border-radius: 20px;
                  padding: 30px;
                  margin: 30px 0;
                  color: white;
                  position: relative;
                  overflow: hidden;
                  box-shadow: 0 10px 30px rgba(0, 114, 206, 0.2);
              }
              
              .vehicle-card::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  right: 0;
                  width: 120px;
                  height: 120px;
                  background: linear-gradient(45deg, rgba(255, 255, 255, 0.2), transparent);
                  border-radius: 50%;
                  transform: translate(50%, -50%);
              }
              
              .policy-number {
                  font-size: 14px;
                  color: rgba(255, 255, 255, 0.8);
                  margin-bottom: 10px;
                  font-weight: 500;
              }
              
              .status-badge {
                  background: linear-gradient(135deg, #ffffff, #f8fafc);
                  color: #0072ce;
                  padding: 8px 18px;
                  border-radius: 25px;
                  font-size: 12px;
                  font-weight: bold;
                  float: right;
                  margin-top: -5px;
                  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
              }
              
              .vehicle-name {
                  font-size: 28px;
                  font-weight: bold;
                  margin: 15px 0;
                  clear: both;
              }
              
              .dates {
                  display: flex;
                  justify-content: space-between;
                  margin-top: 20px;
              }
              
              .date-block {
                  text-align: center;
                  background: rgba(255, 255, 255, 0.1);
                  padding: 15px;
                  border-radius: 12px;
                  flex: 1;
                  margin: 0 5px;
              }
              
              .date-label {
                  font-size: 14px;
                  color: rgba(255, 255, 255, 0.8);
                  margin-bottom: 5px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
              }
              
              .date-value {
                  font-size: 18px;
                  font-weight: bold;
              }
              
              .details-section {
                  background-color: #f8fafc;
                  border-radius: 16px;
                  padding: 30px;
                  margin: 30px 0;
                  border: 2px solid #e2e8f0;
              }
              
              .details-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 20px;
                  margin-bottom: 20px;
              }
              
              .detail-item {
                  border-bottom: 1px solid #e2e8f0;
                  padding-bottom: 15px;
                  transition: all 0.3s ease;
              }
              
              .detail-item:hover {
                  background: rgba(0, 114, 206, 0.05);
                  border-radius: 8px;
                  padding: 15px;
                  margin: 0 -15px;
              }
              
              .detail-label {
                  font-size: 12px;
                  color: #64748b;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  margin-bottom: 8px;
                  font-weight: 600;
              }
              
              .detail-value {
                  font-size: 16px;
                  font-weight: 700;
                  color: #1e293b;
              }
              
              .payment-section {
                  background: linear-gradient(135deg, #ffffff, #f8fafc);
                  color: #0072ce;
                  border-radius: 20px;
                  padding: 30px;
                  margin: 30px 0;
                  box-shadow: 0 10px 30px rgba(0, 114, 206, 0.1);
                  border: 2px solid #0072ce;
              }
              
              .payment-title {
                  font-size: 20px;
                  font-weight: bold;
                  margin-bottom: 20px;
                  display: flex;
                  align-items: center;
                  gap: 10px;
              }
              
              .payment-title::before {
                  content: '💳';
                  font-size: 24px;
              }
              
              .payment-details {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
              }
              
              .payment-method {
                  font-size: 14px;
                  opacity: 0.8;
                  font-weight: 500;
              }
              
              .total-price {
                  font-size: 28px;
                  font-weight: bold;
              }
              
              .footer {
                  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                  color: rgba(255, 255, 255, 0.9);
                  padding: 40px 30px;
                  font-size: 13px;
                  line-height: 1.7;
              }
              
              .footer h3 {
                  color: #0072ce;
                  margin-bottom: 20px;
                  font-size: 18px;
                  font-weight: 700;
              }
              
              .footer p {
                  margin-bottom: 12px;
                  line-height: 1.6;
              }
              
              .contact-info {
                  background: rgba(255, 255, 255, 0.1);
                  border-radius: 12px;
                  padding: 20px;
                  margin: 25px 0;
              }
              
              .contact-item {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 10px;
                  margin-bottom: 10px;
                  font-weight: 500;
              }
              
              .esure-badge {
                  background: linear-gradient(135deg, #0072ce 0%, #0056d6 100%);
                  color: white;
                  padding: 8px 16px;
                  border-radius: 20px;
                  font-size: 12px;
                  font-weight: 700;
                  display: inline-block;
                  margin-bottom: 15px;
                  box-shadow: 0 4px 12px rgba(0, 114, 206, 0.3);
              }
              
              @media (max-width: 600px) {
                  .email-container {
                      margin: 0;
                      border-radius: 0;
                      box-shadow: none;
                  }
                  
                  .header {
                      padding: 30px 20px;
                  }
                  
                  .logo-svg {
                      width: 100px;
                  }
                  
                  .tagline {
                      font-size: 16px;
                  }
                  
                  .banner-section {
                      height: 150px;
                  }
                  
                  .banner-img {
                      height: 150px;
                  }
                  
                  .banner-title {
                      font-size: 24px;
                      margin-bottom: 8px;
                  }
                  
                  .banner-subtitle {
                      font-size: 16px;
                  }
                  
                  .content {
                      padding: 30px 20px;
                  }
                  
                  .thank-you {
                      font-size: 22px;
                      margin-bottom: 25px;
                  }
                  
                  .vehicle-card {
                      padding: 25px 20px;
                      margin: 25px 0;
                      border-radius: 16px;
                  }
                  
                  .vehicle-card::before {
                      width: 80px;
                      height: 80px;
                  }
                  
                  .policy-number {
                      font-size: 13px;
                  }
                  
                  .status-badge {
                      padding: 6px 14px;
                      font-size: 11px;
                      margin-top: -3px;
                  }
                  
                  .vehicle-name {
                      font-size: 22px;
                      margin: 12px 0;
                      line-height: 1.2;
                  }
                  
                  .dates {
                      flex-direction: column;
                      gap: 15px;
                      margin-top: 15px;
                  }
                  
                  .date-block {
                      background: rgba(255, 255, 255, 0.1);
                      padding: 12px;
                      border-radius: 8px;
                  }
                  
                  .date-label {
                      font-size: 13px;
                  }
                  
                  .date-value {
                      font-size: 16px;
                  }
                  
                  .details-section {
                      padding: 20px;
                      margin: 20px 0;
                      border-radius: 12px;
                  }
                  
                  .details-section h3 {
                      font-size: 18px !important;
                  }
                  
                  .details-grid {
                      grid-template-columns: 1fr;
                      gap: 15px;
                      margin-bottom: 15px;
                  }
                  
                  .detail-item {
                      padding-bottom: 10px;
                  }
                  
                  .detail-label {
                      font-size: 11px;
                  }
                  
                  .detail-value {
                      font-size: 15px;
                  }
                  
                  .payment-section {
                      padding: 20px;
                      margin: 25px 0;
                      border-radius: 16px;
                  }
                  
                  .payment-title {
                      font-size: 18px;
                      margin-bottom: 15px;
                  }
                  
                  .payment-details {
                      flex-direction: column;
                      align-items: flex-start;
                      gap: 12px;
                  }
                  
                  .payment-method {
                      font-size: 13px;
                  }
                  
                  .total-price {
                      font-size: 24px;
                      align-self: flex-end;
                  }
                  
                  .footer {
                      padding: 30px 20px;
                      font-size: 12px;
                  }
                  
                  .footer h3 {
                      font-size: 16px !important;
                      margin-bottom: 15px !important;
                  }
                  
                  .contact-info {
                      margin-top: 20px;
                      padding-top: 20px;
                  }
              }
              
              @media (max-width: 480px) {
                  .header {
                      padding: 25px 15px;
                  }
                  
                  .logo-svg {
                      width: 80px;
                  }
                  
                  .content {
                      padding: 25px 15px;
                  }
                  
                  .thank-you {
                      font-size: 20px;
                  }
                  
                  .vehicle-card {
                      padding: 20px 15px;
                  }
                  
                  .vehicle-name {
                      font-size: 20px;
                  }
                  
                  .banner-title {
                      font-size: 22px;
                  }
                  
                  .banner-subtitle {
                      font-size: 15px;
                  }
                  
                  .details-section {
                      padding: 15px;
                  }
                  
                  .payment-section {
                      padding: 15px;
                  }
                  
                  .footer {
                      padding: 25px 15px;
                  }
                  
                  .total-price {
                      font-size: 22px;
                  }
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <!-- Header with Logo -->
              <div class="header">
                  <svg class="logo-svg" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
                              <stop offset="100%" style="stop-color:#f8fafc;stop-opacity:1" />
                          </linearGradient>
                      </defs>
                      <text x="100" y="35" text-anchor="middle" fill="url(#logoGradient)" font-family="Arial, sans-serif" font-size="24" font-weight="bold">ESURE</text>
                      <circle cx="30" cy="30" r="15" fill="none" stroke="#ffffff" stroke-width="3"/>
                      <path d="M25 25 L35 35 M35 25 L25 35" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  <div class="tagline">Insurance You Can Trust</div>
              </div>

              <!-- Banner Section -->
              <div class="banner-section">
                  <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" alt="Esure Insurance Banner" class="banner-img">
                  <div class="banner-overlay">
                      <div class="banner-text">
                          <div class="banner-title">Your Policy is Ready</div>
                          <div class="banner-subtitle">Comprehensive coverage you can trust</div>
                      </div>
                  </div>
              </div>

              <!-- Content -->
              <div class="content">
                  <div class="thank-you">Thank you for choosing Esure Insurance!</div>
                  
                  <!-- Vehicle Card -->
                  <div class="vehicle-card">
                      <div class="policy-number">Policy: ${policyData.policyNumber}</div>
                      <div class="status-badge">ACTIVE</div>
                      <div class="vehicle-name">${policyData.vehicleInfo.make.toUpperCase()} ${policyData.vehicleInfo.model.toUpperCase()}</div>
                      
                      <div class="dates">
                          <div class="date-block">
                              <div class="date-label">Start Date</div>
                              <div class="date-value">${startDate.toLocaleDateString("en-GB")}</div>
                          </div>
                          <div class="date-block">
                              <div class="date-label">End Date</div>
                              <div class="date-value">${endDate.toLocaleDateString("en-GB")}</div>
                          </div>
                      </div>
                  </div>

                  <!-- Policy Details -->
                  <div class="details-section">
                      <h3 style="margin-top: 0; color: #1e293b; font-size: 20px; font-weight: 700; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                          <span>📋</span>
                          Policy Details
                      </h3>
                      
                      <div class="details-grid">
                          <div class="detail-item">
                              <div class="detail-label">Full Name</div>
                              <div class="detail-value">${policyData.userId.fullName}</div>
                          </div>
                          <div class="detail-item">
                              <div class="detail-label">Date of Birth</div>
                              <div class="detail-value">${new Date(policyData.userId.dateOfBirth).toLocaleDateString("en-GB")}</div>
                          </div>
                          <div class="detail-item">
                              <div class="detail-label">Vehicle Year</div>
                              <div class="detail-value">${policyData.vehicleInfo.yearOfManufacture}</div>
                          </div>
                          <div class="detail-item">
                              <div class="detail-label">Vehicle Make</div>
                              <div class="detail-value">${policyData.vehicleInfo.make}</div>
                          </div>
                          <div class="detail-item">
                              <div class="detail-label">Vehicle Model</div>
                              <div class="detail-value">${policyData.vehicleInfo.model}</div>
                          </div>
                          <div class="detail-item">
                              <div class="detail-label">Vehicle Color</div>
                              <div class="detail-value">${policyData.vehicleInfo.colour}</div>
                          </div>
                          <div class="detail-item">
                              <div class="detail-label">Registration</div>
                              <div class="detail-value">${policyData.vehicleInfo.vehicleRegistration || "To be added"}</div>
                          </div>
                          <div class="detail-item">
                              <div class="detail-label">Registered Keeper</div>
                              <div class="detail-value">${policyData.vehicleInfo.registeredKeeper || "To be added"}</div>
                          </div>
                      </div>
                  </div>

                  <!-- Payment Section -->
                  <div class="payment-section">
                      <div class="payment-title">Payment Summary</div>
                      <div class="payment-details">
                          <div class="payment-method">Premium Payment</div>
                          <div class="total-price">£${policyData.price.toLocaleString()}</div>
                      </div>
                  </div>
              </div>

              <!-- Footer -->
              <div class="footer">
                  <div class="esure-badge">ESURE INSURANCE</div>
                  <h3>Important Information</h3>
                  
                  <p><strong>Terms & Conditions:</strong> This insurance policy is subject to our standard terms and conditions. Please ensure you have read and understood all policy documents provided.</p>
                  
                  <p><strong>Claims:</strong> In the event of an incident, please contact our 24/7 claims hotline immediately on 0345 045 1000. Failure to report claims promptly may affect your coverage.</p>
                  
                  <p><strong>Policy Documents:</strong> Your full policy schedule and certificate of motor insurance is attached to this email. Please keep it safe and accessible.</p>
                  
                  <p><strong>Cancellation:</strong> You have a 14-day cooling off period during which you can cancel this policy for a full refund, provided no claims have been made.</p>
                  
                  <div class="contact-info">
                      <div class="contact-item">
                          <span>📞</span>
                          <span>Customer Service: 0345 045 1000</span>
                      </div>
                      <div class="contact-item">
                          <span>📧</span>
                          <span>Email: support@esure.com</span>
                      </div>
                      <div class="contact-item">
                          <span>🌐</span>
                          <span>Website: www.esure.com</span>
                      </div>
                      <div class="contact-item">
                          <span>🕒</span>
                          <span>Mon-Fri 8am-8pm, Sat 9am-5pm</span>
                      </div>
                  </div>
                  
                  <p style="margin-top: 20px; font-size: 11px; opacity: 0.7;">
                      Esure Insurance Limited. Registered in England No. 2494086. 
                      Registered Office: Pitheavlis, Perth PH2 0NH. 
                      Authorised by the Prudential Regulation Authority and regulated by the Financial Conduct Authority and the Prudential Regulation Authority.
                  </p>
              </div>
          </div>
      </body>
      </html>
    `;

    // Send email with attachment
    const emailResponse = await resend.emails.send({
      from: "Aviva Insurance <noreply@myavivacover.com>",
      to: [policyData.userId.email],
      subject: emailSubject,
      html: emailHtml,
      attachments: [
        {
          filename: `Policy Certificate ${policyData.policyNumber}.pdf`,
          content: documentBuffer,
        },
        {
          filename: "Your Aviva Policy Terms.pdf",
          content: termsBuffer,
        },
      ],
    });

    if (emailResponse.error) {
      console.error("Email sending error:", emailResponse.error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Policy certificate sent successfully",
      emailId: emailResponse.data?.id,
    });
  } catch (error) {
    console.error("Error sending policy email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
