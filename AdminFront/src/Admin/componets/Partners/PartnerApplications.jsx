import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Pagination,
  Button,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationCity as CityIcon,
  CheckCircle as ContactedIcon,
} from "@mui/icons-material";
import api from "../../../config/api";

const statusColors = {
  new: "info",
  contacted: "warning",
  approved: "success",
  rejected: "error",
};

const PartnerApplications = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPartners, setTotalPartners] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchPartners = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        pageSize: 10,
      });
      if (search) params.set("search", search);

      const response = await api.get(`/api/partners?${params.toString()}`);
      setPartners(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalPartners(response.data.totalPartners || 0);
    } catch (error) {
      console.error("Error fetching partners:", error);
      showSnackbar(
        error.response?.data?.message || "Failed to load partners",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchPartners();
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/api/partners/${id}/status`, { status });
      showSnackbar(`Partner marked as ${status}`, "success");
      fetchPartners();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to update status",
        "error"
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;

    try {
      await api.delete(`/api/partners/${id}`);
      showSnackbar("Partner application deleted", "success");
      fetchPartners();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to delete",
        "error"
      );
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardHeader
          title="Partner Applications"
          subheader={`${totalPartners} total applications`}
          action={
            <TextField
              size="small"
              placeholder="Search by name, phone, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          }
        />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : partners.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="h6" color="text.secondary">
              No partner applications found
            </Typography>
            {search && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try a different search term
              </Typography>
            )}
          </Box>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {partners.map((partner, index) => (
                    <TableRow key={partner._id} hover>
                      <TableCell>
                        {(page - 1) * 10 + index + 1}
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={600}>
                          {partner.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                        >
                          <PhoneIcon fontSize="small" color="action" />
                          {partner.phone}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                        >
                          <EmailIcon fontSize="small" color="action" />
                          {partner.email}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                        >
                          <CityIcon fontSize="small" color="action" />
                          {partner.city}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={partner.status}
                          color={statusColors[partner.status] || "default"}
                          size="small"
                          sx={{ textTransform: "capitalize" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(partner.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                          {partner.status === "new" && (
                            <Tooltip title="Mark as Contacted">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() =>
                                  handleStatusUpdate(partner._id, "contacted")
                                }
                              >
                                <ContactedIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          {(partner.status === "new" ||
                            partner.status === "contacted") && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              onClick={() =>
                                handleStatusUpdate(partner._id, "approved")
                              }
                              sx={{ textTransform: "none", minWidth: 0, px: 1 }}
                            >
                              Approve
                            </Button>
                          )}
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(partner._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          </>
        )}
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PartnerApplications;
