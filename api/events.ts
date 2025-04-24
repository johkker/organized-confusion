import prisma from './src/config/prisma';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    try {
        // GET /api/events – get all events
        if (!id) {
            const events = await prisma.event.findMany({
                include: {
                    djs: true
                }
            });
            return Response.json(events);
        }

        // GET /api/events?id=XXX – get event by ID
        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                djs: true
            }
        });

        if (!event) {
            return Response.json({ error: 'Event not found' }, { status: 404 });
        }

        return Response.json(event);
    } catch (error) {
        console.error('Error processing request:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400'
        }
    });
} 