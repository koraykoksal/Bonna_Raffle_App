import { Box, Button, Container } from '@mui/material'
import React from 'react'
import Application_Modal from '../components/Application_Modal'
import { useState, useEffect } from 'react'
import { activityInfo } from '../helper/avtivity_Info';
import useRaffleCall from '../hooks/useRaffleCall';
import { useSelector } from 'react-redux';
import cokguzelhareketler2 from "../assets/etkinlik/cokguzelhareketler2.png"
import Etkinliks from '../components/Etkinliks';
import { homeBgPattern } from '../styles/theme';


export const Home = () => {


  const { getFireData } = useRaffleCall()
  const { firebase_activityData } = useSelector((state) => state.raffle)

  useEffect(() => {
    getFireData('bonna-activity')
  }, [])



  const [info, setInfo] = useState({
    tcNo: "",
    name: "",
    surname: "",
    phone: "",
    department: "",
    activityName: activityInfo.name,
    activityDate: activityInfo.date
  })

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false)
    setInfo({
      tcNo: "",
      name: "",
      surname: "",
      phone: "",
      department: "",
      birthday: "",
      activityName: activityInfo.name,
      activityDate: activityInfo.date

    })
  }




  return (

    <div style={homeBgPattern}>

      <Box >


        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5, gap: 5 }}>
          <Etkinliks />
        </Box>


      </Box>



    </div>

  )
}
