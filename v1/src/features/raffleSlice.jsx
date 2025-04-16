
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { createElement, useEffect } from "react";
import moment from "moment";


const initialState = {
    loading:false,
    error:false,
    sameTCNO:false,

    userApplyData:[],
    firebase_activityData:[],
    bonnaPersonels:[],
    userWinners:[],

    activityData:[],
    fileUpload_Loading:false,

    lokasyonData:[]
}

const raffleSlice = createSlice({

    name: "raffle",
    initialState,
    reducers: {


        fetchStart: (state) => {
            state.loading = true;
            state.error = false;
        },
        fetchEnd: (state) => {
            state.loading = false;
        },
        fetchFail: (state) => {
            state.loading = false;
            state.error = true;
        },
        fetchApplyData:(state,{payload})=>{
            state.loading=false
            state.sameTCNO=false
            state.userApplyData=payload
        },
        fetchActivityData:(state,{payload})=>{
            state.loading=false
            state.activityData=payload
        },
        fetchActivityUserData:(state,{payload})=>{
            state.loading=false
            state.firebase_activityData=payload
        },
        fetchBonnaPersonelData:(state,{payload})=>{
            state.loading=false
            state.bonnaPersonels=payload
        },
        fetchUserWinnersData:(state,{payload})=>{
            state.loading=false
            state.userWinners=payload
        },
        fetchUploadStart: (state) => {
            state.fileUpload_Loading = true
            state.error = false
        },
        fetchUploadEnd: (state) => {
            state.fileUpload_Loading = false
            state.error = false
        },
        fetchLokasyonSetting: (state,{payload}) => {
          state.lokasyonData=payload
        },


    }


})



export const {
    
    fetchStart,
    fetchEnd,
    fetchFail,
    fetchApplyData,
    fetchActivityUserData,
    fetchActivityData,
    fetchBonnaPersonelData,
    fetchUserWinnersData,
    fetchUploadStart,
    fetchUploadEnd,
    fetchLokasyonSetting

} = raffleSlice.actions

//slice oluşturulduktan sonra export default olarak export edilmeli ve reducer ifadesi belirtilmelidir.
export default raffleSlice.reducer






