import React from 'react'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Checkbox, Container, FormControlLabel, IconButton, TextField, TextareaAutosize, linkClasses } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import { IoIosCloseCircle } from "react-icons/io";
import { useState } from 'react';
import { useSelector } from 'react-redux';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    height: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,

};



const NewActivity = ({ info, setInfo, open, handleClose, handleChange, handleFileChange, handleSubmit,handleIsCheck }) => {

    const { fileUpload_Loading } = useSelector((state) => state.raffle)


    return (
        <div>
            <Modal
                keepMounted
                open={open}
                onClose={() => {
                    handleClose()
                }}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>

                    <IoIosCloseCircle size={28} color='red' cursor={'pointer'} onClick={handleClose} />

                    <Typography variant='subtitle1' align='center' fontWeight={700}>Yeni Etkinlik Kaydı</Typography>


                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5, mt: 5 }} component={'form'} onSubmit={handleSubmit}>


                        <TextField
                            required
                            fullWidth
                            label="Etkinlik Adı"
                            name="activityName"
                            id="activityName"
                            type="text"
                            variant="outlined"
                            inputProps={{ maxLength: 50 }}
                            value={info.activityName}
                            onChange={handleChange}
                        />

                        <TextField
                            required
                            fullWidth
                            // label="Tarih"
                            name="activityDate"
                            id="activityDate"
                            type="datetime-local"
                            variant="outlined"
                            inputProps={{ maxLength: 50 }}
                            value={info.activityDate}
                            onChange={handleChange}
                        />


                        <TextField
                            required
                            fullWidth
                            label="Katılımcı Sayısı"
                            name="members"
                            id="members"
                            type="number"
                            variant="outlined"
                            inputProps={{ maxLength: 50 }}
                            value={info.members}
                            onChange={handleChange}
                        />

                        <FormControlLabel
                            name='publish'
                            id='publish'
                            control={
                                <Checkbox name="gilad" checked={info.publish}  onChange={(e) => handleIsCheck(e)} />
                            }
                            label={
                                <Typography
                                    variant='inherit'
                                >
                                    Yayına Al
                                </Typography>}

                        />

                        <TextField
                            fullWidth
                            name="activityImage"
                            id="activityImage"
                            type="file"
                            variant="outlined"
                            // value={info.activityImage}
                            onChange={handleFileChange}
                            inputProps={{
                                accept: '.png , .jpeg , .jpg' //sadece bu dosya tiplerine izin ver
                            }}
                        />


                        {
                            fileUpload_Loading ?
                                <div className='loader' style={{ margin: 'auto' }}></div>
                                :
                                <Button variant='contained' type='submit'>{info.id ? "Güncelle":"Kayıt"}</Button>
                        }

                    </Box>


                </Box>
            </Modal>

        </div>
    )
}

export default NewActivity