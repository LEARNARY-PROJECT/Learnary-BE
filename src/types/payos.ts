// Định nghĩa cấu trúc dữ liệu tạo link thanh toán
export interface CreatePaymentParams {
    orderCode: number;
    amount: number;
    description: string;
    cancelUrl: string;
    returnUrl: string;
    // Các field optional khác nếu cần (items, buyerName...)
}

// Định nghĩa cấu trúc Webhook nhận từ PayOS (Dựa theo file .d.ts bạn gửi)
export interface PayOSWebhookBody {
    code: string;
    desc: string;
    success: boolean;
    data: PayOSWebhookData;
    signature: string;
}

export interface PayOSWebhookData {
    orderCode: number;
    amount: number;
    description: string;
    accountNumber: string;
    reference: string;
    transactionDateTime: string;
    currency: string;
    paymentLinkId: string;
    code: string;
    desc: string;
    counterAccountBankId?: string | null;
    counterAccountBankName?: string | null;
    counterAccountName?: string | null;
    counterAccountNumber?: string | null;
    virtualAccountName?: string | null;
    virtualAccountNumber?: string | null;
}