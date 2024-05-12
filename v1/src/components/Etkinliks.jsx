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


const Etkinliks = ({ activityData }) => {

    const navigate = useNavigate()

    // aktivite datasına sort işlemi yap
    function dateCheck() {
        const sortData = [...activityData]
         return sortData.sort((a, b) => new Date(b.activityDate) - new Date(a.activityDate));

    }


    dateCheck()

    return (

        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10 }}>

                {
                    dateCheck(activityData).map((item, index) => (

                        <Card key={index} sx={{ maxWidth: 350, backgroundColor: 'transparent', boxShadow: 0 }}>
                            <CardContent>
                                <Typography variant='h6'>{item?.activityName}</Typography>
                                <Typography>{item?.activityDate}</Typography>
                            </CardContent>
                            <CardMedia
                                component="img"
                                height="350"
                                loading='lazy'
                                image={item?.imgUrl}
                            />
                            <CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'space-between' }}>

                                {
                                    item?.publish &&
                                    <Button variant='contained' onClick={() => navigate(`/${item.id}`, { state: item })} sx={{ letterSpacing: 3 }}>Detay</Button>
                                }

                                <Typography variant='h6' fontWeight={700}>{item?.publish ? "Aktif" : "Pasif"}</Typography>

                            </CardActions>


                        </Card>

                    ))
                }


            </Box>

        </>

    )
}

export default Etkinliks