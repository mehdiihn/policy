import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Policy from "@/lib/models/Policy";
import User from "@/lib/models/User";
import { pdfProcessor } from "@/lib/pdfProcessor";
import { Resend } from "resend";
import fs from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { policyId } = await request.json();

    if (!policyId) {
      return NextResponse.json(
        { error: "Policy ID is required" },
        { status: 400 }
      );
    }

    // Fetch the policy with populated user data
    const policy = await Policy.findById(policyId)
      .populate("userId", "fullName email address dateOfBirth")
      .populate("createdBy", "fullName email")
      .lean();

    if (!policy) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }

    // Generate the policy document (PDF)
    const documentBuffer = await pdfProcessor.generatePolicyDocument(policy as any);
    // If you want to convert DOCX to PDF, add conversion here

    // Read the additional terms PDF file
    const termsFilePath = path.join(process.cwd(), "public", "Esure Policy Termspdf.pdf");
    const termsBuffer = fs.readFileSync(termsFilePath);

    // Prepare email content
    const policyData = policy as any;
    const emailSubject = `Your Esure Insurance Policy Certificate - ${policyData.policyNumber}`;

    // Calculate policy duration
    const startDate = new Date(policyData.startDate);
    const endDate = new Date(policyData.endDate);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const carBgSvg = `url('data:image/svg+xml;utf8,<svg width="600" height="240" viewBox="0 0 600 240" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="120" fill="white"/><path d="M0 100 Q 100 80 200 100 T 400 100 T 600 100 V120 H0Z" fill="%230072ce"/><ellipse cx="500" cy="100" rx="50" ry="10" fill="%23333" fill-opacity="0.08"/><rect x="440" y="70" width="90" height="30" rx="15" fill="%23ffb300"/><rect x="460" y="55" width="50" height="25" rx="12" fill="white"/><circle cx="460" cy="100" r="10" fill="%23222"/><circle cx="520" cy="100" r="10" fill="%23222"/><rect x="480" y="85" width="10" height="10" rx="4" fill="%230072ce"/><rect x="510" y="85" width="10" height="10" rx="4" fill="%230072ce"/><rect x="470" y="60" width="10" height="10" rx="5" fill="%23fbbf24"/><rect x="520" y="60" width="10" height="10" rx="5" fill="%23fbbf24"/></svg>')`;
    const carBgSvgImg = `<img src='https://svgshare.com/i/16kA.svg' width='100%' alt='' style='display:block;width:100%;max-width:600px;margin-bottom:-40px;'>`;
    const emailHtml = `
<style>
  @media only screen and (max-width: 480px) {
    .esure-main-card { width: 98vw !important; min-width: 0 !important; max-width: 98vw !important; }
    .esure-padded { padding-left: 8px !important; padding-right: 8px !important; }
    .esure-title { font-size: 18px !important; }
    .esure-section-title { font-size: 15px !important; }
    .esure-section-content { font-size: 13px !important; }
    .esure-logo { width: 56px !important; max-width: 56px !important; }
    .esure-svg { width: 100% !important; max-width: 180px !important; height: auto !important; }
    .esure-card { width: 100% !important; max-width: 100% !important; margin-bottom: 16px !important; }
  }
</style>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#181F2A;padding:0;margin:0;min-height:100vh;">
  <tr>
    <td align="center">
      <table class="esure-main-card" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#1e293b 0%,#2563eb 100%);border-radius:24px;box-shadow:0 8px 32px rgba(0,0,0,0.18);margin:32px auto;overflow:hidden;max-width:400px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:#2563eb;padding:24px 0 12px 0;border-radius:24px 24px 0 0;text-align:center;">
            <img class="esure-logo" src="https://i.imgur.com/tkeATGM.png" alt="esure" style="display:block;margin:0 auto 12px auto;border-radius:12px;max-width:90px;width:90px;height:auto;">
            <div style="color:#fff;font-family:Poppins,Arial,sans-serif;font-size:18px;font-weight:bold;letter-spacing:1px;margin-bottom:4px;">
              Policy no: <span style="background:#222;color:#fff;padding:2px 8px;border-radius:8px;font-weight:bold;display:inline-block;">${policyData.policyNumber}</span>
            </div>
          </td>
        </tr>
        <!-- Welcome Message -->
        <tr>
          <td align="center" class="esure-padded" style="padding:16px 16px 0 16px;">
            <h1 class="esure-title" style="font-family:Poppins,Arial,sans-serif;font-size:22px;color:#fff;margin:0 0 8px 0;font-weight:700;line-height:1.2;letter-spacing:0.5px;">
              Welcome to <span style="background:#ffeb3b;color:#222;padding:2px 8px;border-radius:6px;">esure</span>
            </h1>
            <p style="font-family:Poppins,Arial,sans-serif;font-size:15px;color:#60a5fa;margin:0 0 8px 0;font-weight:500;">
              Hi ${policyData.userId.fullName},
            </p>
            <p style="font-family:Poppins,Arial,sans-serif;font-size:14px;color:#cbd5e1;margin:0 0 12px 0;">
              Your policy is now active! 🎉<br>Thanks for choosing us for your car insurance.
            </p>
          </td>
        </tr>
        <!-- Policy Status Card -->
        <tr>
          <td class="esure-padded" style="padding:0 16px 0 16px;">
            <table class="esure-card" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#23272f;border-radius:18px;box-shadow:0 2px 8px rgba(0,0,0,0.10);margin:16px 0 8px 0;">
              <tr>
                <td class="esure-section-title" style="font-family:Poppins,Arial,sans-serif;font-size:16px;color:#fff;font-weight:600;text-align:center;padding-bottom:4px;">Policy Status</td>
              </tr>
              <tr>
                <td class="esure-section-content" style="font-family:Poppins,Arial,sans-serif;font-size:14px;color:#cbd5e1;text-align:center;">Policy Number:</td>
              </tr>
              <tr>
                <td class="esure-section-content" style="font-family:Poppins,Arial,sans-serif;font-size:16px;color:#fff;font-weight:bold;text-align:center;letter-spacing:1px;">${policyData.policyNumber}</td>
              </tr>
              <tr>
                <td class="esure-section-content" style="font-family:Poppins,Arial,sans-serif;font-size:14px;color:#cbd5e1;text-align:center;">Status:</td>
              </tr>
              <tr>
                <td style="text-align:center;padding-bottom:8px;">
                  <span style="display:inline-block;vertical-align:middle;background:#22c55e;padding:2px 16px;border-radius:12px;font-family:Poppins,Arial,sans-serif;font-size:14px;color:#fff;font-weight:600;box-shadow:0 1px 4px rgba(34,197,94,0.18);">
                    ACTIVE
                  </span>
                </td>
              </tr>
              <tr>
                <td class="esure-section-content" style="font-family:Poppins,Arial,sans-serif;font-size:14px;color:#cbd5e1;text-align:center;">Coverage:</td>
              </tr>
              <tr>
                <td class="esure-section-content" style="font-family:Poppins,Arial,sans-serif;font-size:14px;color:#fff;text-align:center;font-weight:500;">Comprehensive</td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Policy Period Card -->
        <tr>
          <td class="esure-padded" style="padding:0 16px 0 16px;">
            <table class="esure-card" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#2563eb;border-radius:18px;box-shadow:0 2px 8px rgba(0,0,0,0.10);margin:0 0 8px 0;">
              <tr>
                <td class="esure-section-title" style="font-family:Poppins,Arial,sans-serif;font-size:16px;color:#fff;font-weight:600;text-align:center;padding-bottom:4px;">Policy Period</td>
              </tr>
              <tr>
                <td class="esure-section-content" style="font-family:Poppins,Arial,sans-serif;font-size:14px;color:#fff;text-align:center;">Start Date:</td>
              </tr>
              <tr>
                <td class="esure-section-content" style="font-family:Poppins,Arial,sans-serif;font-size:15px;color:#fff;text-align:center;font-weight:500;">${new Date(policyData.startDate).toLocaleDateString("en-GB")}</td>
              </tr>
              <tr>
                <td class="esure-section-content" style="font-family:Poppins,Arial,sans-serif;font-size:14px;color:#fff;text-align:center;">End Date:</td>
              </tr>
              <tr>
                <td class="esure-section-content" style="font-family:Poppins,Arial,sans-serif;font-size:15px;color:#fff;text-align:center;font-weight:500;">${new Date(policyData.endDate).toLocaleDateString("en-GB")}</td>
              </tr>
              <tr>
                <td class="esure-section-content" style="font-family:Poppins,Arial,sans-serif;font-size:14px;color:#fff;text-align:center;">Duration:</td>
              </tr>
              <tr>
                <td class="esure-section-content" style="font-family:Poppins,Arial,sans-serif;font-size:15px;color:#fff;text-align:center;font-weight:700;">${diffDays} Months</td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Vehicle Info Card -->
        <tr>
          <td class="esure-padded" style="padding:0 16px 0 16px;">
            <table class="esure-card" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#fff;border-radius:18px;box-shadow:0 2px 8px rgba(0,0,0,0.10);margin:0 0 8px 0;">
              <tr>
                <td class="esure-section-title" style="font-family:Poppins,Arial,sans-serif;font-size:16px;color:#23272f;font-weight:700;text-align:center;padding-bottom:4px;">Vehicle Information</td>
              </tr>
              <tr>
                <td class="esure-section-content" style="font-family:Poppins,Arial,sans-serif;font-size:14px;color:#23272f;text-align:center;">${policyData.vehicleInfo.make} (${policyData.vehicleInfo.colour})</td>
              </tr>
              <tr>
                <td class="esure-section-content" style="font-family:Poppins,Arial,sans-serif;font-size:14px;color:#23272f;text-align:center;">Registration: <span style="color:#2563eb;font-weight:600;">${policyData.vehicleInfo.vehicleRegistration || "To be added"}</span></td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Payment Info Card -->
        <tr>
          <td class="esure-padded" style="padding:0 16px 24px 16px;">
            <table class="esure-card" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#fff;border-radius:18px;box-shadow:0 2px 8px rgba(0,0,0,0.10);margin:0 0 16px 0;">
              <tr>
                <td class="esure-section-title" style="font-family:Poppins,Arial,sans-serif;font-size:16px;color:#23272f;font-weight:700;text-align:center;padding-bottom:4px;">Payment</td>
              </tr>
              <tr>
                <td class="esure-section-content" style="font-family:Poppins,Arial,sans-serif;font-size:14px;color:#23272f;text-align:center;">Amount Paid:</td>
              </tr>
              <tr>
                <td class="esure-section-content" style="font-family:Poppins,Arial,sans-serif;font-size:15px;color:#2563eb;text-align:center;font-weight:700;">£${policyData.price.toLocaleString()}</td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td align="center" style="background:#181F2A;padding:16px 0 0 0;border-radius:0 0 24px 24px;">
            <div style="font-family:Poppins,Arial,sans-serif;font-size:13px;color:#cbd5e1;margin-bottom:8px;">
              <strong>Need help?</strong> Contact us at <a href="mailto:support@esure.com" style="color:#60a5fa;text-decoration:none;">support@esure.com</a> or call <a href="tel:03450451000" style="color:#60a5fa;text-decoration:none;">0345 045 1000</a>
            </div>
            <div style="font-family:Poppins,Arial,sans-serif;font-size:11px;color:#64748b;">
              Esure Insurance Limited, Registered in England No. 2494086.<br>
              Customer Service: 0345 045 1000
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;

    // Send email with attachment
    const emailResponse = await resend.emails.send({
      from: "Esure Insurance <noreply@myavivacover.com>",
      to: [policyData.userId.email],
      subject: emailSubject,
      html: emailHtml,
      attachments: [
        {
          filename: `Policy Certificate ${policyData.policyNumber}.pdf`,
          content: documentBuffer,
        },
        {
          filename: "Esure Policy Termspdf.pdf",
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
