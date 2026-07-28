import { Box, Button, InputLabel, Rating, TextField } from '@mui/material'
import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { createReview } from '../../Redux/Review/action'

const CreateReviewForm = () => {
  const dispatch = useDispatch()
  const { review } = useSelector((store) => store)
  const { id } = useParams()

  const formik = useFormik({
    initialValues: {
      reviewText: '',
      rating: 3,
    },

    validationSchema: Yup.object({
      reviewText: Yup.string()
        .min(10, 'Review must be at least 10 characters')
        .required('Review is required'),

      rating: Yup.number()
        .min(1, 'Rating is required')
        .required('Rating is required'),
    }),

    onSubmit: (values, { resetForm }) => {
      dispatch(
  createReview({
    salonId: id,
    reviewData: {
      reviewText: values.reviewText,
      rating: values.rating,
    },
    jwt: localStorage.getItem("jwt"),
  })
)
      resetForm()
    },
  })

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ mt: 3 }}
      className='space-y-5 w-full lg:w-1/2 border rounded-2xl p-6 shadow-sm bg-white'
    >
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Write a Review</h1>
        <p className='text-sm text-gray-500 mt-1'>
          Share your experience with other customers
        </p>
      </div>

      <TextField
        fullWidth
        id="reviewText"
        name="reviewText"
        multiline
        rows={4}
        placeholder='Tell us about your experience...'
        value={formik.values.reviewText}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.reviewText && Boolean(formik.errors.reviewText)}
        helperText={formik.touched.reviewText && formik.errors.reviewText}
      />

      <div className='space-y-2'>
        <InputLabel>Rating</InputLabel>

        <div className='flex items-center gap-3'>
          <Rating
            name="rating"
            value={formik.values.rating}
            precision={0.5}
            onChange={(event, newValue) => {
              formik.setFieldValue('rating', newValue)
            }}
          />
          <span className='text-sm text-gray-500'>
            {formik.values.rating} Star
          </span>
        </div>

        {formik.touched.rating && formik.errors.rating && (
          <p className='text-sm text-red-500'>{formik.errors.rating}</p>
        )}
      </div>

      <Button
        type="submit"
        fullWidth
        variant='contained'
        size='large'
        disabled={review.loading}
        sx={{
          py: 1.3,
          borderRadius: "12px",
          textTransform: "none",
          fontSize: "16px",
          fontWeight: 600,
        }}
      >
        {review.loading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </Box>
  )
}

export default CreateReviewForm