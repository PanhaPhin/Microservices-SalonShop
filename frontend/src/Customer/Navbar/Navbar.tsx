import { AccountCircle, NotificationsActive } from '@mui/icons-material'
import {
  Avatar,
  IconButton,
  Button,
  Badge
} from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const id = React.useId()
  const buttonId = `${id}-button`
  const menuId = `${id}-menu`

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate=useNavigate();
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div className='z-50 px-6 flex items-center justify-between py-2'>
      
      <div className='flex items-center gap-10'>
        <h1 onClick={()=> navigate("/") } className='cursor-pointer font-bold text-2xl'>
          Aura & Opal
        </h1>

        <div className='flex items-center gap-5'>
          <h1>Home</h1>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">

        <Button variant="outlined">
          Become partner
        </Button>

        <IconButton onClick={()=>navigate("/notifications")}>
          <Badge badgeContent={5} color="primary">
            <NotificationsActive color="primary" />
          </Badge>
        </IconButton>

        {true?  <div className='flex gap-1 items-center'>
          <h1 className='text-lg font-semibold'>Panha</h1>

          <IconButton
            id={buttonId}
            aria-controls={open ? menuId : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <Avatar />
          </IconButton>

          <Menu
            id={menuId}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={()=>{
                navigate("/bookings")
                handleClose()

            }}>My Bookings</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>

        </div>

        :<IconButton>
            <AccountCircle sx={{fontSize:"45px", color:"green"}} />
        </IconButton>}
      </div>
    </div>
  )
}

export default Navbar