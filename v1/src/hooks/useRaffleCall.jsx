
import React from 'react'
import {
    fetchStart,
    fetchFail,
    fetchApplyData,
    fetchActivityData

} from '../features/raffleSlice'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toastInfoNotify, toastSuccessNotify, toastErrorNotify } from '../helper/ToastNotify'
import { doc, setDoc, Timestamp, collection, addDoc, getDocs, getDoc } from "firebase/firestore";
import { db } from "../db/firebase_db"
import { getDatabase, onValue, ref, remove, set, update } from "firebase/database";
import { uid } from "uid";
import { useState } from 'react';


const useRaffleCall = () => {

    const dispatch = useDispatch()

    const { firebase_activityData } = useSelector((state) => state.raffle)

    const postFireData = async (address, info) => {

        dispatch(fetchStart())

        try {

            const dizi = Object.keys(firebase_activityData).map(key => { return { id: key, ...firebase_activityData[key] } })


            const sameData = dizi.filter((item) => item.tcNo == info.tcNo)

            if (sameData) {
                toastErrorNotify(`${info.tcNo} kimlik nuraması ile kayıt bulunmaktadır. Tekrar kayıt yapamazsınız !`)
            }
            else {
                const uID = uid()
                const db = getDatabase();
                set(ref(db, `${address}/` + uID), info);
                toastSuccessNotify('Başvuru Yapıldı ✅')
            }

        } catch (error) {
            toastErrorNotify('Başvuru Yapılamadı ❌')
        }

    }



    //! firebase data çek
    const getFireData = async (address) => {

        dispatch(fetchStart())

        try {

            const db = getDatabase();
            const starCountRef = ref(db, `${address}/`);
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val();

                if (data == null || data == undefined) {
                    console.log("activity data null geliyor:", data)
                }
                else {
                    dispatch(fetchActivityData(data))

                }


            });

        } catch (error) {
            toastErrorNotify('No Get Izo Press Data ❌')
        }



    }



    
    return {

        postFireData,
        getFireData

    }

}

export default useRaffleCall




















