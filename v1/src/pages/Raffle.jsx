import React from 'react'
import { useState, useEffect } from 'react'
import useRaffleCall from '../hooks/useRaffleCall'
import { useSelector } from 'react-redux'
import { Box, Button, Container, TextField, Typography } from '@mui/material'
import Winners from '../components/tables/Winners'
import loading from "../assets/gift/loading.gif"
import { raffleBgPattern } from '../styles/theme'
import { toastSuccessNotify, toastWarnNotify } from '../helper/ToastNotify'



const Raffle = () => {


    const { getFireData, getActivityData, post_userWinners, get_bonnaPersonel } = useRaffleCall()
    const { userID, token } = useSelector((state) => state.auth)
    const { firebase_activityData, activityData, lokasyonData } = useSelector((state) => state.raffle)
    const [activityDatas, setActivityDatas] = useState([])
    const [info, setInfo] = useState([])
    const [raffleStart, setRaffleStart] = useState(false)
    const [katilimciSayisi, setkatilimciSayisi] = useState(0)
    const [locationInfo, setlocationInfo] = useState([])
    const [erpData, setErpData] = useState([])

    const [data, setData] = useState([])

    let pazaryeriSelections = 0; // "Pazaryeri" seçimlerini saymak için bir sayaç
    let cayirovaSelections = 0; // "Pazaryeri" seçimlerini saymak için bir sayaç
    let pendikSelections = 0; // "Pazaryeri" seçimlerini saymak için bir sayaç
    let maviYakaSelections = 0; // "Pazaryeri" seçimlerini saymak için bir sayaç
    let beyazYakaSelections = 0;
    let ise = 0; // "Pazaryeri" seçimlerini saymak için bir sayaç

    const cekilisSuresi = 3000
    let interval = 0;
    let winners = [];
    let currentIndex = 0;
    const yedekSayisi = Number(katilimciSayisi) //index sayısı 0 dan başlayıp 12 ye kadar gittiği zaman 13 olarak sayıyor. +4 kişi eklediğinde total da 5 kişilik yedek oluşuyor.

    //! tüm başvuruları çek
    useEffect(() => {
        getFireData('bonna-activity') //başvuru yapan kişiler
        getActivityData('images') // aktivasyon datası
        setlocationInfo(JSON.parse(localStorage.getItem(userID)) || {}) // locale storageden verileri al
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


    //!bonna personel verisini çek
    useEffect(() => {
        const fetchData = async () => {
            try {
                //! SAYFA RENDER OLDUĞU ZAMAN TÜM KAR PORSELEN ÇALIŞAN DATASINI ÇEK 
                //! GELEN DATA SONUNUCU STATE AKTAR
                //! STATE DE OLAN VERİ İLE "selected" DEĞİŞKENİNE GELEN DATA NIN KARŞILAŞTIRMASINI YAP MAVİ-BEYAZ YAKA BİLGİSİNİ AL

                const response = await get_bonnaPersonel()
                // const data = response.filter(item => item.SURNAME === "KÖKSAL")
                setErpData(response)

            } catch (error) {
                console.error("Veri çekilirken hata oluştu:", error);
            }
        };

        fetchData();

    }, []);


    //! ERP verisi değiştiğinde bildirim gönder
    useEffect(() => {
        if (erpData.length > 0) {
            toastSuccessNotify('ERP Bağlantısı yapıldı ve kullanıcı verileri alındı !');
        }
    }, [erpData]);


    //! erp ve aktivite datasını kontrol edip birleştirir
    function cekilisData() {

        const result = activityDatas?.map((item, index) => {

            // activityDatas içinde eşleşen bir veri bul
            const foundData = erpData?.find((data, index) => data.TCKIMLIKNO === item.tcNo);
            // console.log("foundData : ", foundData)
            return foundData ?
                {
                    ...item,
                    STATUSCODE: foundData.STATUSCODE,
                    LOKASYON: foundData.LOKASYON,
                    TCKIMLIKNO: foundData.TCKIMLIKNO,
                    PERSID: foundData.PERSID,
                }
                :
                null
        })
            .filter(item => item !== null) // null olanları temizle

        return result
    }


    //! çekiliş fonksiyonu
    const lottery1 = () => {
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


    const getUniqueRandomIndex = (dataLength) => {
        if (dataLength === 0) return -1; // Eğer liste boşsa -1 döndür

        let dataIndex;
        let attempts = 0;
        const maxAttempts = dataLength * 2; // Sonsuz döngüyü önlemek için limit
        let previousIndexes = []; // Önceki seçimleri saklamak için dizi

        do {
            dataIndex = Math.floor(Math.random() * dataLength);
            attempts++;
        } while (previousIndexes.includes(dataIndex) && attempts < maxAttempts);

        previousIndexes.push(dataIndex); // Yeni indexi sakla

        // Hafızayı sınırlamak için önceki kayıtları kontrol et
        if (previousIndexes.length > dataLength / 2) {
            previousIndexes.shift(); // Eski kayıtları temizle
        }

        return dataIndex;
    };


    const lottery = () => {
        const totalSelections = Number(katilimciSayisi) + Number(yedekSayisi);
        let loopCount = 0;
        let maxLoopCount = cekilisData().length * 2;


        // let dataIndex = parseInt(Math.random() * cekilisData().length);
        let dataIndex = getUniqueRandomIndex(cekilisData().length);
        let selected = cekilisData()[dataIndex];

        console.log(" *** dataIndex ***", dataIndex);
        // console.log(" *** Seçilen Kişi ***", selected);

        const lokasyon = selected.LOKASYON;
        const statusCode = selected.STATUSCODE;

        // ✅ Beyaz Yaka mı, Mavi Yaka mı?
        const isBeyazYaka = statusCode === "Beyaz Yaka";
        const isMaviYaka = statusCode === "Mavi Yaka";

        //* seçilen kişi daha önce seçilmiş mi kontrol et
        const alreadySelected = info.some(person => person.tcNo === selected.TCKIMLIKNO);



        while (currentIndex < totalSelections && loopCount < maxLoopCount) {


            if (alreadySelected) {
                loopCount++;
                continue;
            }

            // ✅ Beyaz Yaka ve Mavi Yaka için belirlenen sayı sınırına ulaşıldı mı?
            // if (isBeyazYaka && beyazYakaSelections >= locationInfo.beyaz) {
            //     loopCount++;
            //     continue; // Beyaz Yaka kotası dolduysa tekrar seç
            // }
            // if (isMaviYaka && maviYakaSelections >= locationInfo.mavi) {
            //     loopCount++;
            //     continue; // Mavi Yaka kotası dolduysa tekrar seç
            // }


            if (selected.tesis === "Pazaryeri" && pazaryeriSelections < locationInfo.pazaryeri) {
                pazaryeriSelections++;
            } else if (selected.tesis === "Çayırova" && cayirovaSelections < locationInfo.cayirova) {
                cayirovaSelections++;
            } else if (selected.tesis === "Pendik" && pendikSelections < locationInfo.pendik) {
                pendikSelections++;
            } else {
                loopCount++;
                continue;
            }

        }



        setInfo(prevInfo => [...prevInfo,
        {
            ...selected,
            statusCode,
            dataIndex,
            isBackup: currentIndex >= katilimciSayisi

        }]);

        cekilisData().splice(dataIndex, 1);
        currentIndex++;

        // ✅ Yaka sayısını artır
        // if (isBeyazYaka) beyazYakaSelections++;
        // if (isMaviYaka) maviYakaSelections++;


        if (currentIndex >= totalSelections) {
            clearInterval(interval);
            setRaffleStart(false)
        }
    };



    const handleSubmit = (e) => {
        e.preventDefault()

        const locationCount =
            Number(locationInfo.cayirova) +
            Number(locationInfo.pazaryeri) +
            Number(locationInfo.pendik)




        if (!erpData.length > 0) {
            return toastWarnNotify('ERP Bağlantı hatası. Kullanıcı verileri alınamadı !')
        }

        if (katilimciSayisi <= 0 || katilimciSayisi != locationCount) {
            return toastWarnNotify('Katılımcı sayısını kontrol ediniz !')
        }
        else {

            if (activityDatas.length > 0) {

                // if (
                //     !locationInfo.cayirova ||
                //     !locationInfo.pazaryeri ||
                //     !locationInfo.pendik ||
                //     !locationInfo.beyaz ||
                //     !locationInfo.mavi
                // ) {
                //     return toastWarnNotify('Please check settings !')
                // }

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

    // console.log(info)

    return (
        <div style={raffleBgPattern}>

            <Container>
                <Typography
                    variant='h6'
                    align='center'
                    p={3}
                    fontWeight={700}
                >
                    Etkinlik Çekiliş Sayfası
                </Typography>

                <Typography variant='subtitle2' align='center' color='#B31312'>
                    Çekiliş etkinliğe kayıt olan kişiler arasında yapılacaktır !
                </Typography>
            </Container>

            <form onSubmit={handleSubmit}>
                <Container sx={{ display: 'flex', justifyContent: 'space-evenly', gap: 3, p: 3, mt: 8 }}>
                    <Button
                        disabled={!erpData.length > 0}
                        color='success'
                        variant='contained'
                        style={{ width: '150px', height: 40 }}
                        type='submit'
                    >
                        Başlat
                    </Button>

                    <TextField
                        disabled={!erpData.length > 0}
                        size='small'
                        sx={{ width: '150px' }}
                        // required
                        label='Katılımcı Sayısı'
                        type='number'
                        value={katilimciSayisi}
                        onChange={(e) => setkatilimciSayisi(e.target.value)}
                        helperText={!erpData.length > 0 && 'ERP Bağlantısı yapılamadı kullanıcı verisi olmadığı için işlem başlatılamaz !. Sayfayı yenileyerek ERP bağlantısı yapıldı bilgisini kontrol ediniz.'}
                    />

                    <Button
                        disabled={!erpData.length > 0}
                        color='primary'
                        variant='contained'
                        sx={{ width: '150px', height: 40 }}
                        onClick={handleSave}
                    >
                        Kaydet
                    </Button>
                </Container>
            </form>


            {
                raffleStart ?
                    (
                        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 5, gap: 3 }}>

                            <Box sx={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 5, gap: 3
                            }}>
                                <Typography sx={{ color: 'red', fontWeight: 800 }}>
                                    ( Asil / Yedek Seçimi Yapılıyor ) : {info.length}
                                </Typography>

                                {info?.length > 0 && (
                                    <Typography fontSize={16}>
                                        {info[info?.length - 1]?.dataIndex} - 
                                        {info[info?.length - 1]?.isBackup ? 'Yedek - ' : 'Asil - '}
                                        (
                                        {`${info[info?.length - 1]?.name?.toUpperCase()} ${info[info?.length - 1]?.surname?.toUpperCase()}`}
                                        )
                                    </Typography>
                                )}
                            </Box>

                            <img src={loading} width={350} />

                        </Container>
                    )
                    :
                    (
                        <Winners
                            info={info}
                            katilimciSayisi={katilimciSayisi}
                        />
                    )
            }


        </div>
    )
}

export default Raffle