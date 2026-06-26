import React from "react";
import styled from "@emotion/styled";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  tableCellClasses,
} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#15803d",
    color: "#fff",
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const rows = [
  {
    service: "Hair Cut",
    datetime: "25 Jun 2026, 10:00 AM",
    price: "$10",
    customer: {
      name: "Code With Panha",
      email: "panhaphin17@gmail.com",
    },
    status: "Pending",
  },
  {
    service: "Hair Coloring",
    datetime: "25 Jun 2026, 11:30 AM",
    price: "$25",
    customer: {
      name: "Sok Dara",
      email: "dara@gmail.com",
    },
    status: "Confirmed",
  },
  {
    service: "Facial",
    datetime: "25 Jun 2026, 1:00 PM",
    price: "$15",
    customer: {
      name: "Chanthy",
      email: "chanthy@gmail.com",
    },
    status: "Completed",
  },
];

export default function BookingTables() {
  return (
    <>
      <h1 className="pb-5 font-bold text-xl">Booking</h1>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Service</StyledTableCell>
              <StyledTableCell align="right">Date & Time</StyledTableCell>
              <StyledTableCell align="right">Price</StyledTableCell>
              <StyledTableCell align="right">Customer</StyledTableCell>
              <StyledTableCell align="right">Status</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>{row.service}</StyledTableCell>

                <StyledTableCell align="right">
                  {row.datetime}
                </StyledTableCell>

                <StyledTableCell align="right">
                  {row.price}
                </StyledTableCell>

                <StyledTableCell align="right">
                  <div className="text-right">
                    <p className="font-medium">{row.customer.name}</p>
                    <p className="text-xs text-gray-500">
                      {row.customer.email}
                    </p>
                  </div>
                </StyledTableCell>

                <StyledTableCell align="right">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      row.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : row.status === "Confirmed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {row.status}
                  </span>
                </StyledTableCell>

                <StyledTableCell align="right">
                  <button className="text-red-500 hover:underline">
                    Cancel
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