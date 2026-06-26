import React from "react";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#000",
    color: "#fff",
    fontWeight: 600,
    fontSize: "14px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:hover": {
    backgroundColor: "#f5f5f5",
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const rows = [
  {
    service: "Hair Cut",
    title: "Basic Hair Styling",
    price: "$10",
    image:
      "https://images.pexels.com/photos/6876708/pexels-photo-6876708.jpeg",
  },
  {
    service: "Hair Coloring",
    title: "Premium Color Package",
    price: "$25",
    image:
      "https://images.pexels.com/photos/6876708/pexels-photo-6876708.jpeg",
  },
  {
    service: "Facial",
    title: "Skin Care Treatment",
    price: "$15",
    image:
      "https://images.pexels.com/photos/6876708/pexels-photo-6876708.jpeg",
  },
];

export default function ServiceTables() {
  return (
    <>
      <h1 className="text-xl font-bold mb-4">Services</h1>

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ borderRadius: 2 }}
      >
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Service</StyledTableCell>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell align="right">Price</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  {row.service}
                </StyledTableCell>

                <StyledTableCell>
                  <img
                    src={row.image}
                    alt={row.service}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                </StyledTableCell>

                <StyledTableCell>{row.title}</StyledTableCell>

                <StyledTableCell align="right">
                  {row.price}
                </StyledTableCell>

                <StyledTableCell align="center">
                  <button className="text-green-600 font-medium mr-4 hover:underline">
                    Edit
                  </button>

                  <button className="text-red-500 font-medium hover:underline">
                    Delete
                  </button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}