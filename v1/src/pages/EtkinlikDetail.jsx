import React from 'react'
import { detailBgPattern } from '../styles/theme'
import { useLocation, useParams } from 'react-router'
import { Box, Button, Container } from '@mui/material'
import Application_Modal from '../components/Application_Modal'
import { useState, useEffect } from 'react'


const EtkinlikDetail = () => {


    const { id } = useParams()
    const { state } = useLocation()

    const [info, setInfo] = useState({
        tcNo: "",
        name: "",
        surname: "",
        phone: "",
        department: "",
        activityName: state.name,
        activityDate: state.date
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
            activityName: state.name,
            activityDate: state.date

        })
    }



    return (
        <div style={detailBgPattern}>



            <Box sx={{ display: 'flex', flexDirection: 'column', p: 3, gap: 4 }}>
                <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant='contained' onClick={handleOpen} sx={{ width: '200px' }}>Başvur</Button>
                </Container>
                <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                    <img src={state.image} style={{ width: '850px' }} />
                </Container>
            </Box>


            <Application_Modal open={open} handleClose={handleClose} info={info} setInfo={setInfo} state={state}/>



        </div>
    )
}

export default EtkinlikDetail