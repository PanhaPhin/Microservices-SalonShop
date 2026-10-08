import React from 'react'
import { TextField, InputAdornment } from '@mui/material'
import { LocationOnOutlined } from '@mui/icons-material'
import { inputSx } from './formStyles'

export default function SalonAddressForm({ values, errors, onChange }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Mobile"
          fullWidth
          placeholder="012345678"
          sx={inputSx}
          value={values.salonMobile}
          onChange={onChange('salonMobile')}
          error={!!errors.salonMobile}
          helperText={errors.salonMobile}
          inputProps={{ maxLength: 10 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>🇰🇭</span>
                <span
                  style={{
                    color: '#4A473E',
                    fontSize: '0.9rem',
                    marginLeft: 6,
                    paddingRight: 8,
                    borderRight: '1px solid #DEDAD0',
                  }}
                >
                  +855
                </span>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Pincode"
          fullWidth
          sx={inputSx}
          value={values.pincode}
          onChange={onChange('pincode')}
          error={!!errors.pincode}
          helperText={errors.pincode}
          inputProps={{ maxLength: 6 }}
        />
      </div>

      <TextField
        label="Address (House No, Building, Street)"
        fullWidth
        sx={inputSx}
        value={values.address}
        onChange={onChange('address')}
        error={!!errors.address}
        helperText={errors.address}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnOutlined fontSize="small" sx={{ color: '#9A9483' }} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="City"
        fullWidth
        sx={inputSx}
        value={values.city}
        onChange={onChange('city')}
        error={!!errors.city}
        helperText={errors.city}
      />

      <TextField
        label="Email"
        type="email"
        fullWidth
        sx={inputSx}
        value={values.salonEmail}
        onChange={onChange('salonEmail')}
        error={!!errors.salonEmail}
        helperText={errors.salonEmail}
      />
    </div>
  )
}