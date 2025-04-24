import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from './src/config/prisma';
import { generatePixPayment, checkPaymentStatus } from './src/utils/mercadoPago';
import { randomUUID } from 'crypto';

// Helper function to generate a unique ticket code
function generateTicketCode() {
    // Format: OC-XXXX-XXXX (where X is alphanumeric)
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `OC-${randomPart.slice(0, 4)}-${randomPart.slice(4, 8)}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Max-Age', '86400');
        return res.status(204).end();
    }

    try {
        // GET /api/tickets - Get all tickets
        if (req.method === 'GET') {
            const { id, code, buyerId, eventId } = req.query;

            // Get a specific ticket by ID
            if (id) {
                const ticket = await prisma.ticket.findUnique({
                    where: { id: id as string },
                    include: {
                        event: true,
                        buyer: true
                    }
                });

                if (!ticket) {
                    return res.status(404).json({ error: 'Ticket not found' });
                }

                return res.status(200).json(ticket);
            }

            // Get a specific ticket by code
            if (code) {
                const ticket = await prisma.ticket.findUnique({
                    where: { code: code as string },
                    include: {
                        event: true,
                        buyer: true
                    }
                });

                if (!ticket) {
                    return res.status(404).json({ error: 'Ticket not found' });
                }

                return res.status(200).json(ticket);
            }

            // Get tickets by buyer ID
            if (buyerId) {
                const tickets = await prisma.ticket.findMany({
                    where: { buyerId: buyerId as string },
                    include: {
                        event: true
                    }
                });

                return res.status(200).json(tickets);
            }

            // Get tickets by event ID
            if (eventId) {
                const tickets = await prisma.ticket.findMany({
                    where: { eventId: eventId as string },
                    include: {
                        buyer: true
                    }
                });

                return res.status(200).json(tickets);
            }

            // Get all tickets (admin only)
            const tickets = await prisma.ticket.findMany({
                include: {
                    event: true,
                    buyer: true
                }
            });

            return res.status(200).json(tickets);
        }

        // POST /api/tickets - Create a new ticket and generate PIX payment
        if (req.method === 'POST') {
            const { eventId, buyerName, buyerEmail, buyerCpf } = req.body;

            if (!eventId || !buyerName || !buyerEmail || !buyerCpf) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Find the event
            const event = await prisma.event.findUnique({
                where: { id: eventId }
            });

            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }

            if (event.status !== 'available') {
                return res.status(400).json({ error: 'Tickets for this event are not available' });
            }

            if (!event.price) {
                return res.status(400).json({ error: 'This event does not have a price set' });
            }

            // Create or find the buyer
            let buyer = await prisma.buyer.findFirst({
                where: {
                    cpf: buyerCpf,
                    email: buyerEmail
                }
            });

            if (!buyer) {
                buyer = await prisma.buyer.create({
                    data: {
                        name: buyerName,
                        cpf: buyerCpf,
                        email: buyerEmail
                    }
                });
            }

            // Generate a unique ticket code
            const ticketCode = generateTicketCode();

            // Create the ticket with pending status
            const ticket = await prisma.ticket.create({
                data: {
                    code: ticketCode,
                    price: event.price,
                    status: 'pending',
                    event: {
                        connect: { id: eventId }
                    },
                    buyer: {
                        connect: { id: buyer.id }
                    }
                }
            });

            // Generate PIX payment
            const paymentDescription = `Ingresso ${event.title} - ${ticketCode}`;

            const payment = await generatePixPayment(
                Number(event.price),
                paymentDescription,
                buyerEmail,
                buyerName,
                ticket.id
            );

            // Update the ticket with payment ID
            await prisma.ticket.update({
                where: { id: ticket.id },
                data: {
                    paymentId: payment.id.toString(),
                    paymentMethod: 'pix'
                }
            });

            return res.status(201).json({
                ticket,
                payment: {
                    id: payment.id,
                    status: payment.status,
                    qrCode: payment.qrCode,
                    qrCodeBase64: payment.qrCodeBase64,
                    expirationDate: payment.expirationDate,
                    paymentUrl: payment.paymentUrl
                }
            });
        }

        // PUT /api/tickets/check/:id - Check payment status
        if (req.method === 'PUT' && req.url?.includes('/check/')) {
            const ticketId = req.url.split('/check/')[1];

            const ticket = await prisma.ticket.findUnique({
                where: { id: ticketId }
            });

            if (!ticket) {
                return res.status(404).json({ error: 'Ticket not found' });
            }

            if (!ticket.paymentId) {
                return res.status(400).json({ error: 'This ticket has no associated payment' });
            }

            const paymentStatus = await checkPaymentStatus(ticket.paymentId);

            // Update ticket status based on payment status
            if (paymentStatus.status === 'approved') {
                await prisma.ticket.update({
                    where: { id: ticket.id },
                    data: { status: 'paid' }
                });
            } else if (['rejected', 'cancelled', 'refunded'].includes(paymentStatus.status)) {
                await prisma.ticket.update({
                    where: { id: ticket.id },
                    data: { status: 'cancelled' }
                });
            }

            return res.status(200).json({
                ticketId: ticket.id,
                paymentId: ticket.paymentId,
                status: paymentStatus.status,
                statusDetail: paymentStatus.statusDetail
            });
        }

        // PUT /api/tickets/validate/:code - Validate a ticket (for entry)
        if (req.method === 'PUT' && req.url?.includes('/validate/')) {
            const ticketCode = req.url.split('/validate/')[1];

            const ticket = await prisma.ticket.findUnique({
                where: { code: ticketCode }
            });

            if (!ticket) {
                return res.status(404).json({ error: 'Ticket not found' });
            }

            if (ticket.status !== 'paid') {
                return res.status(400).json({
                    error: 'This ticket cannot be validated',
                    status: ticket.status
                });
            }

            if (ticket.usedAt) {
                return res.status(400).json({
                    error: 'This ticket has already been used',
                    usedAt: ticket.usedAt
                });
            }

            // Mark ticket as used
            const updatedTicket = await prisma.ticket.update({
                where: { id: ticket.id },
                data: {
                    status: 'used',
                    usedAt: new Date()
                },
                include: {
                    event: true,
                    buyer: true
                }
            });

            return res.status(200).json(updatedTicket);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Error processing ticket request:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
} 