import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Rating,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import api from '../../../config/api';

const ReviewsTable = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      console.log('Fetching reviews from API...');
      const response = await api.get('/api/reviews/all');
      console.log('Reviews fetched successfully:', response.data);
      setReviews(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      console.error('Error response:', err.response);
      
      // Handle JWT expiration specifically
      if (err.message?.includes('Session expired')) {
        setError('Your session has expired. Redirecting to login...');
        return; // Interceptor will handle redirect
      }
      
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to fetch reviews';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (review) => {
    setSelectedReview(review);
    setDeleteDialogOpen(true);
  };

  const handleViewClick = (review) => {
    setSelectedReview(review);
    setViewDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await api.delete(`/api/reviews/${selectedReview._id}`);
      
      // Remove from local state
      setReviews(reviews.filter(r => r._id !== selectedReview._id));
      setDeleteDialogOpen(false);
      setSelectedReview(null);
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedReview(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 2, px: 2 }}>
      <Card>
        <CardHeader
          title="Customer Reviews"
          subheader={`Total Reviews: ${reviews.length}`}
          sx={{ pb: 0 }}
        />
        
        {reviews.length === 0 ? (
          <Box p={4} textAlign="center">
            <Typography variant="body1" color="text.secondary">
              No reviews found
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table sx={{ minWidth: 650 }} aria-label="reviews table">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Review</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow
                    key={review._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {review.product?.imageUrl?.[0] && (
                          <Avatar
                            src={review.product.imageUrl[0]}
                            variant="rounded"
                            sx={{ width: 50, height: 50 }}
                          />
                        )}
                        <Typography variant="body2" noWrap maxWidth={200}>
                          {review.product?.title || 'Unknown Product'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {review.user?.firstName} {review.user?.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {review.user?.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Rating value={review.rating || 0} readOnly size="small" />
                        <Typography variant="body2">
                          {review.rating || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        noWrap
                        maxWidth={300}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleViewClick(review)}
                      >
                        {review.review || review.description || 'No review text'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(review.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewClick(review)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Review">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(review)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Review</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this review from{' '}
            <strong>
              {selectedReview?.user?.firstName} {selectedReview?.user?.lastName}
            </strong>
            ? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={deleteLoading && <CircularProgress size={16} />}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Review Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Review Details</DialogTitle>
        <DialogContent>
          {selectedReview && (
            <Box>
              {/* Product Info */}
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                {selectedReview.product?.imageUrl?.[0] && (
                  <Avatar
                    src={selectedReview.product.imageUrl[0]}
                    variant="rounded"
                    sx={{ width: 80, height: 80 }}
                  />
                )}
                <Box>
                  <Typography variant="h6">
                    {selectedReview.product?.title}
                  </Typography>
                  <Rating value={selectedReview.rating || 0} readOnly />
                </Box>
              </Box>

              {/* Customer Info */}
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Customer
                </Typography>
                <Typography variant="body1">
                  {selectedReview.user?.firstName} {selectedReview.user?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedReview.user?.email}
                </Typography>
              </Box>

              {/* Review Text */}
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Review
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedReview.review}
                </Typography>
                {selectedReview.description && (
                  <Typography variant="body2" color="text.secondary">
                    {selectedReview.description}
                  </Typography>
                )}
              </Box>

              {/* Date */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Posted on {formatDate(selectedReview.createdAt)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button
            onClick={() => {
              setViewDialogOpen(false);
              handleDeleteClick(selectedReview);
            }}
            color="error"
            variant="outlined"
          >
            Delete Review
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewsTable;
