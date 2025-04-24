// Use dynamic import for bcryptjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const bcrypt = require('bcryptjs');

import { config } from 'dotenv';
import prisma from '../config/prisma';

// Load environment variables
config();

async function seed() {
    console.log('Starting database seeding...');

    try {
        // Clear existing data
        console.log('Clearing existing data...');
        await prisma.ticket.deleteMany();
        await prisma.album.deleteMany();
        await prisma.event.deleteMany();
        await prisma.dJ.deleteMany();
        await prisma.user.deleteMany();

        // Create admin user
        console.log('Creating admin user...');
        const adminPassword = await bcrypt.hash('admin123', 10);
        const admin = await prisma.user.create({
            data: {
                name: 'Admin',
                email: 'admin@organizedconfusion.com',
                password: adminPassword,
                whatsappNumber: '5541999999999',
                zipcode: '80000000',
                cpf: '00000000000',
                dateOfBirth: new Date('1990-01-01'),
                admin: true
            }
        });

        // Create DJs
        console.log('Creating DJs...');
        const adarrun = await prisma.dJ.create({
            data: {
                name: 'Adarrun',
                description: 'Explorando os limites da psicodelia sonora, Adarrun despensa apresentações. Só sentindo a pista, para entender.',
                image: 'https://i1.sndcdn.com/avatars-Q4d8RgXR0Erj0EbO-mqDFqg-t500x500.jpg',
                soundcloud: 'https://soundcloud.com/adarrun',
                trackId: '1393743490',
                genres: ['Dark Psy', 'Dark Hi-Tech', 'Hi-Tech']
            }
        });

        const ynoc = await prisma.dJ.create({
            data: {
                name: 'Ynoc',
                description: 'Produtor Musical, Beatmaker & DJ.',
                image: 'https://i.imgur.com/5MJnNOO.jpeg',
                soundcloud: 'https://soundcloud.com/ynocprod',
                trackId: '1354937299',
                genres: ['Drum & Bass', 'Rap', 'Hip Hop']
            }
        });

        const slippermode = await prisma.dJ.create({
            data: {
                name: 'Slippermode',
                description: 'Após se formar DJ, iniciou sua carreira no final de 2022 e desde então vem integrando o Line Up das melhores festas de Curitiba e Região.',
                image: 'https://i1.sndcdn.com/avatars-B85zMCtvXB9eRi0K-ZS9YEg-t500x500.jpg',
                soundcloud: 'https://soundcloud.com/slippermode',
                trackId: '1919070914',
                genres: ['Hi-Tech', 'Dark Psy']
            }
        });

        const floria = await prisma.dJ.create({
            data: {
                name: 'Flória',
                description: 'Sets imersivos, com influências de house, tech house, deep house e tech house.',
                image: 'https://i1.sndcdn.com/avatars-YEEToU0sTzlEnfoB-oxWSxA-t500x500.jpg',
                soundcloud: 'https://soundcloud.com/nathalia-dias-761771931',
                trackId: '1833171234',
                genres: ['House', 'Tech House', 'Deep House']
            }
        });

        const dartrix = await prisma.dJ.create({
            data: {
                name: 'DARTRIX',
                description: 'Definição de prodígio. Os poucos que tiveram o prazer de pegar uma pixxxta sabe do que estamos falando. Transicionando do dark-psy ao hi-tech, pode esperar uma surra de qualidade.',
                image: 'https://i1.sndcdn.com/avatars-SJivRR05x4C9a1e4-lvsrqg-t500x500.jpg',
                soundcloud: 'https://soundcloud.com/julia-alexandra-734851241',
                trackId: '2046931877',
                genres: ['Dark Psy', 'Hi-Tech']
            }
        });

        const ammint = await prisma.dJ.create({
            data: {
                name: 'AMMINT',
                description: 'DJ e produtora musical, graduanda em Produção Musical pela PUCPR, e com passagens por diversas festas e festivais como o Terra Azul, nos presenteia com um hi-tech FINO!',
                image: 'https://i1.sndcdn.com/avatars-zSiuOO27cJTFl9bw-4LbiBA-t500x500.jpg',
                soundcloud: 'https://soundcloud.com/ammint_hitech',
                trackId: '2051950812',
                genres: ['Hi-Tech']
            }
        });

        // Create events
        console.log('Creating events...');
        await prisma.event.create({
            data: {
                title: "B'day Party",
                date: '2025-04-05',
                time: '16:00',
                location: 'Pinhais, PR',
                description: 'Open Cooler, piscina e 24h de muitaaaa psicodelia. Uma celebração única com os melhores DJs da cena local e muitas surpresas para você curtir!',
                imageUrl: 'https://i.imgur.com/pGbpAdL.png',
                ticketLink: 'https://pixta.me/u/aniversarios-2025-oc',
                isPast: true,
                status: 'available',
                price: 50.0,
                djs: {
                    connect: [
                        { id: adarrun.id },
                        { id: slippermode.id },
                        { id: dartrix.id },
                        { id: ammint.id },
                        { id: ynoc.id },
                        { id: floria.id }
                    ]
                }
            }
        });

        await prisma.event.create({
            data: {
                title: 'DARK-TECH',
                date: '2025-05-17',
                time: '21:00',
                location: 'Oroboro Underground - Curitiba, PR',
                description: 'A gente simplesmente não consegue ficar sem trazer uma bagunça para vocês. Dessa vez, uma noite dedicada ao melhor que temos de dark-psy e hi-tech! No coração da cidade, no bar mais underground da cena, Oroboro Underground.',
                imageUrl: 'https://s3.sa-east-1.amazonaws.com/pixtame-public/qtu7euqkss2c73uejy204qrzc2a4.webp',
                ticketLink: 'https://pixta.me/u/organized-confusion-dark_tech-pokt-edition',
                isPast: false,
                status: 'available',
                price: 60.0,
                djs: {
                    connect: [
                        { id: adarrun.id },
                        { id: dartrix.id },
                        { id: ammint.id },
                        { id: slippermode.id }
                    ]
                }
            }
        });

        await prisma.event.create({
            data: {
                title: 'Edição Julina - 2025',
                date: '2025-07-15',
                time: '20:00',
                location: 'TBD',
                description: 'Fogueira, quentão e forrozinho alienígena.',
                imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4',
                ticketLink: null,
                isPast: false,
                status: 'coming-soon',
                price: null,
                djs: {
                    connect: []
                }
            }
        });

        await prisma.event.create({
            data: {
                title: 'Halloween Edition',
                date: '2025-10-31',
                time: '22:00',
                location: 'TBD',
                description: 'Trick or treat, mdfker???',
                imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
                ticketLink: null,
                isPast: false,
                status: 'coming-soon',
                price: null,
                djs: {
                    connect: []
                }
            }
        });

        await prisma.event.create({
            data: {
                title: 'Encerramento do Ano',
                date: '2025-12-28',
                time: '16:00',
                location: 'TBD',
                description: 'Pra fechar daquele jeito.',
                imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
                ticketLink: null,
                isPast: false,
                status: 'coming-soon',
                price: null,
                djs: {
                    connect: []
                }
            }
        });

        console.log('Database seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Close database connection
        await prisma.$disconnect();
        console.log('Database connection closed');
    }
}

// Execute the seed function
seed().catch(console.error); 