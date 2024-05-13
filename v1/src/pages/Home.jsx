import { Box, Button, Container } from '@mui/material'
import React from 'react'
import Application_Modal from '../components/modals/Application_Modal'
import { useState, useEffect } from 'react'
import { activityInfo } from '../helper/avtivity_Info';
import useRaffleCall from '../hooks/useRaffleCall';
import { useSelector } from 'react-redux';
import cokguzelhareketler2 from "../assets/etkinlik/cokguzelhareketler2.png"
import Etkinliks from '../components/Etkinliks';
import { homeBgPattern } from '../styles/theme';
import NewActivity from '../components/modals/NewActivity';


export const Home = () => {

  const { getFireData, get_bonnaPersonel, get_userWinners, getActivityData } = useRaffleCall()
  const { token } = useSelector((state) => state.auth)
  const { activityData } = useSelector((state) => state.raffle)


  // sayfa render olduğu zaman firebase den verileri çek
  useEffect(() => {
    get_bonnaPersonel()
    getActivityData('images')
    getFireData('bonna-activity')
    get_userWinners('bonna-activity-winners')
    
  }, [])




  return (

    <div style={homeBgPattern}>

      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', py: 5, gap: 5 }}>
        <Etkinliks activityData={activityData} />
      </Box>
    </div>

  )
}
