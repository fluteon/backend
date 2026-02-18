import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const RecentOrders = ({ orders = [] }) => {
  const navigate = useNavigate()

  return (
    <Card>
      <CardHeader
        title="Recent Orders"
        sx={{ pt: 2, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
        action={
          <Typography
            onClick={() => navigate('orders')}
            variant="caption"
            sx={{ color: 'blue', cursor: 'pointer', paddingRight: '.8rem' }}
          >
            View All
          </Typography>
        }
        titleTypographyProps={{
          variant: 'h5',
          sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
        }}
      />
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label="recent orders table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.slice(0, 10).map((order, index) => {
              const item = order?.orderItems?.[0]?.product || {}
              return (
                <TableRow hover key={order._id}>
                  <TableCell>
                    <Avatar alt={item?.title} src={item?.imageUrl?.[0]} />
                  </TableCell>
                  <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>
                        {item?.title}
                      </Typography>
                      <Typography variant="caption">{item?.brand}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>₹{order.totalDiscountedPrice}</TableCell>
                  <TableCell>{order.orderId || `ORD-${index + 1}`}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.orderStatus}
                      size="small"
                      color={
                        order.orderStatus === 'DELIVERED'
                          ? 'success'
                          : order.orderStatus === 'CANCELLED'
                          ? 'error'
                          : 'warning'
                      }
                      sx={{ color: 'white' }}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default RecentOrders
