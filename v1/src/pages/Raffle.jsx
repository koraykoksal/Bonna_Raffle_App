import React from 'react'
import { useState, useEffect } from 'react'
import useRaffleCall from '../hooks/useRaffleCall'
import { useSelector } from 'react-redux'
import { Box, Button, Container, TextField, Typography } from '@mui/material'
import Winners from '../components/tables/Winners'
import loading from "../assets/gift/loading.gif"
import { raffleBgPattern } from '../styles/theme'
import { toastWarnNotify } from '../helper/ToastNotify'



const Raffle = () => {


    const { getFireData, getActivityData, post_userWinners } = useRaffleCall()
    const { firebase_activityData, activityData, lokasyonData } = useSelector((state) => state.raffle)
    const [activityDatas, setActivityDatas] = useState([])
    const [info, setInfo] = useState([])
    const [raffleStart, setRaffleStart] = useState(false)
    const [katilimciSayisi, setkatilimciSayisi] = useState(0)
    const [locationInfo, setlocationInfo] = useState([])
    let pazaryeriSelections = 0; // "Pazaryeri" seçimlerini saymak için bir sayaç
    let cayirovaSelections = 0; // "Pazaryeri" seçimlerini saymak için bir sayaç
    let pendikSelections = 0; // "Pazaryeri" seçimlerini saymak için bir sayaç

    const cekilisSuresi = 5000
    let interval = 0;
    let winners = [];
    let currentIndex = 0;
    const yedekSayisi = Number(katilimciSayisi) //index sayısı 0 dan başlayıp 12 ye kadar gittiği zaman 13 olarak sayıyor. +4 kişi eklediğinde total da 5 kişilik yedek oluşuyor.

    //! tüm başvuruları çek
    useEffect(() => {
        getFireData('bonna-activity') //başvuru yapan kişiler
        getActivityData('images') // aktivasyon datası
        setlocationInfo(JSON.parse(localStorage.getItem('lokasyonData')) || {}) // locale storageden verileri al
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

        matchedActivities.length > 0 ? setActivityDatas(matchedActivities) : setActivityDatas([])

    }, [firebase_activityData, activityData])


    //! çekiliş fonksiyonu
    // const lottery = () => {
    //     if (currentIndex <= Number(katilimciSayisi) + Number(yedekSayisi)) {
    //         if (activityDatas.length === 0) {
    //             console.error("Hata: Seçilecek öğe kalmadı.");
    //             clearInterval(interval); // Tüm öğeler tükenirse çekilişi durdur
    //             return;
    //         }

    //         let selected;
    //         let dataIndex; // dataIndex'i döngü dışında tanımla
    //         do {
    //             dataIndex = Math.floor(Math.random() * activityDatas.length); // dataIndex'i burada ata
    //             selected = activityDatas[dataIndex]; // Potansiyel seçilen öğe


    //             if (selected.tesis === 'Pazaryeri' || "") {
    //                 if (pazaryeriSelections >= locationInfo.pazaryeri || 0) {
    //                     continue; // "Pazaryeri" limiti aşıldıysa başka bir öğe seç
    //                 } 
    //                 else {
    //                     pazaryeriSelections++; // "Pazaryeri" için seçim sayısını artır
    //                     break; // Uygun öğe bulundu
    //                 }
    //             } 
    //             else if (selected.tesis === 'Çayırova' || "") {
    //                 if (cayirovaSelections >= locationInfo.cayirova || 0) {
    //                     continue; // "Pazaryeri" limiti aşıldıysa başka bir öğe seç
    //                 } 
    //                 else {
    //                     cayirovaSelections++; // "Pazaryeri" için seçim sayısını artır
    //                     break; // Uygun öğe bulundu
    //                 }
    //             } 
    //             else if (selected.tesis === 'Pendik' || "") {
    //                 if (pendikSelections >= locationInfo.pendik || 0) {
    //                     continue; // "Pazaryeri" limiti aşıldıysa başka bir öğe seç
    //                 } 
    //                 else {
    //                     pendikSelections++; // "Pazaryeri" için seçim sayısını artır
    //                     break; // Uygun öğe bulundu
    //                 }
    //             } 
    //             else {
    //                 break; // "Pazaryeri" dışında bir tesis, doğrudan kabul et
    //             }
    //         } while (true);


    //         activityDatas.splice(dataIndex, 1); // Döngü dışında doğru kapsamda kullanılıyor
    //         setInfo(info => [...info,selected]); // Yeni seçilen öğeyi info listesine ekle
    //         currentIndex++;
    //         setRaffleStart(false);
    //     } else {
    //         clearInterval(interval);
    //     }
    // };


    const lottery = () => {
        const totalSelections = Number(katilimciSayisi) + Number(yedekSayisi);

        // Ana katılımcıları seç
        if (currentIndex < katilimciSayisi) {
            if (activityDatas.length === 0) {
                console.error("Hata: Seçilecek öğe kalmadı.");
                clearInterval(interval); // Tüm öğeler tükenirse çekilişi durdur
                return;
            }

            let selected;
            let dataIndex;
            let loopCount = 0; // Sonsuz döngüyü önlemek için bir sayaç ekliyoruz.
            do {
                dataIndex = Math.floor(Math.random() * activityDatas.length);
                selected = activityDatas[dataIndex];

                if (selected.tesis === 'Pazaryeri' && pazaryeriSelections < locationInfo.pazaryeri) {
                    pazaryeriSelections++;
                    break;
                }
                else if (selected.tesis === 'Çayırova' && cayirovaSelections < locationInfo.cayirova) {
                    cayirovaSelections++;
                    break;
                }
                else if (selected.tesis === 'Pendik' && pendikSelections < locationInfo.pendik) {
                    pendikSelections++;
                    break;
                }
                else {
                    // Eğer bu lokasyon için limit aşıldıysa, diğerlerini denemeye devam et
                    // continue;
                    // Eğer lokasyon limitlerine ulaşılamıyorsa, rastgele seçim yaparak döngüden çık.
                    loopCount++;
                    if (loopCount > activityDatas.length) {
                        console.log("Limitlere ulaşılamadı, rastgele seçim yapılıyor...");
                        break;
                    }
                }
            } while (true);

            setInfo(prevInfo => [...prevInfo, { ...selected, isBackup: false }]); // Ana listeye ekle
            activityDatas.splice(dataIndex, 1); // Seçilen öğeyi listeden çıkar
            currentIndex++;
            setRaffleStart(false)
            // Yedek katılımcıları seç
        } else if (currentIndex < totalSelections) {
            let selected;
            let dataIndex;
            dataIndex = Math.floor(Math.random() * activityDatas.length);
            selected = activityDatas[dataIndex];

            setInfo(prevInfo => [...prevInfo, { ...selected, isBackup: true }]); // Yedek listeye ekle
            activityDatas.splice(dataIndex, 1); // Seçilen öğeyi listeden çıkar
            currentIndex++;
        } else {
            clearInterval(interval);
        }
    };


    // const lottery = () => {
    //     if (currentIndex <= Number(katilimciSayisi) + Number(yedekSayisi)) {
    //         if (activityDatas.length === 0) {
    //             console.error("Hata: Seçilecek öğe kalmadı.");
    //             clearInterval(interval);
    //             return;
    //         }

    //         if (currentIndex == 3) {
    //             setInfo(prevInfo => [...prevInfo, personelInfo[0]])
    //         }
    //         else if (currentIndex == 7) {
    //             setInfo(prevInfo => [...prevInfo, personelInfo[1]])

    //         }
    //         else {
    //             let selected;
    //             let dataIndex;
    //             do {
    //                 dataIndex = Math.floor(Math.random() * activityDatas.length);
    //                 selected = activityDatas[dataIndex];

    //                 if (selected.tesis === lokasyonData.lokasyon || selected.tesis === "") {
    //                     if (pazaryeriSelections >= lokasyonData.miktar) {
    //                         continue;
    //                     } else {
    //                         pazaryeriSelections++;
    //                         break;
    //                     }
    //                 } else {
    //                     break;
    //                 }
    //             } while (true);

    //             activityDatas.splice(dataIndex, 1);
    //             // setInfo(prevInfo => [...prevInfo, selected]); // Rastgele seçilen öğeyi ekle
    //             // selected'ın zaten info'da olup olmadığını kontrol et
    //             const isAlreadyAdded = info.some(item => item.tcNo === selected.tcNo);

    //             if (!isAlreadyAdded) {
    //                 setInfo(prevInfo => [...prevInfo, selected]); // Eğer yoksa yeni öğeyi ekle
    //             }
    //         }

    //         currentIndex++;
    //         setRaffleStart(false);
    //     } else {
    //         clearInterval(interval);
    //     }
    // };


    //! çekilişi başlat



    const handleSubmit = (e) => {
        e.preventDefault()

        if (katilimciSayisi <= 0) {
            toastWarnNotify('Katılımcı sayısı 0 olamaz !')
        }
        else {

            if (activityDatas.length > 0) {

                if (!locationInfo.cayirova && !locationInfo.pazaryeri && !locationInfo.pendik) {
                    return toastWarnNotify('Please check settings !')
                }

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


    //! sonuçları kaydet
    const handleSave = (e) => {

        if (!info.length > 0) {
            toastWarnNotify('Kayıt için çekiliş verisi bulunmamaktadır !')
        }
        else {

            post_userWinners('bonna-activity-winners', info)
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
                    <Button color='primary' variant='contained' sx={{ width: '150px' }} onClick={handleSave}>Kaydet</Button>
                </Container>
            </form>


            {
                raffleStart ?
                    (<Container sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                        <img src={loading} width={350} />
                    </Container>)
                    :
                    (<Winners info={info} katilimciSayisi={katilimciSayisi} />)
            }


        </div>
    )
}

export default Raffle