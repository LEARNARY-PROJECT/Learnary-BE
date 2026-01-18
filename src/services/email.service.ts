import { transporter } from '../config/email.config';
import { Transaction, User, WithdrawRequest } from '../generated/prisma';
import { CourseApprovedData, OrderConfirmationData, SendEmailOptions, sendNoticeWithdrawProps, CourseRejectedData } from '../types/email';

export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"Learnary Platform" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
export const sendNoticeWithdrawApproved = async (data: sendNoticeWithdrawProps) => {
  try {
    const formattedAmount = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(Number(data.transaction.amount));
    const formattedDate = new Date(data.transaction.createdAt).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; }
          .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .success-icon { font-size: 60px; margin-bottom: 10px; }
          .content { padding: 30px; background: #f9fafb; }
          .greeting { font-size: 18px; margin-bottom: 15px; color: #1f2937; }
          .message { margin-bottom: 25px; color: #4b5563; }
          .withdraw-details { background: white; border-radius: 8px; padding: 20px; margin: 25px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .withdraw-details h2 { margin-top: 0; color: #059669; font-size: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
          .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-weight: 600; color: #6b7280; }
          .detail-value { color: #1f2937; text-align: right; max-width: 60%; }
          .amount-highlight { font-size: 28px; font-weight: bold; color: #059669; }
          .status-badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; }
          .info-box { background: #dbeafe; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #3b82f6; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">✅</div>
            <h1>Yêu Cầu Rút Tiền Đã Được Phê Duyệt!</h1>
          </div>
          <div class="content">
            <p class="greeting">Learnary xin chào <strong>${data.user.fullName || 'Giảng viên'}</strong>,</p>
            <p class="message">
              Chúng tôi xin thông báo rằng yêu cầu rút tiền của bạn đã được xử lý và <strong>phê duyệt thành công</strong>. 
              Số tiền sẽ được chuyển vào tài khoản ngân hàng của bạn trong vòng 1-3 ngày làm việc.
            </p>
            
            <div class="withdraw-details">
              <h2>💸 Thông Tin Rút Tiền</h2>
              
              <div class="detail-row">
                <span class="detail-label">Mã giao dịch:</span>
                <span class="detail-value"><strong>#${data.transaction.transaction_id.slice(0, 8).toUpperCase()}</strong></span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Số tiền rút:</span>
                <span class="detail-value amount-highlight">${formattedAmount}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Ngày yêu cầu:</span>
                <span class="detail-value">${formattedDate}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Trạng thái:</span>
                <span class="detail-value">
                  <span class="status-badge">✓ Đã phê duyệt</span>
                </span>
              </div>
            </div>
            
            <div class="info-box">
              <strong>📌 Lưu ý quan trọng:</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Số tiền sẽ được chuyển vào tài khoản ngân hàng bạn đã đăng ký</li>
                <li>Thời gian xử lý: 1-3 ngày làm việc</li>
                <li>Vui lòng kiểm tra tài khoản ngân hàng của bạn trong thời gian này</li>
                <li>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi</li>
              </ul>
            </div>
            
            <p style="color: #6b7280; margin-top: 20px;">
              Cảm ơn bạn đã đồng hà nh cùng <strong>Learnary Platform</strong>! Chúng tôi rất trân trọng sự đóng góp của bạn trong việc chia sẻ kiến thức. 🚀
            </p>
            
            <div class="footer">
              <p><strong>Learnary Platform</strong></p>
              <p>Email hỗ trợ: support@learnary.com | Website: ${process.env.FRONTEND_URL}</p>
              <p>© 2025 Learnary Platform. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: data.user.email,
      subject: `Yêu cầu rút tiền của bạn đã được phê duyệt - ${formattedAmount}`,
      html,
    });
  } catch (error) {
    console.error('❌ Lỗi khi gửi email xác nhận rút tiền:', error);
    throw new Error('Failed to send email confirm withdraw approved!');
  }
}

export const sendNoticeWithdrawRejected = async (data: sendNoticeWithdrawProps) => {
  try {
    const formattedAmount = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(Number(data.transaction.amount));

    const formattedDate = new Date(data.transaction.createdAt).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .warning-icon { font-size: 60px; margin-bottom: 10px; }
          .content { padding: 30px; background: #f9fafb; }
          .greeting { font-size: 18px; margin-bottom: 15px; color: #1f2937; }
          .message { margin-bottom: 25px; color: #4b5563; }
          .withdraw-details { background: white; border-radius: 8px; padding: 20px; margin: 25px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .withdraw-details h2 { margin-top: 0; color: #ef4444; font-size: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
          .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-weight: 600; color: #6b7280; }
          .detail-value { color: #1f2937; text-align: right; max-width: 60%; }
          .amount-highlight { font-size: 28px; font-weight: bold; color: #ef4444; }
          .status-badge { display: inline-block; background: #fee2e2; color: #991b1b; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; }
          .reason-box { background: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .refund-box { background: #d1fae5; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #059669; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="warning-icon">⚠️</div>
            <h1>Yêu Cầu Rút Tiền Không Được Chấp Nhận</h1>
          </div>
          <div class="content">
            <p class="greeting">Kính gửi <strong>${data.user.fullName || 'Giảng viên'}</strong>,</p>
            <p class="message">
              Chúng tôi xin thông báo rằng yêu cầu rút tiền của bạn đã được xem xét nhưng <strong>không thể thực hiện được</strong>. 
              Số tiền đã được hoàn lại vào ví của bạn.
            </p>
            
            <div class="withdraw-details">
              <h2>💸 Thông Tin Yêu Cầu</h2>
              
              <div class="detail-row">
                <span class="detail-label">Mã giao dịch:</span>
                <span class="detail-value"><strong>#${data.transaction.transaction_id.slice(0, 8).toUpperCase()}</strong></span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Số tiền yêu cầu:</span>
                <span class="detail-value amount-highlight">${formattedAmount}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Ngày yêu cầu:</span>
                <span class="detail-value">${formattedDate}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Trạng thái:</span>
                <span class="detail-value">
                  <span class="status-badge">✗ Từ chối</span>
                </span>
              </div>
            </div>
            
            <div class="reason-box">
              <strong>📝 Lý do từ chối:</strong>
              <p style="margin: 10px 0; color: #78350f;">${data.request.note || 'Vui lòng liên hệ bộ phận hỗ trợ để biết thêm chi tiết.'}</p>
            </div>
            
            <div class="refund-box">
              <strong>✅ Số tiền đã được hoàn trả:</strong>
              <p style="margin: 10px 0; color: #065f46;">
                Số tiền <strong>${formattedAmount}</strong> đã được hoàn lại vào ví của bạn. 
                Bạn có thể kiểm tra số dư ví hoặc thực hiện yêu cầu rút tiền mới.
              </p>
            </div>
            
            <p style="color: #6b7280; margin-top: 20px;">
              Nếu bạn có bất kỳ thắc mắc nào về việc từ chối này, vui lòng liên hệ với 
              đội ngũ hỗ trợ của chúng tôi qua email: support@learnary.com hoặc hotline: 1900-xxxx. 📞
            </p>
            
            <div class="footer">
              <p><strong>Learnary Platform</strong></p>
              <p>Email hỗ trợ: support@learnary.com | Website: ${process.env.FRONTEND_URL}</p>
              <p>© 2025 Learnary Platform. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: data.user.email,
      subject: `⚠️ Yêu cầu rút tiền không được chấp nhận - ${formattedAmount}`,
      html,
    });
  } catch (error) {
    console.error('❌ Lỗi khi gửi email thông báo từ chối rút tiền:', error);
    throw new Error('Failed to send email withdraw rejected!');
  }
}

export const sendNoticeApprovedInstructor = async (user: User) => {
  try {
    if (!user.email) {
      throw new Error('User không có email');
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; }
          .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .success-icon { font-size: 70px; margin-bottom: 15px; }
          .content { padding: 30px; background: #f9fafb; }
          .greeting { font-size: 18px; margin-bottom: 15px; color: #1f2937; }
          .message { margin-bottom: 25px; color: #4b5563; line-height: 1.8; }
          .welcome-box { background: linear-gradient(135deg, #eef2ff 0%, #f3e8ff 100%); border-radius: 8px; padding: 25px; margin: 25px 0; border: 2px solid #c7d2fe; }
          .welcome-box h2 { margin-top: 0; color: #6366f1; font-size: 22px; }
          .benefits { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .benefits h3 { color: #6366f1; margin-top: 0; font-size: 18px; }
          .benefit-item { display: flex; align-items: start; margin: 15px 0; }
          .benefit-icon { font-size: 24px; margin-right: 12px; flex-shrink: 0; }
          .benefit-text { color: #4b5563; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .next-steps { background: #fef3c7; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">🎓</div>
            <h1>Chúc Mừng! Bạn Đã Trở Thành Giảng Viên!</h1>
          </div>
          <div class="content">
            <p class="greeting">Kính gửi <strong>${user.fullName || 'Bạn'}</strong>,</p>
            <p class="message">
              Chúng tôi rất vui mừng thông báo rằng hồ sơ đăng ký giảng viên của bạn tại <strong>Learnary Platform</strong> 
              đã được xem xét và <strong style="color: #6366f1;">chính thức được phê duyệt</strong>! 🎉
            </p>
            
            <div class="welcome-box">
              <h2>👋 Chào Mừng Bạn Đến Với Đội Ngũ Giảng Viên!</h2>
              <p style="margin: 10px 0; color: #4b5563;">
                Bạn giờ đã có thể bắt đầu tạo và chia sẻ kiến thức của mình với hàng ngàn học viên 
                trên nền tảng của chúng tôi. Đây là một bước đi quan trọng trong hành trình giáo dục của bạn!
              </p>
            </div>
            
            <div class="benefits">
              <h3>✨ Quyền Lợi Của Giảng Viên</h3>
              
              <div class="benefit-item">
                <span class="benefit-icon">📚</span>
                <span class="benefit-text"><strong>Tạo khóa học không giới hạn:</strong> Đăng tải và quản lý các khóa học của bạn dễ dàng</span>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">💰</span>
                <span class="benefit-text"><strong>Thu nhập hấp dẫn:</strong> Nhận 90% doanh thu từ mỗi khóa học bán được</span>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">📈</span>
                <span class="benefit-text"><strong>Thống kê chi tiết:</strong> Theo dõi hiệu suất và doanh thu của bạn theo thời gian thực</span>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">🤝</span>
                <span class="benefit-text"><strong>Cộng đồng hỗ trợ:</strong> Kết nối với các giảng viên khác và đội ngũ hỗ trợ 24/7</span>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">🎯</span>
                <span class="benefit-text"><strong>Tiếp cận học viên:</strong> Tiếp cận với hàng ngàn học viên tiềm năng</span>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/instructor/dashboard" class="cta-button" style="color: white">Truy Cập Trang Quản Lý</a>
            </div>
            
            <div class="next-steps">
              <strong>🚀 Các Bước Tiếp Theo:</strong>
              <ol style="margin: 10px 0; padding-left: 20px; color: #78350f;">
                <li>Hoàn thiện hồ sơ giảng viên của bạn</li>
                <li>Cập nhật thông tin tài khoản ngân hàng để nhận thanh toán</li>
                <li>Tạo khóa học đầu tiên của bạn</li>
                <li>Đọc qua hướng dẫn dành cho giảng viên</li>
                <li>Bắt đầu chia sẻ kiến thức và kiếm tiền!</li>
              </ol>
            </div>
            
            <p style="color: #6b7280; margin-top: 20px;">
              Chúng tôi rất mong chờ được thấy những khóa học tuyệt vời mà bạn sẽ tạo ra. 
              Nếu có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi! 🚀
            </p>
            
            <div class="footer">
              <p><strong>Learnary Platform - Nơi Đầu Tư Vào Tương Lai</strong></p>
              <p>Hỗ trợ giảng viên: instructor-support@learnary.com | Website: ${process.env.FRONTEND_URL}</p>
              <p>© 2025 Learnary Platform. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: user.email,
      subject: '🎓 Chúc mừng! Bạn đã trở thành Giảng viên của Learnary',
      html,
    });
  } catch (error) {
    console.error('❌ Lỗi khi gửi email xác nhận phê duyệt giảng viên:', error);
    throw new Error('Failed to send email confirm instructor approve!');
  }
}

export const sendNoticeRejectedInstructor = async (user: User, reason?: string) => {
  try {
    if (!user.email) {
      throw new Error('User không có email');
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; }
          .header { background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .reject-icon { font-size: 70px; margin-bottom: 15px; }
          .content { padding: 30px; background: #f9fafb; }
          .greeting { font-size: 18px; margin-bottom: 15px; color: #1f2937; }
          .message { margin-bottom: 25px; color: #4b5563; line-height: 1.8; }
          .reject-box { background: linear-gradient(135deg, #fee2e2 0%, #fef2f2 100%); border-radius: 8px; padding: 25px; margin: 25px 0; border: 2px solid #fecaca; }
          .reject-box h2 { margin-top: 0; color: #dc2626; font-size: 22px; }
          .reason-box { background: #fff7ed; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .reason-box strong { color: #78350f; }
          .next-steps { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .next-steps h3 { color: #059669; margin-top: 0; font-size: 18px; }
          .step-item { display: flex; align-items: start; margin: 15px 0; }
          .step-icon { font-size: 24px; margin-right: 12px; flex-shrink: 0; }
          .step-text { color: #4b5563; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .support-box { background: #dbeafe; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #3b82f6; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="reject-icon">❌</div>
            <h1>Thông Báo Về Đăng Ký Giảng Viên</h1>
          </div>
          <div class="content">
            <p class="greeting">Kính gửi <strong>${user.fullName || 'Bạn'}</strong>,</p>
            <p class="message">
              Cảm ơn bạn đã quan tâm đến việc trở thành giảng viên tại <strong>Learnary Platform</strong>. 
              Sau khi xem xét kỹ lưỡng, chúng tôi rất tiếc phải thông báo rằng hồ sơ đăng ký giảng viên 
              của bạn <strong style="color: #dc2626;">chưa được phê duyệt</strong> lúc này.
            </p>
            
            <div class="reject-box">
              <h2>📋 Về Quyết Định Này</h2>
              <p style="margin: 10px 0; color: #4b5563;">
                Chúng tôi có tiêu chuẩn nghiêm ngặt để đảm bảo chất lượng giảng dạy cao nhất cho học viên. 
                Việc này không có nghĩa là bạn không đủ năng lực, mà có thể hồ sơ cần được cải thiện thêm.
              </p>
            </div>
            
            ${reason ? `
            <div class="reason-box">
              <strong>📝 Lý do từ chối:</strong>
              <p style="margin: 10px 0; color: #78350f;">${reason}</p>
            </div>
            ` : ''}
            
            <div class="next-steps">
              <h3>🚀 Bạn Có Thể Làm Gì Tiếp Theo?</h3>
              
              <div class="step-item">
                <span class="step-icon">✏️</span>
                <span class="step-text"><strong>Cập nhật hồ sơ:</strong> Hoàn thiện thêm thông tin, bằng cấp và kinh nghiệm của bạn</span>
              </div>
              
              <div class="step-item">
                <span class="step-icon">📚</span>
                <span class="step-text"><strong>Bổ sung chứng chỉ:</strong> Thêm các chứng chỉ liên quan đến lĩnh vực bạn muốn giảng dạy</span>
              </div>
              
              <div class="step-item">
                <span class="step-icon">🎯</span>
                <span class="step-text"><strong>Rõ ràng hơn:</strong> Mô tả rõ hơn về chuyên môn và kinh nghiệm giảng dạy</span>
              </div>
              
              <div class="step-item">
                <span class="step-icon">🔄</span>
                <span class="step-text"><strong>Nộp lại hồ sơ:</strong> Bạn có thể nộp lại hồ sơ sau khi cải thiện</span>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/instructor/apply" class="cta-button" style="color: white">Nộp Hồ Sơ Mới</a>
            </div>
            
            <div class="support-box">
              <strong>💬 Cần Hỗ Trợ?</strong>
              <p style="margin: 10px 0; color: #1e40af;">
                Nếu bạn có bất kỳ câu hỏi nào về quyết định này hoặc cần tư vấn về cách cải thiện hồ sơ, 
                đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn.
              </p>
            </div>
            
            <p style="color: #6b7280; margin-top: 20px;">
              Chúng tôi đánh giá cao sự quan tâm của bạn và mong được xem xét hồ sơ của bạn trong tương lai. 
              Đừng nản lòng - nhiều giảng viên thành công của chúng tôi đã từng trải qua quá trình này! 💪
            </p>
            
            <div class="footer">
              <p><strong>Learnary Platform - Nơi Đầu Tư Vào Tương Lai</strong></p>
              <p>Hỗ trợ: support@learnary.com | Hotline: 1900-xxxx</p>
              <p>Website: ${process.env.FRONTEND_URL}</p>
              <p>© 2025 Learnary Platform. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: user.email,
      subject: '📋 Thông báo về đăng ký giảng viên - Learnary Platform',
      html,
    });
  } catch (error) {
    console.error('❌ Lỗi khi gửi email từ chối giảng viên:', error);
    throw new Error('Failed to send instructor rejection email!');
  }
}

export const sendNoticeCourseRejected = async (data: CourseRejectedData) => {
  try {
    const formattedPrice = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(data.coursePrice);

    const formattedDate = new Date(data.rejectedAt).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; }
          .header { background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .reject-icon { font-size: 70px; margin-bottom: 15px; }
          .content { padding: 30px; background: #f9fafb; }
          .greeting { font-size: 18px; margin-bottom: 15px; color: #1f2937; }
          .message { margin-bottom: 25px; color: #4b5563; line-height: 1.8; }
          .course-info { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .course-info h3 { margin-top: 0; color: #dc2626; font-size: 20px; border-bottom: 2px solid #fee2e2; padding-bottom: 10px; }
          .info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
          .info-row:last-child { border-bottom: none; }
          .info-label { font-weight: 600; color: #6b7280; }
          .info-value { color: #1f2937; text-align: right; max-width: 60%; }
          .reason-box { background: #fff7ed; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .reason-box strong { color: #78350f; font-size: 16px; }
          .reason-content { margin: 10px 0; color: #92400e; padding: 10px; background: white; border-radius: 4px; }
          .improvement-tips { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .improvement-tips h3 { color: #059669; margin-top: 0; font-size: 18px; }
          .tip-item { display: flex; align-items: start; margin: 15px 0; }
          .tip-icon { font-size: 24px; margin-right: 12px; flex-shrink: 0; }
          .tip-text { color: #4b5563; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .support-box { background: #dbeafe; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #3b82f6; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="reject-icon">⚠️</div>
            <h1>Thông Báo Về Khóa Học Của Bạn</h1>
          </div>
          <div class="content">
            <p class="greeting">Kính gửi <strong>${data.instructorName}</strong>,</p>
            <p class="message">
              Cảm ơn bạn đã tạo và gửi khóa học để phê duyệt tại <strong>Learnary Platform</strong>. 
              Sau khi xem xét kỹ lưỡng, chúng tôi rất tiếc phải thông báo rằng khóa học của bạn 
              <strong style="color: #dc2626;">chưa đạt yêu cầu để được xuất bản</strong> lúc này.
            </p>
            
            <div class="course-info">
              <h3>📚 Thông Tin Khóa Học</h3>
              
              <div class="info-row">
                <span class="info-label">Tên khóa học:</span>
                <span class="info-value"><strong>${data.courseName}</strong></span>
              </div>
              
              ${data.courseDescription ? `
              <div class="info-row">
                <span class="info-label">Mô tả:</span>
                <span class="info-value">${data.courseDescription.substring(0, 100)}${data.courseDescription.length > 100 ? '...' : ''}</span>
              </div>
              ` : ''}
              
              <div class="info-row">
                <span class="info-label">Giá khóa học:</span>
                <span class="info-value"><strong>${formattedPrice}</strong></span>
              </div>
              
              <div class="info-row">
                <span class="info-label">Ngày xem xét:</span>
                <span class="info-value">${formattedDate}</span>
              </div>
              
              <div class="info-row">
                <span class="info-label">Trạng thái:</span>
                <span class="info-value"><span style="color: #dc2626; font-weight: bold;">❌ Chưa được duyệt</span></span>
              </div>
            </div>
            
            <div class="reason-box">
              <strong>📋 Lý Do Không Được Phê Duyệt:</strong>
              <div class="reason-content">${data.rejectionReason}</div>
            </div>
            
            <div class="improvement-tips">
              <h3>💡 Hướng Dẫn Cải Thiện</h3>
              
              <div class="tip-item">
                <span class="tip-icon">🎥</span>
                <span class="tip-text"><strong>Chất lượng video:</strong> Đảm bảo video rõ nét, âm thanh tốt, không có tiếng ồn nền</span>
              </div>
              
              <div class="tip-item">
                <span class="tip-icon">📝</span>
                <span class="tip-text"><strong>Nội dung khóa học:</strong> Đảm bảo nội dung đầy đủ, có cấu trúc rõ ràng và phù hợp với mô tả</span>
              </div>
              
              <div class="tip-item">
                <span class="tip-icon">🎯</span>
                <span class="tip-text"><strong>Mục tiêu học tập:</strong> Nêu rõ những gì học viên sẽ đạt được sau khóa học</span>
              </div>
              
              <div class="tip-item">
                <span class="tip-icon">✅</span>
                <span class="tip-text"><strong>Yêu cầu kỹ thuật:</strong> Tuân thủ các tiêu chuẩn về định dạng file, độ phân giải</span>
              </div>
              
              <div class="tip-item">
                <span class="tip-icon">📚</span>
                <span class="tip-text"><strong>Tài liệu bổ sung:</strong> Cung cấp slide, tài liệu tham khảo cho học viên</span>
              </div>
            </div>
            
            <p style="margin: 25px 0; color: #4b5563;">
              Bạn có thể chỉnh sửa khóa học theo các góp ý trên và gửi lại để xem xét. 
              Chúng tôi luôn sẵn sàng hỗ trợ bạn tạo ra khóa học chất lượng cao! 🚀
            </p>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/instructor/my-courses" class="cta-button" style="color: white">Chỉnh Sửa Khóa Học</a>
            </div>
            
            <div class="support-box">
              <strong>💬 Cần Hỗ Trợ?</strong>
              <p style="margin: 10px 0; color: #1e40af;">
                Nếu bạn có bất kỳ câu hỏi nào về quyết định này hoặc cần tư vấn về cách cải thiện khóa học, 
                đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn qua email: instructor-support@learnary.com
              </p>
            </div>
            
            <p style="color: #6b7280; margin-top: 20px;">
              Chúng tôi đánh giá cao nỗ lực của bạn và mong được đồng hành cùng bạn trong hành trình 
              chia sẻ kiến thức. Đừng nản lòng - nhiều khóa học thành công đã từng trải qua quá trình này! 💪
            </p>
            
            <div class="footer">
              <p><strong>Learnary Platform - Nơi Đầu Tư Vào Tương Lai</strong></p>
              <p>Hỗ trợ giảng viên: instructor-support@learnary.com | Website: ${process.env.FRONTEND_URL}</p>
              <p>© 2025 Learnary Platform. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: data.instructorEmail,
      subject: `⚠️ Khóa học "${data.courseName}" cần chỉnh sửa - Learnary Platform`,
      html,
    });
  } catch (error) {
    console.error('❌ Lỗi khi gửi email từ chối khóa học:', error);
    throw new Error('Failed to send course rejection email!');
  }
}

export const sendNoticeCourseApproved = async (data: CourseApprovedData) => {
  try {
    const formattedPrice = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(data.coursePrice);

    const formattedDate = new Date(data.approvedAt).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .success-icon { font-size: 70px; margin-bottom: 15px; }
          .content { padding: 30px; background: #f9fafb; }
          .greeting { font-size: 18px; margin-bottom: 15px; color: #1f2937; }
          .message { margin-bottom: 25px; color: #4b5563; line-height: 1.8; }
          .course-box { background: white; border-radius: 8px; padding: 25px; margin: 25px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #10b981; }
          .course-box h2 { margin-top: 0; color: #10b981; font-size: 22px; }
          .course-info { margin: 15px 0; }
          .info-label { font-weight: 600; color: #6b7280; display: inline-block; width: 140px; }
          .info-value { color: #1f2937; }
          .price-tag { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 18px; }
          .benefits { background: #ecfdf5; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #10b981; }
          .benefits h3 { color: #059669; margin-top: 0; font-size: 18px; }
          .benefit-item { display: flex; align-items: start; margin: 12px 0; }
          .benefit-icon { font-size: 20px; margin-right: 10px; flex-shrink: 0; }
          .benefit-text { color: #065f46; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .next-steps { background: #fef3c7; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">🎉</div>
            <h1>Chúc Mừng! Khóa Học Đã Được Phê Duyệt!</h1>
          </div>
          <div class="content">
            <p class="greeting">Kính gửi Giảng viên <strong>${data.instructorName}</strong>,</p>
            <p class="message">
              Chúng tôi rất vui mừng thông báo rằng khóa học của bạn đã được đội ngũ quản trị xem xét và 
              <strong style="color: #10b981;">đã chính thức được phê duyệt</strong>! 🎓
            </p>
            
            <div class="course-box">
              <h2>📚 Thông Tin Khóa Học</h2>
              
              <div class="course-info">
                <span class="info-label">Tên khóa học:</span>
                <span class="info-value"><strong>${data.courseName}</strong></span>
              </div>
              
              ${data.courseDescription ? `
              <div class="course-info">
                <span class="info-label">Mô tả:</span>
                <span class="info-value">${data.courseDescription.substring(0, 150)}${data.courseDescription.length > 150 ? '...' : ''}</span>
              </div>
              ` : ''}
              
              <div class="course-info">
                <span class="info-label">Giá bán:</span>
                <span class="info-value"><span class="price-tag">${formattedPrice}</span></span>
              </div>
              
              <div class="course-info">
                <span class="info-label">Ngày phê duyệt:</span>
                <span class="info-value">${formattedDate}</span>
              </div>
              
              <div class="course-info">
                <span class="info-label">Trạng thái:</span>
                <span class="info-value" style="color: #059669; font-weight: bold;">✓ Hoạt động</span>
              </div>
            </div>
            
            <div class="benefits">
              <h3>🚀 Khóa Học Của Bạn Giờ Đã:</h3>
              
              <div class="benefit-item">
                <span class="benefit-icon">✅</span>
                <span class="benefit-text">Hiển thị công khai trên nền tảng Learnary</span>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">✅</span>
                <span class="benefit-text">Sẵn sàng cho học viên đăng ký và thanh toán</span>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">✅</span>
                <span class="benefit-text">Bắt đầu tạo doanh thu cho bạn (90% thu nhập)</span>
              </div>
              
              <div class="benefit-item">
                <span class="benefit-icon">✅</span>
                <span class="benefit-text">Được đề xuất trong kết quả tìm kiếm và gợi ý</span>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/instructor/my-courses" class="cta-button" style="color: white">Xem Khóa Học Của Bạn</a>
            </div>
            
            <div class="next-steps">
              <strong>💡 Các Bước Tiếp Theo:</strong>
              <ul style="margin: 10px 0; padding-left: 20px; color: #78350f;">
                <li>Quảng bá khóa học của bạn trên mạng xã hội</li>
                <li>Theo dõi số lượng đăng ký và phản hồi từ học viên</li>
                <li>Cập nhật nội dung khóa học để luôn mới mẻ</li>
                <li>Tương tác với học viên qua phần hỏi đáp</li>
                <li>Chuẩn bị tạo thêm khóa học mới!</li>
              </ul>
            </div>
            
            <p style="color: #6b7280; margin-top: 20px;">
              Chúc mừng bạn với thành công này! Chúng tôi tin tưởng rằng khóa học của bạn sẽ mang lại giá trị lớn 
              cho hàng ngàn học viên. Tiếp tục chia sẻ kiến thức và truyền cảm hứng! 🌟
            </p>
            
            <div class="footer">
              <p><strong>Learnary Platform - Nơi Kiến Thức Không Giới Hạn</strong></p>
              <p>Hỗ trợ giảng viên: instructor-support@learnary.com | Website: ${process.env.FRONTEND_URL}</p>
              <p>© 2025 Learnary Platform. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: data.instructorEmail,
      subject: `🎉 Khóa học "${data.courseName}" đã được phê duyệt!`,
      html,
    });
  } catch (error) {
    console.error('❌ Lỗi khi gửi email xác nhận phê duyệt khóa học:', error);
    throw new Error('Failed to send email confirm course approved!');
  }
}

export const sendConfirmedEnrolledCourse = async (data: OrderConfirmationData) => {
  try {
    const { orderCode, courseName, coursePrice, transactionDate, buyerEmail, buyerName } = data;

    const formattedPrice = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(coursePrice);

    const formattedDate = new Date(transactionDate).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; }
          .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .success-icon { font-size: 60px; margin-bottom: 10px; }
          .content { padding: 30px; background: #f9fafb; }
          .greeting { font-size: 18px; margin-bottom: 15px; color: #1f2937; }
          .message { margin-bottom: 25px; color: #4b5563; }
          .order-details { background: white; border-radius: 8px; padding: 20px; margin: 25px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .order-details h2 { margin-top: 0; color: #4F46E5; font-size: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
          .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-weight: 600; color: #6b7280; }
          .detail-value { color: #1f2937; text-align: right; max-width: 60%; }
          .price-highlight { font-size: 24px; font-weight: bold; color: #059669; }
          .course-name { font-weight: bold; color: #4F46E5; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
          .support-info { background: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Xác nhận đơn hàng thanh toán thành công!</h1>
          </div>
          <div class="content">
            <p class="greeting">Xin chào <strong>${buyerName}</strong>,</p>
            <p class="message">
              Cảm ơn bạn đã tin tưởng và lựa chọn <strong>Learnary Platform</strong>! 
              Chúng tôi rất vui mừng thông báo rằng thanh toán của bạn đã được xác nhận thành công.
            </p>
            
            <div class="order-details">
              <h2>📋 Thông Tin Đơn Hàng</h2>
              
              <div class="detail-row">
                <span class="detail-label">Mã đơn hàng:  </span>
                <span class="detail-value"><strong>#${orderCode}</strong></span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Khóa học: </span>
                <span class="detail-value course-name">${courseName}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Ngày giờ giao dịch: </span>
                <span class="detail-value">${formattedDate}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Số tiền thanh toán: </span>
                <span class="detail-value price-highlight">${formattedPrice}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Trạng thái: </span>
                <span class="detail-value" style="color: #059669; font-weight: bold;">✓ Đã thanh toán</span>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/my-courses" class="cta-button" style="color: white">Bắt Đầu Học Ngay</a>
            </div>
            
            <div class="support-info">
              <strong>💡 Lưu ý:</strong> Bạn có thể truy cập khóa học bất cứ lúc nào trong phần "Khóa học của tôi". 
              Nếu cần hỗ trợ, vui lòng liên hệ với chúng tôi qua email: support@learnary.com
            </div>
            
            <p style="color: #6b7280; margin-top: 20px;">
              Chúc bạn có trải nghiệm học tập thú vị và đạt được những thành công trong hành trình học tập của mình! 🎓
            </p>
            
            <div class="footer">
              <p><strong>Learnary Platform</strong></p>
              <p>Email: support@learnary.com | Website: ${process.env.FRONTEND_URL}</p>
              <p>© 2025 Learnary Platform. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: buyerEmail,
      subject: `✅ Xác nhận thanh toán khóa học - Mã đơn #${orderCode}`,
      html,
    });
  } catch (error) {
    console.error('❌ Lỗi khi gửi email xác nhận:', error);
    throw new Error('Failed to send order confirmation email!');
  }
}
export const sendVerificationEmail = async (email: string, otp: string): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 5px 5px; }
        .otp-box { background: white; border: 2px dashed #4F46E5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px; }
        .otp-code { font-size: 32px; font-weight: bold; color: #4F46E5; letter-spacing: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Xác Thực Email</h1>
        </div>
        <div class="content">
          <p>Xin chào,</p>
          <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>Learnary Platform</strong>!</p>
          <p>Để hoàn tất quá trình đăng ký, vui lòng sử dụng mã OTP dưới đây:</p>
          
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>
          
          <p><strong>Lưu ý:</strong> Mã OTP này sẽ hết hạn sau <strong>10 phút</strong>.</p>
          <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
          
          <div class="footer">
            <p>© 2025 Learnary Platform. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Xác thực email - Learnary Platform',
    html,
  });
};

export const sendVerificationEmailWithLink = async (email: string, token: string): Promise<void> => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 5px 5px; }
        .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Xác Thực Email</h1>
        </div>
        <div class="content">
          <p>Xin chào,</p>
          <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>Learnary Platform</strong>!</p>
          <p>Vui lòng nhấn vào nút bên dưới để xác thực email của bạn:</p>
          
          <div style="text-align: center;">
            <a href="${verifyUrl}" class="button">Xác Thực Email</a>
          </div>
          
          <p>Hoặc copy link sau vào trình duyệt:</p>
          <p style="word-break: break-all; color: #4F46E5;">${verifyUrl}</p>
          
          <p><strong>Lưu ý:</strong> Link này sẽ hết hạn sau <strong>24 giờ</strong>.</p>
          <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
          
          <div class="footer">
            <p>© 2025 Learnary Platform. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Xác thực email - Learnary Platform',
    html,
  });
};
