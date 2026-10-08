import React, { useState } from 'react'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import {
  Person,
  Email,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import { inputSx } from './formStyles'


export default function OwnerDetailsForm({ values, errors, onChange }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <TextField
        label="Full name"
        fullWidth
        sx={inputSx}
        value={values.ownerName}
        onChange={onChange('ownerName')}
        error={!!errors.ownerName}
        helperText={errors.ownerName}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person fontSize="small" sx={{ color: '#9A9483' }} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Email"
        type="email"
        fullWidth
        sx={inputSx}
        value={values.email}
        onChange={onChange('email')}
        error={!!errors.email}
        helperText={errors.email}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email fontSize="small" sx={{ color: '#9A9483' }} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Mobile"
        fullWidth
        placeholder="012345678"
        sx={inputSx}
        value={values.phone}
        onChange={onChange('phone')}
        error={!!errors.phone}
        helperText={errors.phone || 'Cambodian number, starting with 0'}
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

      {/* <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          sx={inputSx}
          value={values.password}
          onChange={onChange('password')}
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlined fontSize="small" sx={{ color: '#9A9483' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" size="small">
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Confirm password"
          type={showConfirm ? 'text' : 'password'}
          fullWidth
          sx={inputSx}
          value={values.confirmPassword}
          onChange={onChange('confirmPassword')}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirm((v) => !v)} edge="end" size="small">
                  {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div> */}
    </div>
  )
}