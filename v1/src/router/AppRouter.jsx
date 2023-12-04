import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from '../pages/Home'
import { NotFound } from '../pages/NotFound'
import NavBar from '../components/NavBar'
import PrivateRouter from './PrivateRoute'
import Login from '../pages/Login'
import EtkinlikDetail from '../pages/EtkinlikDetail'
import Raffle from '../pages/Raffle'
import UserApplications from '../pages/UserApplications'
import UserWinners from '../pages/UserWinners'



export const AppRouter = () => {


  return (

    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path='/:id' element={<EtkinlikDetail />} />
          <Route element={<PrivateRouter />}>
            <Route path='/userapplications' element={<UserApplications/>} />
            <Route path='/raffle' element={<Raffle/>}/>
            <Route path='/userwinners' element={<UserWinners/>}/>
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}
