import React from 'react'
import useRaffleCall from '../hooks/useRaffleCall'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import UserWinners_Table from '../components/tables/UserWinners_Table'
import { Box, Table, TableCell, TableRow, Typography } from '@mui/material'
import { GiPodiumWinner } from "react-icons/gi";
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';


const UserWinners = () => {

  const { get_userWinners } = useRaffleCall()
  const { userWinners } = useSelector((state) => state.raffle)
  const [winnersData, setWinnersData] = useState([])

  let extractedData = [];

  useEffect(() => {
    get_userWinners('bonna-activity-winners')
  }, [])

  useEffect(() => {

    const data = Object.keys(userWinners).map(key => { return { id: key, ...userWinners[key] } })

    data.forEach(item => {
      Object.values(item).forEach(person => {
        if (typeof person === 'object' && person !== null) {
          extractedData.push({
            id: person.id,
            name: person.name,
            surname: person.surname,
            phone: person.phone,
            activityDate: person.activityDate,
            department: person.department,
            activityName: person.activityName,
            rowNumber: person.rowNumber,
            status: person.status,
            tesis: person.tesis
          });
        }
      });
    });

    setWinnersData(extractedData)

  }, [userWinners])


  return (

    <div>

      <Box sx={{ display: 'flex', flexDirection: 'columns', justifyContent: 'center', p: 3 }}>
        <GiPodiumWinner size={100} color='#B31312' />
      </Box>

      <Box sx={{ p: 3 }}>
        <UserWinners_Table
          winnersData={winnersData}
        />
      </Box>


    </div>
  )
}

export default UserWinners