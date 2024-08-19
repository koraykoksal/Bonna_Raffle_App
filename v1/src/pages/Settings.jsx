import { Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React from 'react'
import NewActivity from '../components/modals/NewActivity';
import { useState, useEffect } from 'react';
import useRaffleCall from '../hooks/useRaffleCall';
import { useDispatch, useSelector } from 'react-redux';
import ActivityData_Table from '../components/tables/ActivityData_Table';
import DeleteModals from '../components/modals/DeleteModals';
import { tesis } from '../helper/bonna_departments';
import { fetchLokasyonSetting } from '../features/raffleSlice';


const Settings = () => {

    const [files, setFiles] = useState("")
    const { postImageDataToFirebase, getActivityData, putFireData } = useRaffleCall()
    const { activityData, lokasyonData } = useSelector((state) => state.raffle)
    const [localeStorageInfo, setlocaleStorageInfo] = useState([])
    // const localeStorageInfo = JSON.parse(localStorage.getItem('lokasyonData'))


    const [info, setInfo] = useState({
        activityName: "",
        activityDate: "",
        fileName: "",
        members: "",
        publish: false
    })

    const [data, setData] = useState({
        cayirova: "",
        pazaryeri: "",
        pendik: ""
    })

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false)
        setInfo({
            activityName: "",
            activityDate: "",
            fileName: "",
            members: "",
            publish: false
        })
    }

    const [delOpen, delSetOpen] = useState(false)
    const delHandleOpen = () => delSetOpen(true);
    const delHandleClose = () => {
        delSetOpen(false)
    }


    const handleChange = (e) => {
        const { name, value } = e.target
        setInfo({ ...info, [name]: value })
    }

    const handleFileChange = (e) => {

        const file = e.target.files[0]

        if (file) {
            setFiles(file) // dosyanın kendisini state gönder
            setInfo(prevInfo => ({
                ...prevInfo,
                fileName: file.name // dosyanın adını state yaz
            }))
        }

    }

    const handleIsCheck = (e) => {
        const { checked } = e.target
        setInfo({ ...info, ['publish']: checked })
    }


    //kayıt işlemi yap
    const handleSubmit = (e) => {
        e.preventDefault()

        if (info.id) {
            putFireData('images', info)
        }
        else {
            postImageDataToFirebase(files, info)
        }

        setInfo({
            activityName: "",
            activityDate: "",
            fileName: "",
            members: "",
            publish: false
        })

    }


    //aktivasyon datasını çek
    useEffect(() => {
        getActivityData('images')
    }, [])


    const handleDataChange = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
    }


    const handleSave = (e) => {
        e.preventDefault()
        localStorage.setItem('lokasyonData', JSON.stringify(data))
        setlocaleStorageInfo(JSON.parse(localStorage.getItem('lokasyonData')))
    }


    useEffect(() => {
        setlocaleStorageInfo(JSON.parse(localStorage.getItem('lokasyonData')) || {})
    }, [])
    


    return (
        <div>


            <Container sx={{ py: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>

                <Button sx={{ textTransform: 'none', width: 100 }} variant='contained' onClick={handleOpen}>Yeni</Button>

                <Container sx={{ display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'center', alignItems: 'center' }} component={'form'} onSubmit={handleSave}>

                    {/* <FormControl sx={{ width: '200px' }}>
                            <InputLabel id='lokasyon'>Lokasyon</InputLabel>
                            <Select
                                required
                                name='lokasyon'
                                id='lokasyon'
                                label='Lokasyon'
                                labelId='lokasyon'
                                value={data.lokasyon}
                                onChange={handleDataChange}
                            >
                                {
                                    tesis.map((item, index) => (
                                        <MenuItem key={index} value={item}>{item}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl> */}

                    <Box maxWidth='sm' sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>

                        <Typography width={100} align='left'>Çayırova</Typography>

                        <TextField
                            size='small'
                            required
                            name='cayirova'
                            id='cayirova'
                            variant='outlined'
                            label='Miktar'
                            type='number'
                            value={data.cayirova}
                            onChange={handleDataChange}
                        />

                    </Box>
                    <Box maxWidth='sm' sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>

                        <Typography width={100} align='left'>Pazaryeri</Typography>

                        <TextField
                            size='small'
                            required
                            name='pazaryeri'
                            id='pazaryeri'
                            variant='outlined'
                            label='Miktar'
                            type='number'
                            value={data.pazaryeri}
                            onChange={handleDataChange}
                        />

                    </Box>
                    <Box maxWidth='sm' sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>

                        <Typography width={100} align='left'>Pendik</Typography>

                        <TextField
                            size='small'
                            required
                            name='pendik'
                            id='pendik'
                            variant='outlined'
                            label='Miktar'
                            type='number'
                            value={data.pendik}
                            onChange={handleDataChange}
                        />

                    </Box>

                    <Button sx={{ width: 150 ,textTransform:'none'}} color='success' size='small' variant='outlined' type='submit'>Güncelle</Button>

                    {/* {
                        lokasyonData.lokasyon && lokasyonData.miktar ?
                            (
                                <Typography color={'red'} variant='subtitle2' align='center'>
                                    Girilen Data :  {lokasyonData.lokasyon} : {lokasyonData.miktar}
                                </Typography>
                            )
                            :
                            ""
                    } */}

                </Container>


                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 3, alignItems: 'center' }}>
                    <Grid sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3, backgroundColor: '#bebe', p: 1, borderRadius: 3 }}>
                        <Typography align='left'>Çayırova :</Typography>
                        <Typography>{localeStorageInfo.cayirova || 0}</Typography>
                    </Grid>
                    <Grid sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, backgroundColor: '#bebe', p: 1, borderRadius: 3 }}>
                        <Typography align='left'>Pazaryeri :</Typography>
                        <Typography>{localeStorageInfo.pazaryeri || 0}</Typography>
                    </Grid>
                    <Grid sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, backgroundColor: '#bebe', p: 1, borderRadius: 3 }}>
                        <Typography align='left'>Pendik :</Typography>
                        <Typography>{localeStorageInfo.pendik || 0}</Typography>
                    </Grid>
                </Box>

            </Container>

            <ActivityData_Table activityData={activityData} setInfo={setInfo} delHandleOpen={delHandleOpen} handleOpen={handleOpen} />

            <NewActivity info={info} setInfo={setInfo} open={open} handleClose={handleClose} handleChange={handleChange} handleFileChange={handleFileChange} handleSubmit={handleSubmit} handleIsCheck={handleIsCheck} />

            <DeleteModals delOpen={delOpen} delHandleClose={delHandleClose} info={info} />

        </div>
    )
}

export default Settings