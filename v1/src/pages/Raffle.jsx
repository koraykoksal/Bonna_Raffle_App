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
import { toastErrorNotify, toastWarnNotify } from '../helper/ToastNotify'
import { activityInfo } from "../helper/avtivity_Info"


const Raffle = () => {


    const { getFireData, getActivityData, post_userWinners } = useRaffleCall()
    const { firebase_activityData, activityData, lokasyonData } = useSelector((state) => state.raffle)
    const [activityDatas, setActivityDatas] = useState([])
    const [info, setInfo] = useState([])
    const [raffleStart, setRaffleStart] = useState(false)
    const [katilimciSayisi, setkatilimciSayisi] = useState(0)

    const [data, setdata] = useState([])

    const cekilisSuresi = 10000
    let interval = 0;
    let winners = [];
    let currentIndex = 0;
    const yedekSayisi = Number(katilimciSayisi) - 1 //index sayısı 0 dan başlayıp 12 ye kadar gittiği zaman 13 olarak sayıyor. +4 kişi eklediğinde total da 5 kişilik yedek oluşuyor.


    //! tüm başvuruları çek
    useEffect(() => {
        getFireData('bonna-activity') //başvuru yapan kişiler
        getActivityData('images') // aktivasyon datası
    }, [])


    //! başvuruları filtrele
    useEffect(() => {

        //başvuru yapan kullanıcı datasını çek
        const data = Object.keys(firebase_activityData).map(key => { return { id: key, ...firebase_activityData[key] } })

        // yayın bilgisi açık olan etkiliğin datasını getir
        const activeActivities = activityData?.filter(info => info.publish);

        // Eşleşenleri bul
        const matchedActivities = data.filter(data => {
            return activeActivities.some(item => item.activityName === data.activityName);
        });

        setActivityDatas(matchedActivities || [])

    }, [firebase_activityData])



    //? çekilişi başlat
    // const lottery = () => {

    //     if (currentIndex <= Number(katilimciSayisi) + Number(yedekSayisi)) {

    //         const dataIndex = Math.floor(Math.random() * activityData.length)

    //         const selected = activityData.splice(dataIndex, 1)[0]; // Seçilen öğeyi al ve listeden çıkar

    //         if (selected === undefined) {
    //             console.error("Hata: Seçilen öğe bulunamadı.");
    //             // İsteğe bağlı olarak burada da kullanıcıya bir mesaj gösterebilirsiniz.
    //             return;
    //         }



    //         setInfo(info => [...info, selected]); // Yeni seçilen öğeyi info listesine ekle

    //         currentIndex++;
    //         setRaffleStart(false)
    //     }
    //     else {
    //         clearInterval(interval)
    //     }


    // }

    let pazaryeriSelections = 0; // "Pazaryeri" seçimlerini saymak için bir sayaç

    const lottery = () => {
        if (currentIndex <= Number(katilimciSayisi) + Number(yedekSayisi)) {
            if (activityDatas.length === 0) {
                console.error("Hata: Seçilecek öğe kalmadı.");
                clearInterval(interval); // Tüm öğeler tükenirse çekilişi durdur
                return;
            }

            let selected;
            let dataIndex; // dataIndex'i döngü dışında tanımla
            do {
                dataIndex = Math.floor(Math.random() * activityDatas.length); // dataIndex'i burada ata
                selected = activityDatas[dataIndex]; // Potansiyel seçilen öğe

                if (selected.tesis === `${lokasyonData.lokasyon}` || "") {
                    if (pazaryeriSelections >= `${lokasyonData.miktar}` || 0) {
                        continue; // "Pazaryeri" limiti aşıldıysa başka bir öğe seç
                    } else {
                        pazaryeriSelections++; // "Pazaryeri" için seçim sayısını artır
                        break; // Uygun öğe bulundu
                    }
                } else {
                    break; // "Pazaryeri" dışında bir tesis, doğrudan kabul et
                }
            } while (true);

            activityDatas.splice(dataIndex, 1); // Döngü dışında doğru kapsamda kullanılıyor
            setInfo(info => [...info, selected]); // Yeni seçilen öğeyi info listesine ekle
            currentIndex++;
            setRaffleStart(false);
        } else {
            clearInterval(interval);
        }
    };



    const handleSubmit = (e) => {
        e.preventDefault()

        if (katilimciSayisi <= 0) {
            toastWarnNotify('Katılımcı sayısı 0 olamaz !')
        }
        else {

            if (activityDatas.length > 0) {

                setRaffleStart(true)
                currentIndex = 0;
                winners = [];
                interval = setInterval(lottery, cekilisSuresi)
            }
            else {
                toastWarnNotify('Çekiliş için veri kaynağı bulunamadı !')
            }

        }


    }

    const handleSave = (e) => {

        if (!info.length > 0) {
            toastWarnNotify('Kayıt için çekiliş verisi bulunmamaktadır !')
        }
        else {

            post_userWinners('bonna-activity-winners', data)
        }
    }


    console.log(lokasyonData)

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
                    <Button color='primary' variant='contained' sx={{ width: '150px' }} onClick={handleSave}>Kaydet</Button>
                </Container>
            </form>


            {
                raffleStart ?
                    (<Container sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                        <img src={loading} width={350} />
                    </Container>)
                    :
                    (<Winners info={info} setdata={setdata} katilimciSayisi={katilimciSayisi} />)
            }


        </div>
    )
}

export default Raffle