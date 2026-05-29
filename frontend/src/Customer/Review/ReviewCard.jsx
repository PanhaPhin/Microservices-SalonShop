import React from 'react'
import Grid from '@mui/material/Grid'
import { Box, Avatar, Rating, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { red } from '@mui/material/colors'

const ReviewCard = () => {
    return (
        <div className='flex justify-between'>


            <Grid container spacing={2} alignItems="center">

                
                <Grid item xs={12} md={2}>
                    <Box className='flex justify-center md:justify-start'>
                        <Avatar sx={{ width: 56, height: 56, bgcolor: "#9155FD" }}>
                            A
                        </Avatar>
                    </Box>
                </Grid>

                
                <Grid item xs={12} md={10}>
                    <div>
                        <h1 className='font-semibold text-lg'>Alex</h1>
                        <p className='text-sm text-gray-500'>
                            Good service and friendly staff.
                        </p>
                    </div>

                    <div className='mt-1'>
                        <Rating
                            name="half-rating"
                            value={4.5}
                            precision={0.5}
                            readOnly
                        />
                    </div>

                    <p>this salon is provide great service</p>
                </Grid>
            </Grid>

            <div className="flex justify-end mt-2">
                <IconButton>
                    <DeleteIcon sx={{ color: red[700] }} />
                </IconButton>
            </div>

        </div>
    )
}

export default ReviewCard