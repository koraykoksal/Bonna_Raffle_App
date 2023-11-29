
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
    bonnaPersonel:[],
}

const raffleSlice = createSlice({

    name: "raffle",
    initialState,
    reducers: {


        fetchStart: (state) => {
            state.loading = true;
            state.error = false;
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
            state.firebase_activityData=payload
        },
        fetchBonnaPersonelData:(state,{payload})=>{
            state.loading=false
            state.bonnaPersonel=payload
        }



    }


})



export const {
    
    fetchStart,
    fetchFail,
    fetchApplyData,
    fetchActivityData,
    fetchBonnaPersonelData

} = raffleSlice.actions

//slice oluşturulduktan sonra export default olarak export edilmeli ve reducer ifadesi belirtilmelidir.
export default raffleSlice.reducer






