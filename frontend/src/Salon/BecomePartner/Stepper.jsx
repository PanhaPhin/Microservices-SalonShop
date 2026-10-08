import React from 'react'
import { Typography } from '@mui/material'
import { Check } from '@mui/icons-material'
import { FOREST } from './formStyles'

export default function Stepper({ steps, current }) {
  return (
    <div className="flex items-center mb-10">
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center" style={{ width: 90 }}>
              <div
                className="flex items-center justify-center rounded-full text-xs font-semibold"
                style={{
                  width: 28,
                  height: 28,
                  backgroundColor: done || active ? FOREST : '#E7E4DB',
                  color: done || active ? '#F5F2EA' : '#9A9483',
                }}
              >
                {done ? <Check sx={{ fontSize: 16 }} /> : i + 1}
              </div>
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  mt: 0.75,
                  color: done || active ? FOREST : '#9A9483',
                  fontWeight: active ? 600 : 400,
                  textAlign: 'center',
                }}
              >
                {label}
              </Typography>
            </div>
            {i < steps.length - 1 && (
              <div
                className="flex-1 mb-4"
                style={{ height: 2, backgroundColor: i < current ? FOREST : '#E7E4DB' }}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}