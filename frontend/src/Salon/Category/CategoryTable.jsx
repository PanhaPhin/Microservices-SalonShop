import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

const rows = [
  {
    image: "https://via.placeholder.com/60",
    title: "Hair Cut",
  },
  {
    image: "https://via.placeholder.com/60",
    title: "Hair Coloring",
  },
  {
    image: "https://via.placeholder.com/60",
    title: "Facial",
  },
];

export default function CategoryTable() {
  return (
    <>
      <h1 className="pb-5 font-bold text-xl">Categories</h1>

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#15803d" }}>
              <TableCell
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  width: "80px",
                }}
              >
                #
              </TableCell>

              <TableCell
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                Image
              </TableCell>

              <TableCell
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                Category Name
              </TableCell>

              <TableCell
                align="center"
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={index}
                hover
                sx={{
                  "&:nth-of-type(odd)": {
                    backgroundColor: "#f9fafb",
                  },
                }}
              >
                <TableCell>{index + 1}</TableCell>

                <TableCell>
                  <img
                    src={row.image}
                    alt={row.title}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                </TableCell>

                <TableCell>{row.title}</TableCell>

                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}