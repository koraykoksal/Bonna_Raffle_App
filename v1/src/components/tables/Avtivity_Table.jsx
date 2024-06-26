import { Box, Button } from '@mui/material'
import React from 'react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';


const Avtivity_Table = ({ activityData, delHandleOpen, setInfo, info }) => {



  const dataGrid_Columns = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "activityName",
      headerName: "Aktivite",
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "tesis",
      headerName: "Tesis",
      minWidth: 90,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Ad",
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "surname",
      headerName: "Soyad",
      minWidth: 100,
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
      field: "activityDate",
      headerName: "Aktivite Tarihi",
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "actions",
      type: 'actions',
      headerName: "#",
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: ({ id,
        row: {
          activityName,
          tesis,
          name,
          surname,
          phone,
          department,
          activityDate,
        } }) => {
        return [
          <GridActionsCellItem
            key={"delete"}
            icon={<MdDelete size={25} style={{ color: '#D80032' }} cursor='pointer' />}
            label="Delete"
            onClick={() => {
              delHandleOpen()
              setInfo({ id, type: 'user-application' })
            }}

          />,
        ]
      },
    },

  ];

  return (
    <div>

      <DataGrid
        columns={dataGrid_Columns}
        rows={activityData}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10, 25, 50, 75, 100]}
        slots={{ toolbar: GridToolbar }}
        disableRowSelectionOnClick
        sx={{
          boxShadow: 4,
        }}
      />

    </div>
  )
}

export default Avtivity_Table