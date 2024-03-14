import React from 'react'
import cokguzelhareketler2 from "../assets/etkinlik/cokguzelhareketler2.png"
import { activityInfo } from '../helper/avtivity_Info';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Button } from '@mui/material';
import Application_Modal from '../components/modals/Application_Modal'
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { uid } from "uid";


const Etkinliks = () => {

    const navigate = useNavigate()


    return (

        <>

            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 4 }}>

                {
                    // etkinlik datasını tarih bilgisine göre sıralama yap
                    // split : '.' dan ayır ve dizi formatına dönüştür ['03','02','2024']
                    // reverse : dizi elemanlarının sırasını tersine çevir
                    // join : '-' işareti ile veriyi 2024-02-03 formatına çevir
                    activityInfo.sort((a, b) => {
                        const dateA = new Date(a.date.split('.').reverse().join('-'))
                        const dateB = new Date(b.date.split('.').reverse().join('-'))
                        return dateB - dateA

                    }).map((item, index) => (

                        <Card key={index} sx={{ maxWidth: 350 }}>
                            <CardContent>
                                <Typography variant='h6'>{item.name}</Typography>
                                <Typography>{item.date}</Typography>
                            </CardContent>
                            <CardMedia
                                component="img"
                                height="350"
                                image={item.image}
                            />
                            <CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'space-between' }}>

                                {
                                    item.status ?
                                        (<Button variant='contained' onClick={() => navigate(`/${item.id}`, { state: item })} sx={{ letterSpacing: 3 }}>Detay</Button>)
                                        :
                                        ("")
                                }

                                {
                                    item.status ?
                                        (<Typography variant='h6' fontWeight={700}>Aktif</Typography>)
                                        :
                                        ("")
                                }

                            </CardActions>


                        </Card>



                    ))
                }



            </Box>

        </>

    )
}

export default Etkinliks