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
    const { userID, token } = useSelector((state) => state.auth)
    const [localeStorageInfo, setlocaleStorageInfo] = useState([])
    const [settingData, setSettingData] = useState([])


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
        pendik: "",
        mavi: "",
        beyaz: ""
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
        localStorage.setItem(userID, JSON.stringify(data))
        setlocaleStorageInfo(JSON.parse(localStorage.getItem(userID)))
    }


    useEffect(() => {
        setlocaleStorageInfo(JSON.parse(localStorage.getItem(userID)) || {})
    }, [])




    useEffect(() => {
        if (!activityData || activityData.length === 0) return;

        // Tarihe göre büyükten küçüğe sıralama (En yeni tarihler önce gelecek)
        const sortedData = [...activityData].sort((a, b) => {
            return new Date(b.activityDate) - new Date(a.activityDate);
        });

        // console.log("sortedData : ", sortedData);
        setSettingData(sortedData);

    }, [activityData]);





    return (
        <div>


            <Container sx={{ py: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>

                <Button sx={{ textTransform: 'none', width: 100 }} variant='contained' onClick={handleOpen}>Yeni</Button>

                <Container maxWidth="sm" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: `1px solid gray`,
                    borderRadius: 3,
                    p: 3
                }} component={'form'} onSubmit={handleSave}>

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

                    <Box maxWidth='sm' sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>

                        <Typography width={100} align='right'>Çayırova</Typography>

                        <TextField
                            placeholder='0'
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
                    <Box maxWidth='sm' sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>

                        <Typography width={100} align='right'>Pazaryeri</Typography>

                        <TextField
                            placeholder='0'
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
                    <Box maxWidth='sm' sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>

                        <Typography width={100} align='right'>Pendik</Typography>

                        <TextField
                            placeholder='0'
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
                    <Box maxWidth='sm' sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>

                        <Typography width={100} align='right'>Mavi Yaka</Typography>

                        <TextField
                            placeholder='0'
                            size='small'
                            name='mavi'
                            id='mavi'
                            variant='outlined'
                            label='Miktar'
                            type='number'
                            value={data.mavi}
                            onChange={handleDataChange}
                        />

                    </Box>
                    <Box maxWidth='sm' sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>

                        <Typography width={100} align='right'>Beyaz Yaka</Typography>

                        <TextField
                            placeholder='0'
                            size='small'
                            name='beyaz'
                            id='beyaz'
                            variant='outlined'
                            label='Miktar'
                            type='number'
                            value={data.beyaz}
                            onChange={handleDataChange}
                        />

                    </Box>

                    <Button sx={{ width: 150, height: 45, textTransform: 'none' }} size='small' variant='contained' type='submit'>Güncelle</Button>

                </Container>


                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 3,
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }}>
                    <Grid width={150} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, backgroundColor: '#bebe', p: 1, borderRadius: 3 }}>
                        <Typography align='left'>Çayırova :</Typography>
                        <Typography>{localeStorageInfo.cayirova || 0}</Typography>
                    </Grid>
                    <Grid width={150} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, backgroundColor: '#bebe', p: 1, borderRadius: 3 }}>
                        <Typography align='left'>Pazaryeri :</Typography>
                        <Typography>{localeStorageInfo.pazaryeri || 0}</Typography>
                    </Grid>
                    <Grid width={150} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, backgroundColor: '#bebe', p: 1, borderRadius: 3 }}>
                        <Typography align='left'>Pendik :</Typography>
                        <Typography>{localeStorageInfo.pendik || 0}</Typography>
                    </Grid>
                    <Grid width={150} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, backgroundColor: '#bebe', p: 1, borderRadius: 3 }}>
                        <Typography align='left'>Beyaz Yaka :</Typography>
                        <Typography>{localeStorageInfo.beyaz || 0}</Typography>
                    </Grid>
                    <Grid width={150} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, backgroundColor: '#bebe', p: 1, borderRadius: 3 }}>
                        <Typography align='left'>Mavi Yaka :</Typography>
                        <Typography>{localeStorageInfo.mavi || 0}</Typography>
                    </Grid>
                </Box>

            </Container>

            <ActivityData_Table
                activityData={activityData}
                settingData={settingData}
                setInfo={setInfo}
                delHandleOpen={delHandleOpen}
                handleOpen={handleOpen}
            />

            <NewActivity
                info={info}
                setInfo={setInfo}
                open={open}
                handleClose={handleClose}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                handleSubmit={handleSubmit}
                handleIsCheck={handleIsCheck}
            />

            <DeleteModals delOpen={delOpen} delHandleClose={delHandleClose} info={info} />

        </div>
    )
}

export default Settings