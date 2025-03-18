
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
import { useNavigate } from "react-router-dom"
import { bonnaPersonels } from '../helper/personels'
import { getStorage, ref as dbRef, uploadBytes, getDownloadURL, getMetadata, listAll, list, deleteObject } from "firebase/storage";

const useRaffleCall = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { firebase_activityData, bonnaPersonel, userWinners } = useSelector((state) => state.raffle)
    const year = new Date().getFullYear()

    //! etkinlik register kaydı yap
    const postFireData = async (address, info) => {



        try {

            dispatch(fetchStart())

            const bonnaPersonel = await get_bonnaPersonel() // bonna personel datasını çek

            // console.log("bonnaPersonel : ", bonnaPersonel)

            // await getFireData('bonna-activity') // başvuru listesini çek
            // await get_userWinners('bonna-activity-winners') // kazananlar lisesini çek

            //?* personel var mı kontrol et
            const findPersonel = bonnaPersonel?.find((item) => item.TCKIMLIKNO == info.tcNo)

            // console.log("findPersonel : ", findPersonel)

            if (findPersonel) {

                const activityDataDizi = Object.keys(firebase_activityData).map(key => { return { id: key, ...firebase_activityData[key] } })


                // console.log("activityDataDizi : ", activityDataDizi)

                //! bir sonraki aktivite de burayı güncelleme ve activity:2024 (current year bilgisini getir)
                // const winnersDizi = Object.values(userWinners).reduce((acc, current) => acc.concat(current), []);

                //?* kazananlar listesinde ki kişinin tcNo eşlemesi ve Asil listesinde olup olmadığına bakar
                // const isWin = winnersDizi.some(winner => winner.tcNo === info.tcNo && winner.status == 'Asil');


                // const dizi = Object.keys(firebase_activityData).map(key => { return { id: key, ...firebase_activityData[key] } })

                const sameData = activityDataDizi.find((item) => item.tcNo === info.tcNo && item.activityName == info.activityName);

                // console.log("sameData : ",sameData)

                if (sameData) {
                    toastErrorNotify(`${info.tcNo} kimlik nuraması ile kayıt bulunmaktadır. Tekrar kayıt yapamazsınız !`)
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
        finally{
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
            return res?.data
            // const data = res?.data.map((item) => {
            //     return {
            //         NAME: item.NAME,
            //         SURNAME: item.SURNAME,
            //         TCKIMLIKNO: item.TCKIMLIKNO
            //     }
            // })
            // dispatch(fetchBonnaPersonelData(data))

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
                        dispatch(fetchUserWinnersData(data));
                        resolve(data);
                    }
                });
            } catch (error) {
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
        finally{
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




















