import { Box, Button, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
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

    const dispatch = useDispatch()

    const [info, setInfo] = useState({
        activityName: "",
        activityDate: "",
        fileName: "",
        members: "",
        publish: false
    })

    const [data, setData] = useState({
        lokasyon: "",
        miktar: ""
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



    return (
        <div>


            <Container sx={{ py: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>

                <Button sx={{ textTransform: 'none', width: 100 }} variant='contained' onClick={handleOpen}>Yeni</Button>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>

                    <Typography variant='subtitle2' align='center'>Max Katılımcı Sayısı (Bir lokasyon için geçerlidir.)</Typography>

                    <Container maxWidth='sm' sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }} component={'form'} onSubmit={(e) => {
                        e.preventDefault()
                        dispatch(fetchLokasyonSetting(data))
                    }}>
                        <FormControl sx={{ width: '200px' }}>
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
                        </FormControl>
                        <TextField
                            required
                            name='miktar'
                            id='miktar'
                            variant='outlined'
                            label='Miktar'
                            type='number'
                            value={data.miktar}
                            onChange={handleDataChange}
                        />
                        <Button variant='outlined' type='submit'>Güncelle</Button>
                    </Container>

                    {
                        lokasyonData.lokasyon && lokasyonData.miktar ?
                            (
                                <Typography color={'red'} variant='subtitle2' align='center'>
                                    Girilen Data :  {lokasyonData.lokasyon} : {lokasyonData.miktar}
                                </Typography>
                            )
                            :
                            ""


                    }

                </Box>
            </Container>

            <ActivityData_Table activityData={activityData} setInfo={setInfo} delHandleOpen={delHandleOpen} handleOpen={handleOpen} />

            <NewActivity info={info} setInfo={setInfo} open={open} handleClose={handleClose} handleChange={handleChange} handleFileChange={handleFileChange} handleSubmit={handleSubmit} handleIsCheck={handleIsCheck} />

            <DeleteModals delOpen={delOpen} delHandleClose={delHandleClose} info={info} />

        </div>
    )
}

export default Settings