import React from 'react'
import SellerAccountForm from './SellerAccountForm'
import { Button, Divider, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const FOREST = '#14342B'
const TEAL = '#0F9B8E'

const stats = [
  { value: '12k+', label: 'Salons onboard' },
  { value: '48', label: 'Cities covered' },
  { value: '2.1M', label: 'Bookings made' },
]

const BecomePartner = () => {
  const navigate = useNavigate()

  return (
    <div className="grid md:grid-cols-2 min-h-screen bg-white">
      {/* Form panel */}
      <section className="col-span-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <SellerAccountForm />

          <Divider sx={{ my: 4, borderColor: '#E4E1D8' }} />

          <div className="text-center">
            <Typography variant="body2" sx={{ color: '#6B6558', mb: 1.5 }}>
              Already have an account?
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/login')}
              sx={{
                textTransform: 'none',
                borderRadius: '10px',
                borderColor: TEAL,
                color: TEAL,
                py: 1,
                '&:hover': { borderColor: TEAL, backgroundColor: 'rgba(15, 155, 142, 0.06)' },
              }}
            >
              Login
            </Button>
          </div>
        </div>
      </section>

      {/* Promo panel */}
      <section
        className="col-span-1 hidden md:flex flex-col items-center justify-center relative overflow-hidden p-16"
        style={{ backgroundColor: '#FAF8F4' }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: 420,
            height: 420,
            top: -140,
            right: -140,
            background: `radial-gradient(circle, ${TEAL}14 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 320,
            height: 320,
            bottom: -120,
            left: -100,
            background: `radial-gradient(circle, ${FOREST}10 0%, transparent 70%)`,
          }}
        />

        <div className="relative text-center max-w-sm">
          <Typography
            sx={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              color: FOREST,
              fontWeight: 700,
              fontSize: '1.9rem',
              lineHeight: 1.25,
            }}
          >
            Join the Marketplace Revolution
          </Typography>
          <Typography sx={{ color: TEAL, fontWeight: 600, mt: 1, fontSize: '1.05rem' }}>
            Boost Your Sales Today
          </Typography>

          <div className="flex justify-center gap-8 mt-12">
            {stats.map((s) => (
              <div key={s.label}>
                <Typography sx={{ color: FOREST, fontWeight: 700, fontSize: '1.25rem' }}>
                  {s.value}
                </Typography>
                <Typography sx={{ color: '#8C8676', fontSize: '0.75rem', mt: 0.25 }}>
                  {s.label}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default BecomePartner