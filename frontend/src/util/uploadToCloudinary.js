

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET

export const uploadCloudinary = async (file) => {
  if (!file) throw new Error('No file provided')
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary env vars are missing (cloud name / upload preset)')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new Error(errData?.error?.message || 'Cloudinary upload failed')
  }

  const data = await response.json()
  return {
    url: data.secure_url,
    publicId: data.public_id,
  }
}