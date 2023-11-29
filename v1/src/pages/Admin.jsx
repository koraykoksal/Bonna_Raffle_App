import { Box } from '@mui/material'
import React from 'react'
import { useEffect,useState } from 'react'
import useRaffleCall from '../hooks/useRaffleCall'
import { useSelector } from 'react-redux'
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';

const Admin = () => {


  const dataGrid_Columns = [
    // {
    //     field: "id",
    //     headerName: "ID",
    //     minWidth: 150,
    //     headerAlign: "center",
    //     align: "center",
    //     flex: 1,
    // },
    {
      field: "activityName",
      headerName: "Aktivite",
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    
    {
      field: "activityDate",
      headerName: "Tarih",
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Ad",
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "surname",
      headerName: "Soyad",
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Telefon",
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "department",
      headerName: "Departman",
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "#",
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: ({ id }) => {
        return [
          <GridActionsCellItem
            key={"edit"}
            icon={<AiFillEdit size={25} style={{ color: '#0802A3' }} cursor='pointer' />}
            label="Edit"
            // onClick={() => {
            //   handleOpen()
            //   setInfo({ id, type: 'bonna-activity' })
            // }}

          />,
          <GridActionsCellItem
            key={"delete"}
            icon={<MdDelete size={25} style={{ color: '#D80032' }} cursor='pointer' />}
            label="Delete"
            // onClick={() => {
            //   delHandleOpen()
            //   setInfo({ id, type: 'bonna-activity' })
            // }}

          />,
        ]
      },
    },

  ];



  const {getFireData} = useRaffleCall()
  const {firebase_activityData} = useSelector((state)=>state.raffle)
  const [activityData, setactivityData] = useState([])

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
    <DataGrid
      columns={dataGrid_Columns}
      rows={activityData}
      pageSizeOptions={[10, 25, 50, 75, 100]}
      slots={{ toolbar: GridToolbar }}
      disableRowSelectionOnClick
      sx={{
        boxShadow: 4,
      }}
    />
    </Box>

   

    </div>
  )
}

export default Admin