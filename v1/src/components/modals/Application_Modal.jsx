import React from 'react'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container, IconButton, TextField, TextareaAutosize, Tooltip } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Textarea from '@mui/joy/Textarea';
import CloseIcon from '@mui/icons-material/Close';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { bonnaDepartments, tesis } from "../../helper/bonna_departments"
import useRaffleCall from '../../hooks/useRaffleCall';
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 550,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 1

};



const Application_Modal = ({ open, handleClose, info, setInfo, state }) => {

  const now = new Date()
  const navigate = useNavigate()
  const { postFireData, getFireData } = useRaffleCall()

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {

    e.preventDefault()

    postFireData(`bonna-activity`, info)

    handleClose()

  }


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

          <Box sx={{ display: 'flex', flexDirection: 'column-reverse', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 1 }}>

            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1, p: 2, border: `1px solid gray`, borderRadius: 2 }}>
              <Typography variant="subtitle2" component="h2" color="#000000">
                Aktivite : {state.activityName}
              </Typography>
              <Typography variant="subtitle2" component="h2" color="#000000">
                Tarih : {format(state.activityDate, 'dd-MM-yyyy HH:mm')}
              </Typography>
            </Box>

            <Tooltip title="Kapat">
              <IconButton onClick={() => handleClose()}>
                <HighlightOffIcon sx={{ color: '#C70039', fontSize: '28px' }} />
              </IconButton>
            </Tooltip>
          </Box>


          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, overflow: 'scroll', maxHeight: '600px', border: '1px solid gray', borderRadius: 2 }} component='form' onSubmit={handleSubmit}>


            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>

              <TextField
                required
                fullWidth
                label="TC No"
                name="tcNo"
                id="tcNo"
                type="text"
                variant="outlined"
                inputProps={{ maxLength: 11 }}
                value={info.tcNo}
                onChange={handleChange}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>


              <TextField
                required
                fullWidth
                label="İsim"
                name="name"
                id="name"
                type="text"
                variant="outlined"
                inputProps={{ maxLength: 30 }}
                value={info.name}
                onChange={handleChange}
              />


              <TextField
                required
                fullWidth
                label="Soyisim"
                name="surname"
                id="surname"
                type="text"
                variant="outlined"
                inputProps={{ maxLength: 30 }}
                value={info.surname}
                onChange={handleChange}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>


              <TextField
                required
                fullWidth
                label="Telefon"
                name="phone"
                id="phone"
                type="text"
                variant="outlined"
                inputProps={{ maxLength: 12 }}
                value={info.phone}
                onChange={handleChange}
              />


              <FormControl fullWidth>
                <InputLabel id="department">Departman</InputLabel>
                <Select
                  required
                  labelId="department"
                  id="department"
                  name='department'
                  label="Departman"
                  value={info.department}
                  onChange={handleChange}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 200, // Açılır menünün maksimum yüksekliği (px cinsinden)
                      },
                    },
                  }}
                >
                  {
                    bonnaDepartments.map((item, index) => (
                      <MenuItem
                        key={index}
                        value={item.name}
                        sx={{
                          fontSize:14
                        }}
                      >
                        {item.name}
                      </MenuItem>
                    ))
                  }

                </Select>
              </FormControl>
            </Box>


            <FormControl fullWidth>
              <InputLabel id="tesis">Tesis</InputLabel>
              <Select
                required
                labelId="tesis"
                id="tesis"
                name='tesis'
                label="tesis"
                value={info.tesis}
                onChange={handleChange}
              >
                {
                  tesis.map((item, index) => (
                    <MenuItem key={index} value={item}>{item}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>


            <Button
              sx={{ mt: 3, textTransform: 'none', letterSpacing: 5 }}
              variant='contained'
              fullWidth
              type='submit'
              color='success'
            >
              Kayıt
            </Button>


          </Box>


        </Box>
      </Modal>



    </div>
  )
}

export default Application_Modal