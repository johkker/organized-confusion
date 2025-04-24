import { config } from 'dotenv';

// Load environment variables
config();

/**
 * Generates a PIX payment for a ticket purchase
 * 
 * @param amount - The amount to charge in BRL
 * @param description - Description of the payment
 * @param buyerEmail - Email of the buyer
 * @param buyerName - Name of the buyer
 * @param reference - Reference ID (usually the ticket ID)
 * @returns The payment data including PIX QR code
 */
export async function generatePixPayment(
    amount: number,
    description: string,
    buyerEmail: string,
    buyerName: string,
    reference: string
) {
    try {
        // Mercado Pago API requires an access token
        const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

        if (!MP_ACCESS_TOKEN) {
            throw new Error('Mercado Pago access token is not configured');
        }

        // Call Mercado Pago API to create a payment
        const response = await fetch('https://api.mercadopago.com/v1/payments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                transaction_amount: amount,
                description: description,
                payment_method_id: 'pix',
                payer: {
                    email: buyerEmail,
                    first_name: buyerName.split(' ')[0],
                    last_name: buyerName.split(' ').slice(1).join(' ') || ' '
                },
                external_reference: reference
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Mercado Pago API error:', data);
            throw new Error(`Payment creation failed: ${data.message || 'Unknown error'}`);
        }

        return {
            id: data.id,
            status: data.status,
            qrCode: data.point_of_interaction.transaction_data.qr_code,
            qrCodeBase64: data.point_of_interaction.transaction_data.qr_code_base64,
            expirationDate: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
            paymentUrl: data.point_of_interaction.transaction_data.ticket_url
        };
    } catch (error) {
        console.error('Error generating PIX payment:', error);
        throw error;
    }
}

/**
 * Check the status of a payment
 * 
 * @param paymentId - The Mercado Pago payment ID
 * @returns The payment status
 */
export async function checkPaymentStatus(paymentId: string) {
    try {
        const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

        if (!MP_ACCESS_TOKEN) {
            throw new Error('Mercado Pago access token is not configured');
        }

        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Mercado Pago API error:', data);
            throw new Error(`Payment status check failed: ${data.message || 'Unknown error'}`);
        }

        return {
            id: data.id,
            status: data.status,
            statusDetail: data.status_detail,
            externalReference: data.external_reference
        };
    } catch (error) {
        console.error('Error checking payment status:', error);
        throw error;
    }
} 