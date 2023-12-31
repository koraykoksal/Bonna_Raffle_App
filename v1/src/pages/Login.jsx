import React from 'react'
import Avatar from "@mui/material/Avatar"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import LockIcon from "@mui/icons-material/Lock"
import { Link, Outlet, useNavigate } from "react-router-dom"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { Formik, Form } from "formik"
import { object, string } from "yup"
import useAuthCall from '../hooks/useAuthCall'
import { useState } from 'react'
import { IoHome } from "react-icons/io5";


const Login = () => {

  const navigate = useNavigate()

  const [info, setInfo] = useState({
    email: "",
    password: ""
  })

  const { login } = useAuthCall()

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {

    e.preventDefault()

    login(info)

    setInfo({
      email: "",
      password: ""
    })
  }

  const handleKeyPress = (e) => {

    // e.preventDefault()

    if (e.key === 'Enter') {
      login(info)

      setInfo({
        email: "",
        password: ""
      })
    }
  }


  return (

    <Container maxWidth="lg" >

      <Typography variant='h4' align='center' p={3} fontWeight={700} color='#ae0707'>Bonna Aktivite</Typography>

      <Grid
        container
        justifyContent="center"
        direction="row-reverse"
        sx={{
          height: "100vh",
          p: 2,
        }}
      >



        <Grid item xs={12} sm={10} md={6}>
          <Avatar
            sx={{
              backgroundColor: "secondary.light",
              m: "auto",
              width: 40,
              height: 40,
            }}
          >
            <LockIcon size="30" />

          </Avatar>
          
          {/* <Typography
            variant="h4"
            align="center"
            mb={4}
            color="secondary.light"
          >
            Login
          </Typography> */}

          <form onKeyUp={handleKeyPress}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 ,mt:5}}>

              <TextField
                label="Email"
                name="email"
                id="email"
                type="email"
                variant="outlined"
                value={info.email}
                onChange={handleChange}
                
              />
              <TextField
                label="Password"
                name="password"
                id="password"
                type="password"
                variant="outlined"
                value={info.password}
                onChange={handleChange}
              />
              <Button variant="contained" type="button" onClick={handleSubmit} sx={{letterSpacing:3,textTransform:'none'}}>
                Giriş
              </Button>

            </Box>
          </form>

          <Box sx={{mt: 5,display:'flex',flexDirection:'column'}}>
            <IoHome size={30} color='green' style={{margin:'auto'}} onClick={()=>navigate('/')} cursor={'pointer'}/>
            {/* <Link to="/" style={{color:'green',textDecoration:'underline',letterSpacing:5,textAlign:'center'}}>Ana Sayfa</Link>              */}
          </Box>

        </Grid>


      </Grid>


    </Container>

  )
}

export default Login