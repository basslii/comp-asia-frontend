"use client";

import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Purchase } from '../../../../packages/model/model';
import Navbar from '../Navbar';

export default function purchasePage(): JSX.Element {
    const [orders, setOrders] = useState<Purchase[]>([]);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [totalRows, setTotalRows] = useState<number>(0);

    useEffect(() => {
        const fetchOrders = async () => {
            const pageNumber = page + 1;
            const res = await axios.get('http://localhost:8080/purchase', {
                params: {
                    page: pageNumber,
                    size: rowsPerPage,
                }
            });

            // console.log(res.data.data, "orders")
            setOrders(res.data.data);
            setTotalRows(res.data.total);
                        
        };
        fetchOrders();
    }, [page, rowsPerPage]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.target.value, 10);
        setRowsPerPage(newSize);
        setPage(0);
    };

    return (
        <>
            <Navbar />
            <div className="purchase-container">
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell align="right">Product ID</TableCell>
                                <TableCell align="right">Product Name</TableCell>
                                <TableCell align="right">Product Color</TableCell>
                                <TableCell align="right">Order Date Time</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders?.map((order) => (
                                <TableRow key={order.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        {order.id}
                                    </TableCell>
                                    <TableCell align="right">{order.productId}</TableCell>
                                    <TableCell align="right">{order.productName}</TableCell>
                                    <TableCell align="right">{order.productColor}</TableCell>
                                    <TableCell align="right">{order.createdAt}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={totalRows}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage} />
            </div>
        </>
    );
}