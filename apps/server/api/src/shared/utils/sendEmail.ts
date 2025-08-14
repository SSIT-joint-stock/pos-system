import nodemailer from "nodemailer";

const email = "";
const password = "";

// Kiểm tra biến môi trường
if (!email || !password) {
  throw new Error("EMAIL or PASSWORD environment variables are missing.");
}

// Tạo transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: password, // dùng App Password thay vì mật khẩu Gmail thường
  },
});

// Interface định nghĩa dữ liệu gửi email
interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendVerificationCode = (
  to: string,
  subject: string,
  html: string
) => {
  const mail = {
    from: email, // dùng email từ biến môi trường
    to,
    subject,
    text: "Nội dung email dạng text", // tùy chọn
    html,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mail, (error, info) => {
      if (error) {
        console.error("Lỗi khi gửi email:", error);
        return reject(error);
      }
      console.log("Email đã được gửi:", info.response);
      resolve(info.response);
    });
  });
};
