import React, { useEffect } from 'react'
import ReviewCard from './ReviewCard'
import { Divider } from '@mui/material'
import RatingCard from './RatingCard'
import { useDispatch, useSelector } from 'react-redux'
import { deleteReview, fetchReviews } from '../../Redux/Review/action'
import { useParams } from 'react-router-dom'

const Review = () => {
  const dispatch = useDispatch()
  const { review } = useSelector((store) => store)
  const { id } = useParams()

  useEffect(() => {
    dispatch(
      fetchReviews({
        salonId: id,
        jwt: localStorage.getItem('jwt'),
      })
    )
  }, [id])

  return (
    <div className='pt-10'>
      <div className='pb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>
          Customer Reviews
        </h1>
        <p className='text-gray-500 mt-1'>
          See what customers say about this salon
        </p>
      </div>

      <div className='flex flex-col lg:flex-row gap-8'>
        <section className='w-full lg:w-[35%]'>
          <div className='sticky top-24'>
            <RatingCard />
          </div>
        </section>

        <section className='w-full lg:w-[65%]'>
          <div className='bg-white border rounded-2xl p-5 shadow-sm'>
            <div className='flex items-center justify-between pb-5'>
              <h2 className='font-semibold text-lg'>All Reviews</h2>
              <p className='text-sm text-gray-500'>
                {review.reviews?.length || 0} Reviews
              </p>
            </div>

            {review.loading && (
              <p className='text-gray-400'>Loading reviews...</p>
            )}

            {review.error && (
              <p className='text-red-500'>
                {typeof review.error === 'string'
                  ? review.error
                  : 'Failed to load reviews'}
              </p>
            )}

            <div className='space-y-5'>
              {review.reviews && review.reviews.length > 0 ? (
                review.reviews.map((item, index) => (
                  <div key={item.id ?? index} className='space-y-4'>

                    <ReviewCard
                      item={item}
                      onDelete={(id) => {
                        dispatch(
                          deleteReview({
                            reviewId: id,
                            jwt: localStorage.getItem("jwt"),
                          })
                        );
                      }}
                    />

                    {index !== review.reviews.length - 1 && <Divider />}

                  </div>
                ))
              ) : (
                !review.loading && (
                  <p className='text-gray-400'>No reviews yet.</p>
                )
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Review