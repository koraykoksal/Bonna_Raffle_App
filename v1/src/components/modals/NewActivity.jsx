import React from 'react'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container, IconButton, TextField, TextareaAutosize } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import { IoIosCloseCircle } from "react-icons/io";
import { useState } from 'react';

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



const NewActivity = ({ info, setInfo, open, handleClose, handleChange,handleFileChange, handleSubmit }) => {


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


                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5, mt: 5 }} component={'form'}>


                        <TextField
                            required
                            fullWidth
                            label="Etkinlik Adı"
                            name="activityName"
                            id="activityName"
                            type="text"
                            variant="outlined"
                            inputProps={{ maxLength: 11 }}
                            // value={info.activityName}
                            onChange={handleChange}
                        />

                        <TextField
                            required
                            fullWidth
                            // label="Tarih"
                            name="activityDate"
                            id="activityDate"
                            type="date"
                            variant="outlined"
                            inputProps={{ maxLength: 30 }}
                            // value={info.activityDate}
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
                            inputProps={{ maxLength: 30 }}
                            // value={info.members}
                            onChange={handleChange}
                        />

                        <TextField
                            required
                            fullWidth
                            name="activityImage"
                            id="activityImage"
                            type="file"
                            variant="outlined"
                            inputProps={{ maxLength: 30 }}
                            // value={info.activityImage}
                            onChange={handleFileChange}
                        />

                        <Button variant='contained' onSubmit={handleSubmit}>Kaydet</Button>

                    </Box>


                </Box>
            </Modal>

        </div>
    )
}

export default NewActivity