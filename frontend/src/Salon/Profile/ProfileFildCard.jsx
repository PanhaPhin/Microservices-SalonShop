import React from 'react'
import { Divider } from '@mui/material'

const ProfileFieldCard = ({ value, keys, icon }) => {
  return (
    <div className="flex items-center px-4 py-3 bg-slate-50 gap-3">
      {/* Key / Label side */}
      <div className="flex items-center gap-2 w-36 shrink-0">
        {icon && <span className="text-base">{icon}</span>}
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {keys}
        </p>
      </div>

      {/* MUI vertical divider — exactly as your original */}
      <Divider flexItem orientation="vertical" />

      {/* Value side */}
      <p className="text-sm text-gray-800 font-medium pl-1 truncate">{value}</p>
    </div>
  )
}

export default ProfileFieldCard