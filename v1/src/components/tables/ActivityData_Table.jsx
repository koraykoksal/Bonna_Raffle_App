import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';

const ActivityData_Table = ({ activityData,settingData, setInfo, delHandleOpen,handleOpen }) => {

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
      headerAlign: "left",
      align: "left",
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
      field: "activityDate",
      headerName: "Tarih",
      minWidth: 90,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "publish",
      headerName: "Yayın",
      minWidth: 90,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "members",
      headerName: "Katılımcı Sayısı",
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "fileName",
      headerName: "Dosya Adı",
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
          activityDate,
          publish,
          members,
          fileName,
        } }) => {
        return [
          <GridActionsCellItem
            key={"edit"}
            icon={<AiFillEdit size={25} style={{ color: '#0802A3' }} cursor='pointer' />}
            label="Edit"
            onClick={() => {
              handleOpen()
              setInfo({
                id,
                type: 'activitydata',
                activityName,
                activityDate,
                publish,
                members,
                fileName,
              })
            }}

          />,
          <GridActionsCellItem
            key={"delete"}
            icon={<MdDelete size={25} style={{ color: '#D80032' }} cursor='pointer' />}
            label="Delete"
            onClick={() => {
              delHandleOpen()
              setInfo({ id, type: 'activitydata' })
            }}

          />,
        ]
      },
    },

  ];

  return (
    <div>

      {
        <Box p={3}>
          <DataGrid
          rowHeight={80}
            columns={dataGrid_Columns}
            rows={settingData}
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
        </Box>
      }

    </div>
  )
}

export default ActivityData_Table