
import React from 'react'
import {
    fetchStart,
    fetchFail,
    fetchApplyData,
    fetchActivityData,
    fetchBonnaPersonelData,
    fetchUserWinnersData

} from '../features/raffleSlice'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toastInfoNotify, toastSuccessNotify, toastErrorNotify } from '../helper/ToastNotify'
import { doc, setDoc, Timestamp, collection, addDoc, getDocs, getDoc } from "firebase/firestore";
import { db } from "../db/firebase_db"
import { getDatabase, onValue, ref, remove, set, update } from "firebase/database";
import { uid } from "uid";
import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import { bonnaPersonels } from '../helper/personels'


const useRaffleCall = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { firebase_activityData, bonnaPersonel, userWinners } = useSelector((state) => state.raffle)
    const year = new Date().getFullYear()

    //! etkinlik register kaydı yap
    const postFireData = async (address, info) => {


        try {

            // await get_bonnaPersonel() // bonna personel datasını çek
            // await getFireData('bonna-activity') // başvuru listesini çek
            // await get_userWinners('bonna-activity-winners') // kazananlar lisesini çek

            //?* personel var mı kontrol et
            const findPersonel = bonnaPersonels?.find((item) => item.TCKIMLIKNO == info.tcNo)

            if (findPersonel) {

                const activityDataDizi = Object.keys(firebase_activityData).map(key => { return { id: key, ...firebase_activityData[key] } })

                //! bir sonraki aktivite de burayı güncelleme ve activity:2024 (current year bilgisini getir)
                // const winnersDizi = Object.values(userWinners).reduce((acc, current) => acc.concat(current), []);

                //?* kazananlar listesinde ki kişinin tcNo eşlemesi ve Asil listesinde olup olmadığına bakar
                // const isWin = winnersDizi.some(winner => winner.tcNo === info.tcNo && winner.status == 'Asil');


                // const dizi = Object.keys(firebase_activityData).map(key => { return { id: key, ...firebase_activityData[key] } })

                const sameData = activityDataDizi.find((item) => item.tcNo === info.tcNo && item.activityName == info.activityName);

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





        } catch (error) {
            toastErrorNotify('Başvuru Yapılamadı')
            console.log("Başvuru Yapılamadı: ", error)
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

                    if (data == null || data == undefined) {
                        console.log("activity data null geliyor:", data);
                        reject(new Error("Data is null or undefined"));
                    } else {
                        dispatch(fetchActivityData(data));
                        resolve(data);
                    }
                });
            } catch (error) {
                toastErrorNotify('error getFireData');
                reject(error);
            }
        });

        // dispatch(fetchStart())

        // try {

        //     const db = getDatabase();
        //     const starCountRef = ref(db, `${address}/`);
        //     onValue(starCountRef, (snapshot) => {
        //         const data = snapshot.val();

        //         // console.log(data)

        //         if (data == null || data == undefined) {
        //             console.log("activity data null geliyor:", data)
        //         }
        //         else {
        //             dispatch(fetchActivityData(data))

        //         }


        //     });

        // } catch (error) {
        //     toastErrorNotify('No Get Izo Press Data ❌')
        // }



    }


    //! firebase data silme
    const removeFirebaseData = async (address, id) => {

        try {
            const db = getDatabase();
            remove(ref(db, `${address}/${id}`))
            toastSuccessNotify('Data Deleted ✅')
        } catch (error) {
            toastErrorNotify('No Delete Data ❌')
        }
    }


    //! bonna personel datasını çek
    const get_bonnaPersonel = async () => {

        dispatch(fetchStart())

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
            const data = res?.data.map((item)=>{
                return{
                    NAME:item.NAME,
                    SURNAME:item.SURNAME,
                    TCKIMLIKNO:item.TCKIMLIKNO
                }
            })
   
            dispatch(fetchBonnaPersonelData(data))

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





    return {

        postFireData,
        getFireData,
        removeFirebaseData,
        get_bonnaPersonel,
        post_userWinners,
        get_userWinners

    }

}

export default useRaffleCall




















