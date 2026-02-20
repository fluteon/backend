import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Switch,
  TextField,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  DragIndicator as DragIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import api from "../../../config/api";

// Category hierarchy matching the product creation form
const categoryHierarchy = {
  women: {
    bottom_wear: [
      { value: "formal_pants", label: "Formal Pants" },
      { value: "cotton_pants", label: "Cotton Pants" },
      { value: "linen_pants", label: "Linen Pants" },
      { value: "cargos", label: "Cargo" },
      { value: "track_pants", label: "Track Pants" },
      { value: "jeans", label: "Jeans" },
      { value: "skirts", label: "Skirts" },
      { value: "tummytucker", label: "Tummytucker" },
      { value: "swimmingsuit", label: "Swimming Suit" },
    ],
    blazer: [
      { value: "blazers", label: "Blazer" },
      { value: "blazers_sets", label: "Blazer Sets" },
    ],
    shirts: [
      { value: "formal_shirts", label: "Formal Shirts" },
      { value: "satin_shirts", label: "Satin Shirts" },
      { value: "hidden_button_shirts", label: "Hidden Button Shirts" },
    ],
    tops: [
      { value: "tanic_tops", label: "Tanic Top" },
      { value: "tunic_tops", label: "Tank Top" },
      { value: "peplum_tops", label: "Peplum Top" },
      { value: "crop_tops", label: "Crop Tops" },
    ],
    kurtis: [
      { value: "office_wear_kurtis", label: "Office Wear" },
      { value: "a_line_kurtis", label: "A-Line Kurtis" },
      { value: "kalamkari", label: "Kalamkari Kurti" },
    ],
  },
};

