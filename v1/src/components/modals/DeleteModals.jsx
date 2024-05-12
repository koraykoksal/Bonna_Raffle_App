import React from 'react'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, Typography } from '@mui/material';
import useRaffleCall from '../../hooks/useRaffleCall';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 525,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,

};



const DeleteModals = ({ delOpen, delHandleClose, info }) => {


    const { removeFirebaseData, getFireData, getActivityData } = useRaffleCall()

    const handleSubmit = (e) => {
        e.preventDefault()

        if (info.type == "user-application") {
            removeFirebaseData('bonna-activity', info.id)
            getFireData('bonna-activity')
        }
        else if (info.type == "activitydata") {
            removeFirebaseData('images', info.id)
            getActivityData('images')
        }

        delHandleClose()
    }




    return (


        <div>

            <Modal
                keepMounted
                open={delOpen}
                onClose={delHandleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>

                        <Typography align='center' variant='h5'>Kayıt Silinecek Emin Misiniz ?</Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', gap: 3 }}>

                            <Button variant='contained' color='success' onClick={handleSubmit}>Evet</Button>

                            <Button variant='outlined' color='error' onClick={delHandleClose}>Hayır</Button>
                        </Box>
                    </Box>



                </Box>
            </Modal>
        </div>

    )
}

export default DeleteModals