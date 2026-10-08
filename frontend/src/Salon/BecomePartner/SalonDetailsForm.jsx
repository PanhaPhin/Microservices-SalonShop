import React, { useState } from 'react'
import {
  TextField,
  InputAdornment,
  MenuItem,
  CircularProgress,
  Box,
  IconButton,
} from '@mui/material'
import { Storefront, Category, AddPhotoAlternate, Close } from '@mui/icons-material'
import { inputSx } from './formStyles'

const CATEGORIES = ['Hair & Styling', 'Spa & Massage', 'Nails', 'Skincare', 'Makeup', 'Barbershop']

const MAX_FILE_SIZE_MB = 3

// Converts a File to a base64 data URL string
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })


export default function SalonDetailsForm({ values, errors, onChange, formik }) {
  const [uploadImage, setUploadImage] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const images = formik.values.salonDetails.images ?? []

  const handleImageChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setUploadError('')

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file.')
      event.target.value = ''
      return
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setUploadError(`Image must be under ${MAX_FILE_SIZE_MB}MB.`)
      event.target.value = ''
      return
    }

    setUploadImage(true)
    try {
      const base64 = await fileToBase64(file)
      formik.setFieldValue('salonDetails.images', [
        ...images,
        { name: file.name, data: base64 },
      ])
    } catch (err) {
      console.error('Image read failed:', err)
      setUploadError('Could not read that image. Try another file.')
    } finally {
      setUploadImage(false)
      event.target.value = '' // allow re-selecting the same file later
    }
  }

  const handleRemoveImage = (index) => {
    const updatedImages = [...images]
    updatedImages.splice(index, 1)
    formik.setFieldValue('salonDetails.images', updatedImages)
  }

  return (
    <div className="flex flex-col gap-4">
      <TextField
        label="Salon name"
        fullWidth
        sx={inputSx}
        value={values.salonName}
        onChange={onChange('salonName')}
        error={!!errors.salonName}
        helperText={errors.salonName}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Storefront fontSize="small" sx={{ color: '#9A9483' }} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        select
        label="Category"
        fullWidth
        sx={inputSx}
        value={values.category}
        onChange={onChange('category')}
        error={!!errors.category}
        helperText={errors.category}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Category fontSize="small" sx={{ color: '#9A9483' }} />
            </InputAdornment>
          ),
        }}
      >
        {CATEGORIES.map((c) => (
          <MenuItem key={c} value={c}>
            {c}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Description"
        fullWidth
        multiline
        minRows={3}
        sx={inputSx}
        value={values.description}
        onChange={onChange('description')}
        error={!!errors.description}
        helperText={errors.description || 'A line or two about what your salon offers'}
      />

      <Box>
        <label htmlFor="salon-image-upload">
          <input
            id="salon-image-upload"
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              color: '#9A9483',
            }}
            component="span"
          >
            {uploadImage ? (
              <CircularProgress size={18} />
            ) : (
              <AddPhotoAlternate fontSize="small" />
            )}
            <span>{uploadImage ? 'Uploading...' : 'Add photo'}</span>
          </Box>
        </label>

        {uploadError && (
          <Box sx={{ color: 'error.main', fontSize: 12, mt: 0.5 }}>{uploadError}</Box>
        )}

        {images.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.5 }}>
            {images.map((img, index) => (
              <Box key={index} sx={{ position: 'relative', width: 64, height: 64 }}>
                <Box
                  component="img"
                  src={img.data}
                  alt={img.name || `salon-image-${index}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 1,
                    border: '1px solid #E5E1D6',
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveImage(index)}
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    bgcolor: 'background.paper',
                    border: '1px solid #E5E1D6',
                    p: 0.25,
                    '&:hover': { bgcolor: 'background.paper' },
                  }}
                >
                  <Close sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </div>
  )
}