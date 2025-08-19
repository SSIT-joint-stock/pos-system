export type EmailVars =
  | { type: "verify"; otp: string; minutes: number; link: string }
  | { type: "reset"; link: string }
  | { type: "welcome"; username: string };

export type buildEmailTemplate = { subject: string; htmlBody: string; textBody?: string };

export function buildEmailTemplate(vars: EmailVars): buildEmailTemplate {
  switch (vars.type) {
    case "verify":
      return {
        subject: "Xác thực email của bạn",
        htmlBody: `
      <div style="font-family: Arial, sans-serif; line-height:1.6;">
        <h2>Hoàn tất xác thực email</h2>
        <p>Mã OTP của bạn:</p>
        <div style="font-size:24px; font-weight:bold; text-align:center; letter-spacing:2px;">${vars.otp}</div>
        <p>Mã sẽ hết hạn trong <b>${vars.minutes}</b> phút.</p>

        <hr style="margin:24px 0;"/>

        <p>Hoặc bấm nút dưới đây để xác thực ngay (không cần nhập mã):</p>
        <p style="text-align:center;">
          <a href="${vars.link}" style="display:inline-block; padding:12px 18px; text-decoration:none; border-radius:8px; background:#10b981; color:#fff; font-weight:600;">
            Xác thực ngay
          </a>
        </p>

        <p>Nếu nút không hoạt động, copy link này dán vào trình duyệt:</p>
        <p style="word-break:break-all;"><a href="${vars.link}">${vars.link}</a></p>

        <p style="color:#6b7280; font-size:12px;">Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
      </div>
    `,
        textBody: "Đây là email được gửi từ eraPos"
      };
    case "reset":
      return {
        subject: "Đặt lại mật khẩu",
        htmlBody: `
        <b>Xin chào!</b><br><br>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
        <p>Vui lòng nhấp vào liên kết dưới đây để thay đổi mật khẩu:</p>
        <p style="text-align: center;">
          <a href="${vars.link}" 
            style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; 
                    color: white; text-decoration: none; border-radius: 5px;">
            Đổi mật khẩu
          </a>
        </p>
        <p>Liên kết này sẽ hết hạn sau <strong>15 phút</strong>.</p>
        <p>Nếu bạn không yêu cầu đổi mật khẩu, hãy bỏ qua email này.</p>
        <hr>
        <p style="font-size: 12px; color: #777;">
          Đây là email tự động, vui lòng không trả lời.
        </p>`,
        textBody: "Đây là email được gửi từ eraPos",
      };
    case "welcome":
      return {
        subject: "Chào mừng!",
        htmlBody: `<h2>Xin chào ${vars.username}</h2><p>Cảm ơn đã đăng ký.</p>`,
        textBody: "Welcome",
      };
  }
}
