import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../Redux/Admin/Category/Action";

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const { categories, loading, error, success } = useSelector(
    (state) => state.category
  );

  const [formData, setFormData] = useState({
    name: "",
    level: 2,
    parentCategory: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  // Top-level categories (level 1) from database
  // Fallback to hardcoded if database not seeded yet
  const topLevelCategories = categories.filter((cat) => cat.level === 1);
  const hasTopLevelCategories = topLevelCategories.length > 0;
  
  // Fallback categories if database not seeded
  const fallbackTopCategories = [
    { _id: 'temp-women', name: 'women' },
    { _id: 'temp-men', name: 'men' },
    { _id: 'temp-kids', name: 'kids' },
  ];
  
  const displayTopCategories = hasTopLevelCategories ? topLevelCategories : fallbackTopCategories;

  // Get second-level categories (level 2)
  const secondLevelCategories = categories.filter((cat) => cat.level === 2);

  // Get parent categories based on selected level
  const getParentOptions = () => {
    if (formData.level === 2) {
      return displayTopCategories;
    } else if (formData.level === 3) {
      return secondLevelCategories;
    }
    return [];
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle level change
  const handleLevelChange = (e) => {
    setFormData({
      ...formData,
      level: e.target.value,
      parentCategory: "",
    });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.parentCategory) {
      alert("Please fill all fields");
      return;
    }

    const categoryData = {
      name: formData.name.toLowerCase().trim(),
      level: formData.level,
      parentCategory: formData.parentCategory, // Both level 2 and 3 use MongoDB ObjectId
    };

    if (editMode) {
      dispatch(updateCategory(editCategoryId, categoryData));
      setEditMode(false);
      setEditCategoryId(null);
    } else {
      dispatch(createCategory(categoryData));
    }

    // Reset form
    setFormData({
      name: "",
      level: 2,
      parentCategory: "",
    });
  };

  // Handle edit category
  const handleEdit = (category) => {
    setEditMode(true);
    setEditCategoryId(category._id);
    setFormData({
      name: category.name,
      level: category.level,
      parentCategory: category.parentCategory?._id || "",
    });
  };

  // Handle delete category
  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete._id));
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditCategoryId(null);
    setFormData({
      name: "",
      level: 2,
      parentCategory: "",
    });
  };

  // Group categories by level and parent
  const categoriesByLevel = {
    2: categories.filter((cat) => cat.level === 2),
    3: categories.filter((cat) => cat.level === 3),
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Category Management
      </Typography>

      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {!hasTopLevelCategories && !loading && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Top-level categories not found in database. Please run: <code>node src/scripts/seedCategories.js</code> from backend directory.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Add/Edit Category Form */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {editMode ? "Edit Category" : "Add New Category"}
              </Typography>
              <form onSubmit={handleSubmit}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Category Level</InputLabel>
                  <Select
                    name="level"
                    value={formData.level}
                    onChange={handleLevelChange}
                    label="Category Level"
                    disabled={editMode}
                  >
                    <MenuItem value={2}>Second Level</MenuItem>
                    <MenuItem value={3}>Third Level</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>
                    {formData.level === 2
                      ? "Select Top Category"
                      : "Select Second Level Category"}
                  </InputLabel>
                  <Select
                    name="parentCategory"
                    value={formData.parentCategory}
                    onChange={handleInputChange}
                    label={
                      formData.level === 2
                        ? "Select Top Category"
                        : "Select Second Level Category"
                    }
                    disabled={editMode}
                  >
                    {getParentOptions().map((parent) => (
                      <MenuItem key={parent._id} value={parent._id}>
                        {parent.name.charAt(0).toUpperCase() +
                          parent.name.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Category Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                  placeholder="e.g., t-shirts, jeans, dresses"
                />

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : editMode ? (
                      "Update Category"
                    ) : (
                      "Add Category"
                    )}
                  </Button>
                  {editMode && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleCancelEdit}
                      fullWidth
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Categories List */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Existing Categories
              </Typography>

              {/* Second Level Categories */}
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
                Second Level Categories
              </Typography>
              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Parent</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categoriesByLevel[2].length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No second level categories
                        </TableCell>
                      </TableRow>
                    ) : (
                      categoriesByLevel[2].map((category) => (
                        <TableRow key={category._id}>
                          <TableCell>
                            {category.name.charAt(0).toUpperCase() +
                              category.name.slice(1)}
                          </TableCell>
                          <TableCell>
                            {category.parentCategory?.name
                              ? category.parentCategory.name.charAt(0).toUpperCase() +
                                category.parentCategory.name.slice(1)
                              : "N/A"}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEdit(category)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(category)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Third Level Categories */}
              <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: "bold" }}>
                Third Level Categories
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Parent Category</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categoriesByLevel[3].length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No third level categories
                        </TableCell>
                      </TableRow>
                    ) : (
                      categoriesByLevel[3].map((category) => (
                        <TableRow key={category._id}>
                          <TableCell>
                            {category.name.charAt(0).toUpperCase() +
                              category.name.slice(1)}
                          </TableCell>
                          <TableCell>
                            {category.parentCategory?.name
                              ? category.parentCategory.name.charAt(0).toUpperCase() +
                                category.parentCategory.name.slice(1)
                              : "N/A"}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEdit(category)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(category)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the category "
            {categoryToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryManagement;
