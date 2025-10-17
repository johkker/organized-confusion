import { create } from 'zustand'

export interface DJ {
    id: number
    name: string
    genres: string[]
    image: string
    description: string
    soundcloud: string
    trackId: string
}

interface DJStore {
    djs: DJ[]
    filteredDJs: DJ[]
    selectedGenre: string
    setDJs: (djs: DJ[]) => void
    setFilteredDJs: (djs: DJ[]) => void
    filterByGenre: (genre: string) => void
}

const defaultDJs: DJ[] = [
    {
        id: 1,
        name: "Adarrun",
        genres: ["Dark Psy", "Dark Hi-Tech", "Hi-Tech"],
        image: "https://i1.sndcdn.com/avatars-Q4d8RgXR0Erj0EbO-mqDFqg-t500x500.jpg",
        description: "Explorando os limites da psicodelia sonora, Adarrun despensa apresentações. Só sentindo a pista, para entender.",
        soundcloud: "https://soundcloud.com/adarrun",
        trackId: "1393743490"
    },
    {
        id: 2,
        name: "Ynoc",
        genres: ["Drum & Bass", "Rap", "Hip Hop"],
        image: "https://i.imgur.com/5MJnNOO.jpeg",
        description: "Produtor Musical, Beatmaker & DJ.",
        soundcloud: "https://soundcloud.com/ynocprod",
        trackId: "1354937299"
    },
    {
        id: 3,
        name: "Slippermode",
        genres: ["Hi-Tech", "Dark Psy"],
        image: "https://i1.sndcdn.com/avatars-B85zMCtvXB9eRi0K-ZS9YEg-t500x500.jpg",
        description: "Após se formar DJ, iniciou sua carreira no final de 2022 e desde então vem integrando o Line Up das melhores festas de Curitiba e Região.",
        soundcloud: "https://soundcloud.com/slippermode",
        trackId: "1919070914"
    },
    {
        id: 4,
        name: "Flória",
        genres: ["House", "Tech House", "Deep House"],
        image: "https://i1.sndcdn.com/avatars-YEEToU0sTzlEnfoB-oxWSxA-t500x500.jpg",
        description: "Sets imersivos, com influências de house, tech house, deep house e tech house.",
        soundcloud: "https://soundcloud.com/nathalia-dias-761771931",
        trackId: "1833171234"
    },
    {
        id: 5,
        name: "DARTRIX",
        genres: ["Dark Psy", "Hi-Tech"],
        image: "https://i1.sndcdn.com/avatars-SJivRR05x4C9a1e4-lvsrqg-t500x500.jpg",
        description: "Definição de prodígio. Os poucos que tiveram o prazer de pegar uma pixxxta sabe do que estamos falando. Transicionando do dark-psy ao hi-tech, pode esperar uma surra de qualidade.",
        soundcloud: "https://soundcloud.com/julia-alexandra-734851241",
        trackId: "2046931877"
    },
    {
        id: 6,
        name: "AMMINT",
        genres: ["Hi-Tech"],
        image: "https://i1.sndcdn.com/avatars-zSiuOO27cJTFl9bw-4LbiBA-t500x500.jpg",
        description: "DJ e produtora musical, graduanda em Produção Musical pela PUCPR, e com passagens por diversas festas e festivais como o Terra Azul, nos presenteia com um hi-tech FINO!",
        soundcloud: "https://soundcloud.com/ammint_hitech",
        trackId: "2051950812"
    }
]

export const useDJStore = create<DJStore>((set) => ({
    djs: defaultDJs,
    filteredDJs: defaultDJs,
    selectedGenre: 'Todos',
    setDJs: (djs) => set({ djs, filteredDJs: djs, selectedGenre: 'Todos' }),
    setFilteredDJs: (filteredDJs) => set({ filteredDJs }),
    filterByGenre: (genre) =>
        set((state) => ({
            filteredDJs: genre === 'Todos'
                ? state.djs
                : state.djs.filter(dj => dj.genres.includes(genre)),
            selectedGenre: genre
        }))
})) 