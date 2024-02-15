import cokguzelhareketler2 from "../assets/etkinlik/cokguzelhareketler2.png"
import seldabagcan from "../assets/etkinlik/seldabagcan.png"
import denizgoktas from "../assets/etkinlik/denizgoktas.png"


import { uid } from "uid";

export const activityInfo = [

    {
        id:uid(),
        name: 'Çok Güzel Hareketler 2',
        date: '10.12.2023',
        image:cokguzelhareketler2,
        status: false,


    },
    {
        id:uid(),
        name: 'Selda Bağcan',
        date: '28.01.2024',
        image:seldabagcan,
        status: false

    },
    {
        id:uid(),
        name: 'Deniz Göktaş',
        date: '23.02.2024',
        image:denizgoktas,
        status: true

    },

]