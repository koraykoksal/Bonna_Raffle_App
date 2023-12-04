import React from 'react'
import { useState, useEffect } from 'react'
import useRaffleCall from '../hooks/useRaffleCall'
import { useSelector } from 'react-redux'
import { Box, Button, Container, TextField, Typography } from '@mui/material'
import Winners from '../components/tables/Winners'
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import generateGift from "../assets/gift/generateGift.gif"
import gif1 from "../assets/gift/gif1.gif"
import loading from "../assets/gift/loading.gif"
import { raffleBgPattern } from '../styles/theme'

const Raffle = () => {


    const { getFireData } = useRaffleCall()
    const { firebase_activityData } = useSelector((state) => state.raffle)
    const [activityData, setactivityData] = useState([])
    const [info, setInfo] = useState([])
    const [raffleStart, setRaffleStart] = useState(false)
    const [katilimciSayisi, setkatilimciSayisi] = useState(0)


    let interval = 0;
    let winners = [];
    let currentIndex = 0;
    const yedekSayisi = 4 //index sayısı 0 dan başlayıp 12 ye kadar gittiği zaman 13 olarak sayıyor. +4 kişi eklediğinde total da 5 kişilik yedek oluşuyor.

    useEffect(() => {
        getFireData('bonna-activity')
    }, [])

    useEffect(() => {

        const data = Object.keys(firebase_activityData).map(key => { return { id: key, ...firebase_activityData[key] } })

        setactivityData(data)

    }, [firebase_activityData])



    //? çekilişi başlat
    const lottery = () => {

        

        if (currentIndex <= Number(katilimciSayisi) + Number(yedekSayisi)) {
           
            
            const dataIndex = Math.floor(Math.random() * activityData.length)
            const selected = activityData.splice(dataIndex, 1)[0]; // Seçilen öğeyi al ve listeden çıkar
            setInfo(info => [...info, selected]); // Yeni seçilen öğeyi info listesine ekle
        
            currentIndex++;
            setRaffleStart(false)
        }
        else {
            clearInterval(interval)
        }
        

    }



    const handleSubmit = (e) => {
        e.preventDefault()

        if (katilimciSayisi <= 0) {
            alert('katılımcı sayısı 0 olamaz !')
        }
        else {
            setRaffleStart(true)
            currentIndex = 0;
            winners = [];
            interval = setInterval(lottery, 10000)
        }


    }



    return (
        <div style={raffleBgPattern}>

            <Container>
                <Typography variant='h6' align='center' p={3} color='#ffffff' fontWeight={700}>Etkinlik Çekiliş Sayfası</Typography>

                <Typography variant='subtitle2' align='center' color='#B31312'>
                    Çekiliş etkinliğe kayıt olan kişiler arasında yapılacaktır !
                </Typography>
            </Container>

            <form onSubmit={handleSubmit}>
                <Container sx={{ display: 'flex', justifyContent: 'space-evenly', gap: 3, p: 3, mt: 8 }}>
                    <Button
                        color='success'
                        variant='contained'
                        style={{ width: '150px' }}
                        type='submit'
                    >
                        Başlat
                    </Button>
                    <TextField
                        sx={{ width: '150px' }}
                        // required
                        label='Katılımcı Sayısı'
                        type='number'
                        value={katilimciSayisi}
                        onChange={(e) => setkatilimciSayisi(e.target.value)}
                    />
                </Container>
            </form>


            {
                raffleStart ?
                (<Container sx={{display:'flex',justifyContent:'center',p:5}}>
                    <img src={loading} width={350} />
                </Container>)
                :
                (<Winners info={info} katilimciSayisi={katilimciSayisi}/>)
            }

         
 

        </div>
    )
}

export default Raffle