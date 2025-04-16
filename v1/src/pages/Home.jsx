import { Box, Button, Container, Typography } from '@mui/material'
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
import { standardizeDate } from '../helper/format'

export const Home = () => {

  const { getFireData, get_bonnaPersonel, get_userWinners, getActivityData } = useRaffleCall()
  const { token } = useSelector((state) => state.auth)
  const { activityData, loading, bonnaPersonels, userWinners } = useSelector((state) => state.raffle)

  const [winnersData, setWinnersData] = useState([])

  let extractedData = [];


  // sayfa render olduğu zaman firebase den verileri çek
  useEffect(() => {
    get_bonnaPersonel()
    getActivityData('images')
    getFireData('bonna-activity')
    get_userWinners('bonna-activity-winners')

  }, [])



  useEffect(() => {

    const data = Object.keys(userWinners).map(key => { return { id: key, ...userWinners[key] } })

    data.forEach(item => {
      Object.values(item).forEach(person => {
        
        if (typeof person === 'object' && person !== null) {
          extractedData.push({
            id: person.id,
            name: person.name,
            surname: person.surname,
            phone: person.phone,
            activityDate: standardizeDate(person.activityDate),
            department: person.department,
            activityName: person.activityName,
            status: person.isBackup || person.status,
            tesis: person.tesis
          });
        }
      });
    });

    setWinnersData(extractedData)

  }, [userWinners])


  // const data = bonnaPersonels.filter((item)=>item.TCKIMLIKNO == '12176075560')

  // console.log(data)

  return (

    <div style={homeBgPattern}>

      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', py: 5, gap: 5 }}>

        {
          loading ?
            <Typography>Etkinlik verileri yükleniyor..</Typography>
            :
            <Etkinliks
              activityData={activityData}
              winnersData={winnersData}
            />

        }
      </Box>
    </div>

  )
}
