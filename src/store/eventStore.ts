import { create } from 'zustand'

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
    ticketLink: string
    isPast: boolean
    status: 'available' | 'coming-soon' | 'sold-out'
    price?: string
    lineup?: Artist[]
}

interface EventStore {
    events: Event[]
    setEvents: (events: Event[]) => void
    addEvent: (event: Event) => void
    removeEvent: (id: string) => void
    updateEvent: (id: string, event: Partial<Event>) => void
}

export const useEventStore = create<EventStore>((set) => ({
    events: [
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
            price: 'R$ 50,00',
            lineup: [
                {
                    name: 'DJ Fulano',
                    role: 'dj',
                    time: '16:00 - 18:00',
                    social: {
                        instagram: '@djfulano',
                        soundcloud: 'soundcloud.com/djfulano'
                    }
                },
                {
                    name: 'VJ Beltrano',
                    role: 'vj',
                    time: '16:00 - 00:00',
                    social: {
                        instagram: '@vjbeltrano'
                    }
                },
                {
                    name: 'DJ Ciclano',
                    role: 'dj',
                    time: '18:00 - 20:00',
                    social: {
                        instagram: '@djciclano',
                        soundcloud: 'soundcloud.com/djciclano'
                    }
                }
            ]
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
            status: 'available',
            lineup: [
                {
                    name: 'Adarrun',
                    role: 'dj',
                    time: '00:00 - 03:00',
                },
                {
                    name: 'DARTRIX',
                    role: 'dj',
                    time: '23:00 - 01:00',
                },
                {
                    name: 'AMMINT',
                    role: 'dj',
                    time: '21:00 - 23:00',
                },
                {
                    name: 'Slippermode',
                    role: 'dj',
                    time: '03:00 - 05:00',
                }
            ]
        }
    ],
    setEvents: (events) => set({ events }),
    addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
    removeEvent: (id) => set((state) => ({ events: state.events.filter((e) => e.id !== id) })),
    updateEvent: (id, event) => set((state) => ({
        events: state.events.map((e) => (e.id === id ? { ...e, ...event } : e))
    }))
})) 