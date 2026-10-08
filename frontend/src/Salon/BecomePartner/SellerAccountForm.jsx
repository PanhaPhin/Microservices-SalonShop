import React, { useState } from 'react'
import { Button, CircularProgress, Typography } from '@mui/material'

import Stepper from './Stepper'
import OwnerDetailsForm from './OwnerDetailsForm'
import SalonDetailsForm from './SalonDetailsForm'
import SalonAddressForm from './SalonAddressForm'
import { TEAL } from './formStyles.js'

const STEPS = ['Owner Details', 'Salon Details', 'Salon Address']

const initialState = {
  ownerName: '',
  email: '',
  phone: '',

  salonDetails: {
    salonName: '',
    category: '',
    description: '',
    images: [],
  },

  salonMobile: '',
  pincode: '',
  address: '',
  city: '',
  salonEmail: '',
}

export default function SellerAccountForm() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  const handleSalonChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      salonDetails: {
        ...prev.salonDetails,
        [field]: e.target.value,
      },
    }))
  }

  const formikAdapter = {
    values: form,

    setFieldValue: (path, value) => {
      const [parent, child] = path.split('.')

      setForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    },
  }

  const validateStep = () => {
    const next = {}

    if (step === 0) {
      if (!form.ownerName.trim()) {
        next.ownerName = 'Enter your full name'
      }

      if (!/^\S+@\S+\.\S+$/.test(form.email)) {
        next.email = 'Enter a valid email'
      }

      if (!/^0\d{8,9}$/.test(form.phone)) {
        next.phone = 'Enter a valid Cambodian mobile number'
      }
    }

    if (step === 1) {
      if (!form.salonDetails.salonName.trim()) {
        next.salonName = 'Enter your salon name'
      }

      if (!form.salonDetails.category) {
        next.category = 'Choose a category'
      }

      if (!form.salonDetails.description.trim()) {
        next.description = 'Add a short description'
      }
    }

    if (step === 2) {
      if (!/^0\d{8,9}$/.test(form.salonMobile)) {
        next.salonMobile = 'Enter a valid Cambodian mobile number'
      }

      if (!/^\d{6}$/.test(form.pincode)) {
        next.pincode = 'Enter a valid 6-digit pincode'
      }

      if (!form.address.trim()) {
        next.address = 'Enter the salon address'
      }

      if (!form.city.trim()) {
        next.city = 'Enter your city'
      }

      if (!/^\S+@\S+\.\S+$/.test(form.salonEmail)) {
        next.salonEmail = 'Enter a valid email'
      }
    }

    setErrors(next)

    return Object.keys(next).length === 0
  }

  const handleNext = () => {
    if (!validateStep()) return

    setStep((current) => current + 1)
    setErrors({})
  }

  const handleBack = () => {
    setStep((current) => Math.max(current - 1, 0))
    setErrors({})
  }

  const handleSubmit = async () => {
    if (!validateStep()) return

    setSubmitting(true)
    setSubmitError('')
    setSuccessMessage('')

    try {
      // ==========================================
      // 1. Get current customer JWT
      // ==========================================
      const jwt = localStorage.getItem('jwt')

      if (!jwt) {
        throw new Error('Please login first.')
      }

      // 1. Change CUSTOMER → SALON_OWNER
      const roleResponse = await fetch(
        '/api/users/me/become-salon-owner',
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )

      const roleData = await roleResponse.json().catch(() => null)

      if (!roleResponse.ok) {
        throw new Error(
          typeof roleData === 'string'
            ? roleData
            : roleData?.message || 'Failed to become salon owner.'
        )
      }

      localStorage.setItem('role', 'SALON_OWNER')

      // 2. Create salon
      const salonPayload = {
        name: form.salonDetails.salonName,
        description: form.salonDetails.description,
        image: form.salonDetails.images.map((img) => img.data),
        address: form.address,
        phoneNumber: form.salonMobile,
        email: form.salonEmail,
        city: form.city,
        pincode: form.pincode,
        openTime: '08:00:00',
        closeTime: '20:00:00',
      }

      const salonResponse = await fetch('/api/salons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(salonPayload),
      })

      const salonData = await salonResponse.json().catch(() => null)

      if (!salonResponse.ok) {
        throw new Error(
          typeof salonData === 'string'
            ? salonData
            : salonData?.message || 'Salon creation failed.'
        )
      }

      setSuccessMessage(
        'Successfully became a salon owner and created your salon!'
      )

      console.log('Salon created:', salonData)

    } catch (error) {
      console.error('Become Salon Owner Error:', error)

      setSubmitError(
        error.message ||
        'Something went wrong. Please try again.'
      )

    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <Stepper
        steps={STEPS}
        current={step}
      />

      {/* ==========================================
          STEP 1 - OWNER DETAILS
          ========================================== */}
      {step === 0 && (
        <OwnerDetailsForm
          values={form}
          errors={errors}
          onChange={handleChange}
        />
      )}

      {/* ==========================================
          STEP 2 - SALON DETAILS
          ========================================== */}
      {step === 1 && (
        <SalonDetailsForm
          values={form.salonDetails}
          errors={errors}
          onChange={handleSalonChange}
          formik={formikAdapter}
        />
      )}

      {/* ==========================================
          STEP 3 - SALON ADDRESS
          ========================================== */}
      {step === 2 && (
        <SalonAddressForm
          values={form}
          errors={errors}
          onChange={handleChange}
        />
      )}

      {/* ==========================================
          ERROR MESSAGE
          ========================================== */}
      {submitError && (
        <Typography
          sx={{
            color: '#B3261E',
            fontSize: '0.85rem',
            mt: 2,
          }}
        >
          {submitError}
        </Typography>
      )}

      {/* ==========================================
          SUCCESS MESSAGE
          ========================================== */}
      {successMessage && (
        <Typography
          sx={{
            color: '#15803D',
            fontSize: '0.85rem',
            mt: 2,
          }}
        >
          {successMessage}
        </Typography>
      )}

      {/* ==========================================
          BUTTONS
          ========================================== */}
      <div className="flex items-center justify-between mt-8">

        <Button
          onClick={handleBack}
          disabled={step === 0 || submitting}
          variant="outlined"
          sx={{
            borderColor: '#DEDAD0',
            color: '#5F5A50',
            backgroundColor: '#FCFBF9',
            textTransform: 'none',
            borderRadius: '10px',
            px: 3,
            py: 1,
            fontWeight: 500,

            '&:hover': {
              borderColor: '#B8B2A5',
              backgroundColor: '#F5F2EA',
            },

            '&.Mui-disabled': {
              borderColor: '#E8E5DE',
              color: '#B8B3A9',
              backgroundColor: '#FAF9F6',
            },
          }}
        >
          Back
        </Button>

        {step < STEPS.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={submitting}
            sx={{
              backgroundColor: TEAL,
              color: '#fff',
              textTransform: 'none',
              borderRadius: '10px',
              px: 3,
              py: 1,
            }}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            sx={{
              backgroundColor: TEAL,
              color: '#fff',
              textTransform: 'none',
              borderRadius: '10px',
              px: 3,
              py: 1,
            }}
          >
            {submitting ? (
              <CircularProgress
                size={18}
                sx={{ color: '#fff' }}
              />
            ) : (
              'Become Salon Owner'
            )}
          </Button>
        )}
      </div>
    </div>
  )
}