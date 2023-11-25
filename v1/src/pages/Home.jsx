import { Button, Container } from '@mui/material'
import React from 'react'
import Application_Modal from '../components/Application_Modal'
import { useState } from 'react'

export const Home = () => {



  const [info, setInfo] = useState({
    tcNo: "",
    name: "",
    surname: "",
    phone: "",
    department: "",
    activityName: ""
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
      activityName: ""

    })
  }



  return (

    <div>

      <Container sx={{ p: 1 }}>
        <Button
          variant='contained'
          sx={{ p: 1, mt: 3 }}
          onClick={handleOpen}
        >
          Başvur
        </Button>
      </Container>

      <Application_Modal open={open} handleClose={handleClose} info={info} setInfo={setInfo} />

    </div>

  )
}
