import { Box } from '@mui/material'
import React from 'react'
import { useEffect,useState } from 'react'
import useRaffleCall from '../hooks/useRaffleCall'
import { useSelector } from 'react-redux'
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import Avtivity_Table from '../components/tables/Avtivity_Table'
import DeleteModals from '../components/modals/DeleteModals'

const Admin = () => {


  const {getFireData} = useRaffleCall()
  const {firebase_activityData} = useSelector((state)=>state.raffle)
  const [activityData, setactivityData] = useState([])

  const [delOpen, setdelOpen] = React.useState(false);
  const delHandleOpen = () => setdelOpen(true);
  const delHandleClose = () => setdelOpen(false);

  useEffect(() => {
    getFireData('bonna-activity')
  }, [])

  useEffect(() => {
    const data = Object.keys(firebase_activityData).map(key=>{return {id:key,...firebase_activityData[key]}})
    setactivityData(data)
  }, [firebase_activityData])
  
  

  return (
    <div>


    <Box sx={{p:5}}>

    <Avtivity_Table activityData={activityData} delHandleOpen={delHandleOpen}/>

    <DeleteModals delOpen={delOpen} delHandleClose={delHandleClose} activityData={activityData}/>

    </Box>

   

    </div>
  )
}

export default Admin