const HomepageSections = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  const [formData, setFormData] = useState({
    topLevelCategory: "",
    secondLevelCategory: "",
    thirdLevelCategory: "",
    label: "",
    isEnabled: true,
    productsToShow: 10,
  });

  useEffect(() => {
    fetchSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSections = async () => {
    try {
      console.log("📥 Fetching homepage sections from:", api.defaults.baseURL);
      const response = await api.get("/api/homepage-sections");
      console.log("✅ Fetched", response.data.length, "sections");
      setSections(response.data);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching sections:", error);
      console.error("Response:", error.response?.data);
      const errorMsg = error.response?.data?.error || error.message || "Failed to load sections";
      showSnackbar(errorMsg, "error");
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSections(items);

    try {
      console.log("🔄 Updating order with", items.length, "sections");
      await api.put(
        "/api/homepage-sections/reorder",
        { sections: items }
      );
      showSnackbar("Section order updated successfully", "success");
    } catch (error) {
      console.error("❌ Error updating order:", error);
      console.error("Response:", error.response?.data);
      const errorMsg = error.response?.data?.error || error.message || "Failed to update order";
      showSnackbar(errorMsg, "error");
      fetchSections(); // Revert on error
    }
  };

  const handleToggleEnabled = async (section) => {
    try {
      await api.put(
        `/api/homepage-sections/${section._id}`,
        { isEnabled: !section.isEnabled }
      );
      showSnackbar(
        `Section ${!section.isEnabled ? "enabled" : "disabled"} successfully`,
        "success"
      );
      fetchSections();
    } catch (error) {
      console.error("Error toggling section:", error);
      const errorMsg = error.response?.data?.error || error.message || "Failed to update section";
      showSnackbar(errorMsg, "error");
    }
  };

  const handleOpenDialog = (section = null) => {
    if (section) {
      setEditingSection(section);
      // Parse the path to extract categories
      const pathParts = section.path.split('/').filter(Boolean);
      setFormData({
        topLevelCategory: pathParts[0] || "",
        secondLevelCategory: pathParts[1] || "",
        thirdLevelCategory: section.name,
        label: section.label,
        isEnabled: section.isEnabled,
        productsToShow: section.productsToShow,
      });
    } else {
      setEditingSection(null);
      setFormData({
        topLevelCategory: "",
        secondLevelCategory: "",
        thirdLevelCategory: "",
        label: "",
        isEnabled: true,
        productsToShow: 10,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSection(null);
  };

  const handleSaveSection = async () => {
    try {
      // Build the path from selected categories
      const path = `/${formData.topLevelCategory}/${formData.secondLevelCategory}/${formData.thirdLevelCategory}`;
      
      const payload = {
        name: formData.thirdLevelCategory,
        label: formData.label,
        path: path,
        isEnabled: formData.isEnabled,
        productsToShow: formData.productsToShow,
      };
      
      if (editingSection) {
        await api.put(
          `/api/homepage-sections/${editingSection._id}`,
          payload
        );
        showSnackbar("Section updated successfully", "success");
      } else {
        await api.post("/api/homepage-sections", payload);
        showSnackbar("Section created successfully", "success");
      }
      
      handleCloseDialog();
      fetchSections();
    } catch (error) {
      console.error("Error saving section:", error);
      const errorMsg = error.response?.data?.error || error.message || "Failed to save section";
      showSnackbar(errorMsg, "error");
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm("Are you sure you want to delete this section?")) return;

    try {
      await api.delete(`/api/homepage-sections/${sectionId}`);
      showSnackbar("Section deleted successfully", "success");
      fetchSections();
    } catch (error) {
      console.error("Error deleting section:", error);
      const errorMsg = error.response?.data?.error || error.message || "Failed to delete section";
      showSnackbar(errorMsg, "error");
    }
  };

  const handleInitialize = async () => {
    if (!window.confirm("This will initialize default sections. Continue?")) return;

    try {
      await api.post("/api/homepage-sections/initialize", {});
      showSnackbar("Default sections initialized successfully", "success");
      fetchSections();
    } catch (error) {
      console.error("Error initializing sections:", error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || "Failed to initialize";
      showSnackbar(errorMsg, "info");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardHeader
          title="Homepage Sections Manager"
          subheader="Drag and drop to reorder sections. Toggle to enable/disable."
          action={
            <Box>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ mr: 1 }}
              >
                Add Section
              </Button>
              {sections.length === 0 && (
                <Button
                  variant="contained"
                  onClick={handleInitialize}
                >
                  Initialize Default Sections
                </Button>
              )}
            </Box>
          }
        />
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell width={50}></TableCell>
                        <TableCell>Order</TableCell>
                        <TableCell>Label</TableCell>
                        <TableCell>Category Name</TableCell>
                        <TableCell>Path</TableCell>
                        <TableCell>Products to Show</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                      {sections.map((section, index) => (
                        <Draggable
                          key={String(section._id)}
                          draggableId={String(section._id)}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <TableRow
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              sx={{
                                backgroundColor: snapshot.isDragging
                                  ? "action.hover"
                                  : "inherit",
                              }}
                            >
                              <TableCell {...provided.dragHandleProps}>
                                <DragIcon sx={{ cursor: "grab" }} />
                              </TableCell>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <Typography variant="body1" fontWeight="bold">
                                  {section.label}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                  {section.name}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                  {section.path}
                                </Typography>
                              </TableCell>
                              <TableCell>{section.productsToShow}</TableCell>
                              <TableCell>
                                <Switch
                                  checked={section.isEnabled}
                                  onChange={() => handleToggleEnabled(section)}
                                  color="primary"
                                />
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDialog(section)}
                                  color="primary"
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteSection(section._id)}
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Droppable>
          </DragDropContext>

          {sections.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No sections configured
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Click "Initialize Default Sections" to get started
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Edit/Add Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSection ? "Edit Section" : "Add New Section"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            {/* Top Level Category */}
            <FormControl fullWidth>
              <InputLabel>Top Level Category</InputLabel>
              <Select
                value={formData.topLevelCategory}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    topLevelCategory: e.target.value,
                    secondLevelCategory: "",
                    thirdLevelCategory: "",
                  })
                }
                label="Top Level Category"
              >
                {Object.keys(categoryHierarchy).map((topKey) => (
                  <MenuItem key={topKey} value={topKey}>
                    {topKey.charAt(0).toUpperCase() + topKey.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Second Level Category */}
            <FormControl fullWidth disabled={!formData.topLevelCategory}>
              <InputLabel>Second Level Category</InputLabel>
              <Select
                value={formData.secondLevelCategory}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    secondLevelCategory: e.target.value,
                    thirdLevelCategory: "",
                  })
                }
                label="Second Level Category"
              >
                {formData.topLevelCategory &&
                  Object.keys(categoryHierarchy[formData.topLevelCategory]).map(
                    (secondKey) => (
                      <MenuItem key={secondKey} value={secondKey}>
                        {secondKey.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </MenuItem>
                    )
                  )}
              </Select>
            </FormControl>

            {/* Third Level Category */}
            <FormControl fullWidth disabled={!formData.secondLevelCategory}>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.thirdLevelCategory}
                onChange={(e) => {
                  const selectedOption = categoryHierarchy[formData.topLevelCategory][
                    formData.secondLevelCategory
                  ].find((opt) => opt.value === e.target.value);
                  
                  setFormData({
                    ...formData,
                    thirdLevelCategory: e.target.value,
                    label: selectedOption?.label || "",
                  });
                }}
                label="Category"
              >
                {formData.topLevelCategory &&
                  formData.secondLevelCategory &&
                  categoryHierarchy[formData.topLevelCategory][
                    formData.secondLevelCategory
                  ].map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <TextField
              label="Display Label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              fullWidth
              helperText="Label shown on website (e.g., Blazers, Satin Shirts)"
            />
            
            <TextField
              label="Products to Show"
              type="number"
              value={formData.productsToShow}
              onChange={(e) =>
                setFormData({ ...formData, productsToShow: parseInt(e.target.value) })
              }
              fullWidth
              inputProps={{ min: 1, max: 50 }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Switch
                checked={formData.isEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, isEnabled: e.target.checked })
                }
              />
              <Typography>Enable this section</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveSection}
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomepageSections;
