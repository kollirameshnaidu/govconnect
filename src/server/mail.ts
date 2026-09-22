import nodemailer, { type Transporter } from "nodemailer";
import { appBaseUrl } from "@/server/app-url";

type GlobalMail = typeof globalThis & {
  __gcMailer?: Transporter;
};

function smtpConfig() {
  const host = process.env.SMTP_HOST ?? "";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER ?? "";
  const pass = process.env.SMTP_PASSWORD ?? "";
  const from = process.env.SMTP_FROM || user;
  return { host, port, user, pass, from };
}

export function isSmtpConfigured() {
  const { host, user, pass, from } = smtpConfig();
  return Boolean(host && user && pass && from);
}

function transport() {
  const { host, port, user, pass } = smtpConfig();
  if (!host || !user || !pass) {
    throw new Error("Email is not configured.");
  }
  const globalMail = globalThis as GlobalMail;
  if (!globalMail.__gcMailer) {
    globalMail.__gcMailer = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      requireTLS: port === 587,
      name: user.split("@")[1] || host,
      auth: { user, pass },
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 20000,
      tls: {
        minVersion: "TLSv1.2",
        servername: host,
      },
    });
  }
  return globalMail.__gcMailer;
}

async function sendMail(options: { to: string; subject: string; text: string; html: string }) {
  if (!isSmtpConfigured()) {
    throw new Error("Email is not configured.");
  }
  const { from, user } = smtpConfig();
  try {
    await transport().sendMail({
      from,
      envelope: { from: user || from, to: options.to },
      ...options,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not send email.";
    console.error("[mail] send failed", message);
    throw new Error("Could not send email.");
  }
}

function brandedEmail(title: string, preview: string, buttonLabel: string, href: string) {
  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;background:#f4f1ea;font-family:Noto Sans,Arial,sans-serif;color:#1b1b1b;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f1ea;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid:#d9d4c8;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="background:#0b3a66;color:#ffffff;padding:20px 24px;font-size:20px;font-weight:700;">GovConnect</td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <p style="margin:0 0 12px;font-size:18px;font-weight:700;color:#0b3a66;">${title}</p>
                <p style="margin:0 0 20px;font-size:14px;line-height:1.6;">${preview}</p>
                <p style="margin:0 0 28px;">
                  <a href="${href}" style="display:inline-block;background:#e36f1e;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:6px;">${buttonLabel}</a>
                </p>
                <p style="margin:0;font-size:12px;line-height:1.6;color:#5c584f;">If the button does not work, copy this link into your browser:<br />${href}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;background:#f8f5ef;font-size:12px;color:#5c584f;">Government Appointment Management System. This is a transactional message from GovConnect.</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const href = `${appBaseUrl()}/reset-password?token=${encodeURIComponent(token)}`;
  await sendMail({
    to,
    subject: "Reset your GovConnect password",
    text: `Reset your GovConnect password using this link, which expires in one hour:\n${href}`,
    html: brandedEmail(
      "Reset your password",
      "We received a request to reset the password for this GovConnect account. The link expires in one hour and can be used only once.",
      "Reset Password",
      href,
    ),
  });
}

export async function sendRegistrationConfirmEmail(to: string, name: string, token: string) {
  const href = `${appBaseUrl()}/confirm-email?token=${encodeURIComponent(token)}`;
  const safeName = name.replace(/[<>&]/g, "");
  await sendMail({
    to,
    subject: "Confirm your GovConnect email address",
    text: `Hello ${safeName},\n\nConfirm your GovConnect email address using this link. It expires in 24 hours:\n${href}`,
    html: brandedEmail(
      "Confirm your email address",
      `Hello ${safeName}, thank you for registering with GovConnect. Confirm this email address to finish creating your citizen account. The link expires in 24 hours.`,
      "Confirm Email Address",
      href,
    ),
  });
}
