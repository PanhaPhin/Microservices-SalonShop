import React from "react";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import {
  Box,
  Avatar,
  Rating,
  IconButton,
  Paper,
  Typography,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { red, grey } from "@mui/material/colors";

const ReviewCard = ({ item, onDelete }) => {

  const { auth } = useSelector((store) => store);

  // Backend: UserDTO -> name
  const userName = item?.user?.name || "Anonymous";

  const initial = userName.charAt(0).toUpperCase();


  // Backend: ReviewDTO -> createdAt
  const reviewDateTime = item?.createdAt
    ? new Date(item.createdAt).toLocaleString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;


  const handleDeleteReview = () => {
    if (item?.id && onDelete) {
      onDelete(item.id);
    }
  };


  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: grey[200],
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          borderColor: grey[300],
        },
      }}
    >

      <Grid container spacing={2}>

        {/* Avatar */}
        <Grid size={{ xs: 12, md: 2 }}>
          <Box className="flex justify-center md:justify-start">

            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: "#9155FD",
                fontSize: "1.25rem",
                fontWeight: 600,
              }}
            >
              {initial}
            </Avatar>

          </Box>
        </Grid>


        {/* Review Content */}
        <Grid size={{ xs: 12, md: 9 }}>

          <Box className="flex justify-between items-center flex-wrap">

            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
              }}
            >
              {userName}
            </Typography>


            {reviewDateTime && (
              <Typography
                variant="caption"
                sx={{
                  color: grey[500],
                }}
              >
                {reviewDateTime}
              </Typography>
            )}

          </Box>


          {/* Rating */}
          <Rating
            value={Number(item?.rating) || 0}
            precision={0.5}
            readOnly
            size="small"
            sx={{
              mt: 1,
            }}
          />


          {/* Review Text */}
          <Typography
            variant="body2"
            sx={{
              color: grey[600],
              mt: 1,
              lineHeight: 1.6,
            }}
          >
            {item?.reviewText}
          </Typography>

        </Grid>


        {/* Delete Button */}
        <Grid size={{ xs: 12, md: 1 }}>

          <Box className="flex justify-end">

            {
              Number(item?.user?.id) === Number(auth?.user?.id)
              &&
              (
                <Tooltip title="Delete review">

                  <IconButton
                    onClick={handleDeleteReview}
                    size="small"
                    sx={{
                      color: grey[400],
                      "&:hover": {
                        color: red[600],
                        bgcolor: red[50],
                      },
                    }}
                  >

                    <DeleteIcon fontSize="small" />

                  </IconButton>

                </Tooltip>
              )
            }

          </Box>

        </Grid>


      </Grid>

    </Paper>
  );
};


export default ReviewCard;