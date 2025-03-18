import { Box, Typography } from '@mui/material'
import React from 'react'
import { useEffect, useState } from 'react'
import useRaffleCall from '../hooks/useRaffleCall'
import { useSelector } from 'react-redux'
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import Avtivity_Table from '../components/tables/Avtivity_Table'
import DeleteModals from '../components/modals/DeleteModals'
import { parseISO, format } from 'date-fns';

const UserApplications = () => {


  const { getFireData } = useRaffleCall()
  const { firebase_activityData } = useSelector((state) => state.raffle)
  const [activityData, setActivityData] = useState([])
  const [data, setData] = useState([])
  const [delOpen, setdelOpen] = React.useState(false);
  const delHandleOpen = () => setdelOpen(true);
  const delHandleClose = () => setdelOpen(false);

  const [info, setInfo] = useState([])

  useEffect(() => {
    getFireData('bonna-activity')
  }, [])



  useEffect(() => {
    if (!activityData || activityData.length === 0) return;
  
    // Önce Yıla Göre, Sonra Aya Göre Büyükten Küçüğe Sıralama
    const sortedData = [...activityData].sort((a, b) => {
      return b.activityYear - a.activityYear || b.activityMonth - a.activityMonth;
    });
  
    setData(sortedData);
  
  }, [activityData]);


  useEffect(() => {

    const data = Object.keys(firebase_activityData).map(key => { return { id: key, ...firebase_activityData[key] } })

    // başvuru listesinde etkinlik tarihi en son olanı listenin en üstünde göster
    data.sort((a, b) => {
      const dateA = new Date(a.activityDate.split('.').reverse().join('-'))
      const dateB = new Date(b.activityDate.split('.').reverse().join('-'))
      return dateB - dateA
    })
    setActivityData(data)

  }, [firebase_activityData])


  return (
    <div>

      <Typography variant='h6' align='center' p={3} color='#AB232B' fontWeight={700}>Başvurular</Typography>


      <Box sx={{ p: 5 }}>

        <Avtivity_Table
          activityData={activityData}
          data={data}
          delHandleOpen={delHandleOpen}
          setInfo={setInfo}
          info={info}
        />

        <DeleteModals delOpen={delOpen} delHandleClose={delHandleClose} info={info} />

      </Box>



    </div>
  )
}

export default UserApplications