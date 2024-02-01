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

  const { getFireData, get_bonnaPersonel, get_userWinners } = useRaffleCall()
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    getFireData('bonna-activity')
    get_userWinners('bonna-activity-winners')
    get_bonnaPersonel()
  }, [])


  const handleChange = (e) => {

    const {name,value} = e.target
    setInfo({...info,[name]:value})
    
  }
  
  const handleFileChange=(e)=>{

    const filename = e.target.files[0].name

    if(e.target.files[0].name){
      setInfo(prevInfo=>({
        ...prevInfo,
        activityImage:filename
      }))
    }

  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setInfo({
      activityName: "",
      activityDate: "",
      activityImage: "",
      members: ""
    })

  }

  const [info, setInfo] = useState({
    activityName: "",
    activityDate: "",
    activityImage: "",
    members: ""

  })


  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false)
    setInfo({
      activityName: "",
      activityDate: "",
      activityImage: "",
      members: ""
    })
  }


  console.log(info)



  return (

    <div style={homeBgPattern}>

      <Box>


        {
          token && <Container sx={{ py: 5 }}>
            <Button sx={{ textTransform: 'none' }} variant='contained' onClick={handleOpen}>Yeni</Button>
          </Container>
        }



        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', py: 5, gap: 5 }}>
          <Etkinliks />
        </Box>


      </Box>

      <NewActivity info={info} setInfo={setInfo} open={open} handleClose={handleClose} handleChange={handleChange} handleFileChange={handleFileChange} handleSubmit={handleSubmit} />

    </div>

  )
}
