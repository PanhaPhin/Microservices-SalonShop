import { Box, LinearProgress, Rating } from '@mui/material'
import Grid from '@mui/material/Grid'
import React from 'react'

const RatingCard = () => {
  const ratingData = [
    { label: "Excellent", value: 80, total: "743K", color: "success" },
    { label: "Very Good", value: 60, total: "543K", color: "success" },
    { label: "Good", value: 40, total: "243K", color: "warning" },
    { label: "Average", value: 20, total: "143K", color: "error" },
  ]

  return (
    <div className='border rounded-2xl p-6 shadow-sm bg-white'>
      <div className='text-center border-b pb-6'>
        <h1 className='text-5xl font-bold text-gray-900'>4.5</h1>

        <div className='flex justify-center py-3'>
          <Rating readOnly value={4.5} precision={0.5} />
        </div>

        <p className='text-gray-500 text-sm'>Based on 32,424 reviews</p>
      </div>

      <Box className='space-y-6 pt-6'>
        {ratingData.map((item, index) => (
          <Grid
            key={index}
            container
            spacing={2}
            sx={{ alignItems: "center" }}
          >
            <Grid size={3}>
              <p className='text-sm font-medium text-gray-700'>
                {item.label}
              </p>
            </Grid>

            <Grid size={7}>
              <LinearProgress
                variant='determinate'
                value={item.value}
                sx={{
                  height: 8,
                  borderRadius: 5,
                  backgroundColor: "#e5e7eb",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 5,
                    backgroundColor:
                      item.color === "success"
                        ? "#22c55e"
                        : item.color === "warning"
                        ? "#f59e0b"
                        : "#ef4444",
                  },
                }}
              />
            </Grid>

            <Grid size={2}>
              <p className='text-sm text-gray-500 text-right'>
                {item.total}
              </p>
            </Grid>
          </Grid>
        ))}
      </Box>
    </div>
  )
}

export default RatingCard