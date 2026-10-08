export const FOREST = '#14342B'
export const TEAL = '#0F9B8E'
export const HAIRLINE = '#DEDAD0'

export const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    backgroundColor: '#FCFBF9',
    '& fieldset': { borderColor: HAIRLINE },
    '&:hover fieldset': { borderColor: FOREST },
    '&.Mui-focused fieldset': { borderColor: TEAL, borderWidth: '1.5px' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: TEAL },
}