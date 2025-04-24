import { create } from 'zustand'
import { fetchEvents } from '../services/api'

export interface Artist {
    name: string
    role: string
    time?: string
    social?: {
        instagram?: string
        soundcloud?: string
    }
}

export interface Event {
    id: string
    title: string
    date: string
    time: string
    location: string
    description: string
    imageUrl: string
    ticketLink: string | null
    isPast: boolean
    status: 'available' | 'coming-soon' | 'sold-out'
    price?: string
    djs?: {
        id: string
        name: string
    }[]
}

interface EventStore {
    events: Event[]
    loading: boolean
    error: string | null
    fetchEvents: () => Promise<void>
    setEvents: (events: Event[]) => void
    addEvent: (event: Event) => void
    removeEvent: (id: string) => void
    updateEvent: (id: string, event: Partial<Event>) => void
}

// Default events as fallback
const defaultEvents: Event[] = [
    {
        id: '1',
        title: "B'day Party",
        date: '05 Abril 2025',
        time: '16:00',
        location: 'Pinhais, PR',
        description: 'Open Cooler, piscina e 24h de muitaaaa psicodelia. Uma celebração única com os melhores DJs da cena local e muitas surpresas para você curtir!',
        imageUrl: 'https://i.imgur.com/pGbpAdL.png',
        ticketLink: 'https://pixta.me/u/aniversarios-2025-oc',
        isPast: true,
        status: 'available',
        price: 'R$ 50,00'
    },
    {
        id: '2',
        title: 'DARK-TECH',
        date: '17 Maio 2025',
        time: '21:00',
        location: 'Oroboro Underground - Curitiba, PR',
        description: 'A gente simplesmente não consegue ficar sem trazer uma bagunça para vocês. Dessa vez, uma noite dedicada ao melhor que temos de dark-psy e hi-tech! No coração da cidade, no bar mais underground da cena, Oroboro Underground.',
        imageUrl: 'https://s3.sa-east-1.amazonaws.com/pixtame-public/qtu7euqkss2c73uejy204qrzc2a4.webp',
        ticketLink: 'https://pixta.me/u/organized-confusion-dark_tech-pokt-edition',
        isPast: false,
        status: 'available'
    }
]

export const useEventStore = create<EventStore>((set) => ({
    events: [],
    loading: false,
    error: null,
    fetchEvents: async () => {
        set({ loading: true, error: null });
        try {
            const data = await fetchEvents();
            set({ events: data, loading: false });
        } catch (error) {
            console.error('Failed to fetch events:', error);
            set({
                events: defaultEvents,
                loading: false,
                error: 'Failed to fetch events. Using fallback data.'
            });
        }
    },
    setEvents: (events) => set({ events }),
    addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
    removeEvent: (id) => set((state) => ({ events: state.events.filter((e) => e.id !== id) })),
    updateEvent: (id, event) => set((state) => ({
        events: state.events.map((e) => (e.id === id ? { ...e, ...event } : e))
    }))
})) 