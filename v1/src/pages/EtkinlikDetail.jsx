import React from 'react'
import { detailBgPattern } from '../styles/theme'
import { useLocation, useParams } from 'react-router'
import { Box, Button, Container } from '@mui/material'
import Application_Modal from '../components/modals/Application_Modal'
import { useState, useEffect } from 'react'
import useRaffleCall from '../hooks/useRaffleCall'
import { useNavigate } from "react-router-dom"

const EtkinlikDetail = () => {


    const navigate = useNavigate()
    const { get_bonnaPersonel } = useRaffleCall()
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1
    const { id } = useParams()
    const { state } = useLocation()

    const [info, setInfo] = useState({
        tcNo: "",
        name: "",
        surname: "",
        phone: "",
        department: "",
        birthday: "",
        tesis: "",
        activityYear: currentYear,
        activityMonth: currentMonth,
        activityName: state.activityName,
        activityDate: state.activityDate
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
            tesis: "",
            activityYear: currentYear,
            activityName: state.activityName,
            activityDate: state.activityDate

        })
    }


    useEffect(() => {
        get_bonnaPersonel()
    }, [])


    return (
        <div style={detailBgPattern}>



            <Box sx={{ display: 'flex', flexDirection: 'column', p: 3, gap: 4 }}>
                <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant='contained' color='success' onClick={handleOpen} sx={{ width: '200px', letterSpacing: 3 }}>Başvur</Button>
                </Container>
                <Container sx={{ display: 'flex', justifyContent: 'center' }}>
                    <img src={state.imgUrl} style={{ width: '850px' }} />
                </Container>
                <Container sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3 }}>
                    <Button variant='outlined' color='secondary' onClick={() => navigate(-1)} sx={{ width: '200px' }}>Geri</Button>
                    <Button variant='contained' color='info' onClick={() => navigate('/')} sx={{ width: '200px' }}>Ana Sayfa</Button>
                </Container>
            </Box>


            <Application_Modal open={open} handleClose={handleClose} info={info} setInfo={setInfo} state={state} />



        </div>
    )
}

export default EtkinlikDetail