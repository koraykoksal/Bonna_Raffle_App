import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { format } from "date-fns"

const Avtivity_Table = ({ activityData, data, delHandleOpen, setInfo, info }) => {

  const now = new Date()


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
      renderCell: (params) => {

        return [
          <Typography
            variant='body2'
            sx={{
              maxWidth: 200,
              overflow: 'auto',
              textOverflow: 'ellipsis',
              whiteSpace: 'collapse',
              wordBreak: 'break-word'
            }}
          >
            {params.row.activityName}
          </Typography>
        ]
      }
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
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => {

        return [
          <Typography variant='body2'>{params.row.name.toUpperCase()}</Typography>

        ]
      }
    },
    {
      field: "surname",
      headerName: "Soyad",
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => {

        return [
          <Typography variant='body2'>{params.row.surname.toUpperCase()}</Typography>

        ]
      }
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
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      flex: 1,
      // renderCell: (params) => {

      //   return [
      //     <Typography variant='body2'>{format(params.row.activityDate, 'dd-MM-yyyy HH:mm')}</Typography>

      //   ]
      // }
    },
    {
      field: "activityMonth",
      headerName: "Aktivite Ayı",
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      flex: 1,
      // renderCell: (params) => {

      //   return [
      //     <Typography variant='body2'>{format(params.row.activityDate, 'dd-MM-yyyy HH:mm')}</Typography>

      //   ]
      // }
    },
    {
      field: "activityYear",
      headerName: "Aktivite Yılı",
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      flex: 1,
      // renderCell: (params) => {

      //   return [
      //     <Typography variant='body2'>{format(params.row.activityDate, 'dd-MM-yyyy HH:mm')}</Typography>

      //   ]
      // }
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
        rowHeight={80}
        rows={data}
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