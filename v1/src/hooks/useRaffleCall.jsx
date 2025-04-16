
import React from 'react'
import {
    fetchStart,
    fetchFail,
    fetchApplyData,
    fetchActivityData,
    fetchBonnaPersonelData,
    fetchUserWinnersData,
    fetchUploadStart,
    fetchUploadEnd,
    fetchActivityUserData,
    fetchEnd

} from '../features/raffleSlice'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toastInfoNotify, toastSuccessNotify, toastErrorNotify, toastWarnNotify } from '../helper/ToastNotify'
import { doc, setDoc, Timestamp, collection, addDoc, getDocs, getDoc } from "firebase/firestore";
import { db } from "../db/firebase_db"
import { getDatabase, onValue, ref, remove, set, update } from "firebase/database";
import { uid } from "uid";
import { useState } from 'react';
import { json, useNavigate } from "react-router-dom"
import { getStorage, ref as dbRef, uploadBytes, getDownloadURL, getMetadata, listAll, list, deleteObject } from "firebase/storage";
import { standardizeDate } from '../helper/format'



const useRaffleCall = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { firebase_activityData, bonnaPersonels, userWinners } = useSelector((state) => state.raffle)

    //! etkinlik register kaydı yap
    const postFireData = async (address, info) => {


        try {

            dispatch(fetchStart())

            // const bonnaPersonel = await get_bonnaPersonel() // bonna personel datasını çek
            // await getFireData('bonna-activity') // başvuru listesini çek

            //?* personel var mı kontrol et
            const findPersonel = bonnaPersonels?.find((item) => item.TCKIMLIKNO == info.tcNo)

            // console.log("findPersonel : ", findPersonel)

            //* kazanan kullanıcı verilerini tek bir array içinde birleştir
            const winnersData = userWinners?.flatMap(group => {
                return Object.keys(group)
                    .filter(key => !isNaN(key)) // sadece sayısal index'ler
                    .map(key => group[key]);    // değeri al
            });


            if (findPersonel && winnersData?.length > 0) {

                //* aktivite verisini array formatına dönüştür
                const activityDataDizi = Object.keys(firebase_activityData).map(key => { return { id: key, ...firebase_activityData[key] } })

                //* kullanıcı aktiviteye tekrar başvuru yapmış mı kontrol et
                const sameData = activityDataDizi.find((item) => item.tcNo === info.tcNo && item.activityName == info.activityName);


                //*****   çeyrek dilime giriyor mu kontrol et  **** */


                // const currentYear = "2024"
                const currentYear = new Date().getFullYear();

                //* currentdate bilgisi ve asil listesinde olan kişileri getir
                const isWin = winnersData?.filter((winner) => standardizeDate(winner.activityDate).split('-')[0] == currentYear && (winner.isBackup === false || winner.status === 'Asil'));

                // console.log("isWin : ", isWin)


                // 1. findPersonel'in tc bilgisi ile eşleşen kayıtları bul
                const matchedWins = isWin.filter((item) => item.tcNo === findPersonel.TCKIMLIKNO);

                console.log("matchedWins : ", matchedWins)

                // 2. Eşleşenlerin month (MM) bilgilerini al
                // const months = matchedWins.map(item => standardizeDate(item.activityDate).split('-')[1]);

                // 3. Her ayın hangi çeyreğe ait olduğunu belirle
                // const quarters = months.map(month => {
                //     if (month >= 1 && month <= 3) return 1;
                //     else if (month >= 4 && month <= 6) return 2;
                //     else if (month >= 7 && month <= 9) return 3;
                //     else if (month >= 10 && month <= 12) return 4;
                // });


                if (sameData) {
                    return toastErrorNotify(`${info.tcNo} kimlik nuraması ile kayıt bulunmaktadır. Tekrar kayıt yapamazsınız !`)
                }
                else if (matchedWins.length >= 4) {
                    return toastErrorNotify('Etkinlik kuralları gereği, yıl başından itibaren 4 etkinliğe katıldığınız için, bu etkinliğe başvuru yapmanız maalesef mümkün değildir.')
                }
                else {
                    const uID = uid()
                    const db = getDatabase();
                    set(ref(db, `${address}/` + uID), info);
                    toastSuccessNotify('Başvuru Yapıldı')
                    navigate('/')
                }

            }
            else {
                toastErrorNotify(`Bonna firmasında ${info.tcNo} TC No ve ${info.name} ${info.surname} isimli personel bulunmaktadır. Kayıt yapamazsınız !`)
            }


        }
        catch (error) {
            toastErrorNotify('Başvuru Yapılamadı')
            console.log("Başvuru Yapılamadı: ", error)
        }
        finally {
            dispatch(fetchEnd())
        }

    }


    //! firebase data çek
    const getFireData = async (address) => {

        return new Promise((resolve, reject) => {
            dispatch(fetchStart());

            try {
                const db = getDatabase();
                const starCountRef = ref(db, `${address}/`);
                onValue(starCountRef, (snapshot) => {
                    const data = snapshot.val();

                    // console.log("data :", data)

                    if (data == null || data == undefined) {
                        console.log("activity data null geliyor:", data);
                        reject(new Error("Data is null or undefined"));
                    } else {
                        dispatch(fetchActivityUserData(data));
                        resolve(data);
                    }
                });
            } catch (error) {
                toastErrorNotify('error getFireData');
                reject(error);
            }
        });

    }


    //! firebase data silme
    const removeFirebaseData = async (address, id) => {

        try {
            const db = getDatabase();
            remove(ref(db, `${address}/${id}`))
            toastSuccessNotify('Data Deleted ✅')
        } catch (error) {
            console.log("removeFirebaseData : ", error)
            toastErrorNotify('No Delete Data ❌')
        }
    }


    //! bonna personel datasını çek
    const get_bonnaPersonel = async () => {

        // dispatch(fetchStart())
        const year = new Date().getFullYear()
        console.log(year)

        try {

            const options = {
                method: 'POST',
                url: `${process.env.REACT_APP_bonnaUsers_BaseAddress}`,
                headers: {
                    'APIKEY': `${process.env.REACT_APP_bonnaApiKey}`,
                    'PYEAR': year

                }
            }

            const res = await axios(options)
            // return res?.data
            // const data = res?.data.map((item) => {
            //     return {
            //         NAME: item.NAME,
            //         SURNAME: item.SURNAME,
            //         TCKIMLIKNO: item.TCKIMLIKNO
            //     }
            // })

            if (res.data.length > 0) {
                dispatch(fetchBonnaPersonelData(res?.data))
            }
            else {
                toastErrorNotify('ERP Connection Error ! , Please Contact Admin or Check connector.karporselen.com')
            }

        } catch (error) {
            console.log("get_bonnaPersonel: ", error)
        }
    }


    //! kazanan kişileri kaydet
    const post_userWinners = (address, info) => {

        dispatch(fetchStart())

        try {

            const uID = uid()
            const db = getDatabase()

            set(ref(db, `${address}/` + uID), info)
            toastSuccessNotify('Data Added ')

        } catch (error) {
            console.log("post userWinners", error)
        }

    }


    //! kazanan kişileri listele
    const get_userWinners = async (address) => {

        let extractedData = [];

        return new Promise((resolve, reject) => {
            dispatch(fetchStart());

            try {
                const db = getDatabase();
                const starCountRef = ref(db, `${address}/`);
                onValue(starCountRef, (snapshot) => {
                    const data = snapshot.val();

                    if (data == null || data == undefined) {
                        console.log("activity user-winners data null geliyor:", data);
                        reject(new Error("Data is null or undefined"));
                    } else {

                        const result = Object.keys(data).map(key => { return { id: key, ...data[key] } })

                        result?.forEach(item => {
                            Object.values(item).forEach(person => {
                                // console.log(person)
                                if (typeof person === 'object' && person !== null) {
                                    extractedData.push({
                                        id: person.id,
                                        name: person.name,
                                        surname: person.surname,
                                        phone: person.phone,
                                        activityDate: standardizeDate(person.activityDate),
                                        department: person.department,
                                        activityName: person.activityName,
                                        status: person.isBackup,
                                        tesis: person.tesis,
                                        tcNo: person.tcNo,
                                        phone: person.phone,
                                        activityYear: person.activityYear,
                                        activityMonth: person.activityMonth

                                    });
                                }
                            });
                        });

                        dispatch(fetchUserWinnersData(result));
                        resolve(result);
                    }
                });
            }
            catch (error) {
                toastErrorNotify('error get_userWinners');
                reject(error);
            }
        });


        // dispatch(fetchStart())

        // try {

        //     const db = getDatabase();
        //     const starCountRef = ref(db, `${address}/`);
        //     onValue(starCountRef, (snapshot) => {
        //         const data = snapshot.val();

        //         if (data == null || data == undefined) {
        //             console.log("activity user-winners data null geliyor:", data)
        //         }
        //         else {
        //             dispatch(fetchUserWinnersData(data))

        //         }


        //     });

        // } catch (error) {
        //     toastErrorNotify('No Get Izo Press Data ❌')
        // }
    }

    //! dosyayı storage tarafına yükle
    const postImageDataToFirebase = async (files, info) => {

        // işlem başadığında loading bilgisini true yap
        dispatch(fetchUploadStart())

        try {

            const store = getStorage() //storage bilgisini çek

            const filePath = `images/${info?.fileName}`;
            const fileRef = dbRef(store, filePath);

            // Dosyayı Firebase Storage'a yükleyin
            await uploadBytes(fileRef, files);

            // Yüklenen dosyanın URL'sini alın
            const downloadURL = await getDownloadURL(fileRef);

            if (downloadURL) {

                // info objesini ayıkla ve downloadURL bilgisini yeni obje bilgisi içerisine ekle
                const newData = { ...info, imgUrl: downloadURL }

                //! realtime db kaydı için fonksiyon çalıştır
                postDownloadUrlToRealTimeDb(newData)

            }
            else {
                toastWarnNotify('Not created image url link !')
            }


        } catch (error) {
            dispatch(fetchFail())
            console.error("Dosya yükleme hatası: ", error);
            toastErrorNotify('File could not be accessed!')
            // throw error; // Hata yönetimi için hatayı fırlatın
        }

    }

    //! realtime db tarafına yüklenin dosyanın url bilgisini ve info datasını çalıştıran fonksiyon
    const postDownloadUrlToRealTimeDb = async (newObj) => {

        const uID = uid() //unique id oluştur
        const db = getDatabase() //database bilgisini çek

        try {

            if (newObj?.imgUrl) {
                await set(ref(db, 'images/' + uID), newObj)
                //yükleme işlemi sonrası loading ve error bilgisini false yap
                dispatch(fetchUploadEnd())
                toastSuccessNotify('File Uploaded')
            }

        } catch (error) {
            dispatch(fetchFail())
            // console.log("post realtime db error: ", error)
            toastErrorNotify('File not uploaded !')
            throw error; // Hata yönetimi için hatayı fırlatın
        }



    }


    //! firebase den kayıt edilen activity verisini çek
    const getActivityData = (address) => {


        dispatch(fetchStart());

        try {
            const db = getDatabase();
            const starCountRef = ref(db, `${address}/`);
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val();

                if (data == null || data == undefined) {
                    console.log("activity data null geliyor:", data);
                }
                else {
                    //db den gelen datayı array olarak çevir
                    const dizi = Object.keys(data).map(key => { return { id: key, ...data[key] } })

                    // console.log("dizi  :", dizi)

                    dispatch(fetchActivityData(dizi));

                }
            });
        }
        catch (error) {
            console.log("getActivityData : ", error)
            toastErrorNotify('error getFireData');
        }
        finally {
            dispatch(fetchEnd())
        }

    }



    //güncelle hooks
    const putFireData = (address, info) => {

        try {

            const db = getDatabase()
            update(ref(db, `${address}/` + info.id), info)
            toastSuccessNotify('Updated Data')

            /// güncelleme sonrası aktivite datasını tekrar çek
            getActivityData(address)

        } catch (error) {
            console.log("Update error :", error)
            toastErrorNotify('Not OK Update')
        }
    }



    return {

        postFireData,
        getFireData,
        removeFirebaseData,
        get_bonnaPersonel,
        post_userWinners,
        get_userWinners,
        postImageDataToFirebase,
        getActivityData,
        putFireData

    }

}

export default useRaffleCall




















