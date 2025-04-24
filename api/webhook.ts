import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from './src/config/prisma';
import { checkPaymentStatus } from './src/utils/mercadoPago';
import { config } from 'dotenv';

// Load environment variables
config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only accept POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get the notification data
    const { action, data } = req.body;

    // We're only interested in payment-related notifications
    if (action !== 'payment.created' && action !== 'payment.updated') {
        return res.status(200).json({ message: 'Notification received but not processed' });
    }

    try {
        // Extract the payment ID
        const paymentId = data.id;

        // Check the payment status
        const paymentStatus = await checkPaymentStatus(paymentId);

        // Find the ticket associated with this payment
        const ticket = await prisma.ticket.findFirst({
            where: { paymentId: paymentId.toString() }
        });

        if (!ticket) {
            console.error(`No ticket found for payment ID ${paymentId}`);
            return res.status(404).json({ error: 'Ticket not found' });
        }

        // Update the ticket status based on the payment status
        let newStatus = ticket.status;

        if (paymentStatus.status === 'approved') {
            newStatus = 'paid';
        } else if (['rejected', 'cancelled', 'refunded'].includes(paymentStatus.status)) {
            newStatus = 'cancelled';
        }

        // Only update if the status has changed
        if (newStatus !== ticket.status) {
            await prisma.ticket.update({
                where: { id: ticket.id },
                data: { status: newStatus }
            });

            console.log(`Updated ticket ${ticket.id} status to ${newStatus}`);
        }

        return res.status(200).json({
            message: 'Webhook processed successfully',
            ticketId: ticket.id,
            paymentId,
            status: paymentStatus.status
        });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
} 