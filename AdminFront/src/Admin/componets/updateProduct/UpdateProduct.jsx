import React, { useEffect, useState, Fragment } from "react";
import { Typography } from "@mui/material";
import {
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import "../createProduct/CreateProductForm.css";
import { useDispatch, useSelector } from "react-redux";
import { findProductById } from "../../../Redux/Customers/Product/Action";
import { updateProduct } from "../../../Redux/Admin/Product/Action";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config/api";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
      { value: "tank_tops", label: "Tank Top" },
      { value: "peplum_tops", label: "Peplum Top" },
      { value: "crop_tops", label: "Crop Tops" },
    ],
    kurtis: [
      { value: "office_wear_kurtis", label: "Office Wear" },
      { value: "a_line_kurtis", label: "A-Line Kurtis" },
      { value: "kalamkari", label: "Kalamkari Kurti" },
    ],
    swimming_costume: [
      { value: "one_piece", label: "One Piece" },
      { value: "bikini", label: "Bikini" },
      { value: "swim_sets", label: "Swim Sets" },
    ],
    tummytucker: [
      { value: "high_waist", label: "High Waist" },
      { value: "full_body", label: "Full Body" },
      { value: "waist_trainer", label: "Waist Trainer" },
    ],
  },
};

const UpdateProductForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();
  const { customersProduct } = useSelector((store) => store);

  const [sizeChart, setSizeChart] = useState(null);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [productData, setProductData] = useState({
    images: "",
    brand: "",
    title: "",
    color: "",
    discountedPrice: "",
    price: "",
    discountPersent: "",
    size: [],
    quantity: "",
    topLavelCategory: "",
    secondLavelCategory: "",
    thirdLavelCategory: "",
    description: "",
  });

  // Load product data when component mounts
  useEffect(() => {
    if (productId) {
      dispatch(findProductById({ productId }));
    }
  }, [productId, dispatch]);

  // Populate form when product loads
  useEffect(() => {
    if (customersProduct.product) {
      const product = customersProduct.product;
      
      // Extract category from product.category object (populated)
      let categoryPath = {
        topLavelCategory: "",
        secondLavelCategory: "",
        thirdLavelCategory: "",
      };
      
      // If product has category, try to find it in hierarchy
      if (product.category?.name) {
        categoryPath = findCategoryPath(product.category.name) || categoryPath;
        console.log("📍 Product category:", product.category.name);
        console.log("📍 Resolved category path:", categoryPath);
      }
      
      setProductData({
        _id: product._id,
        brand: product.brand || "",
        title: product.title || "",
        color: Array.isArray(product.color) ? product.color[0] : product.color || "",
        discountedPrice: product.discountedPrice || "",
        price: product.price || "",
        discountPersent: product.discountPersent || "",
        quantity: product.quantity || "",
        description: product.description || "",
        size: product.sizes?.length > 0 ? product.sizes : [],
        ...categoryPath,
      });

      if (product.imageUrl?.length > 0) {
        setPreviewImages(product.imageUrl);
      }
    }
  }, [customersProduct.product]);

  function findCategoryPath(value) {
    for (const top in categoryHierarchy) {
      for (const second in categoryHierarchy[top]) {
        const thirdOptions = categoryHierarchy[top][second];
        for (const option of thirdOptions) {
          if (option.value === value) {
            return {
              topLavelCategory: top,
              secondLavelCategory: second,
              thirdLavelCategory: value,
            };
          }
        }
      }
    }
    return {
      topLavelCategory: "",
      secondLavelCategory: "",
      thirdLavelCategory: "",
    };
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    console.log("📸 Images selected:", files.length, "files");
    
    const newImages = [...images, ...files].slice(0, 4);
    setImages(newImages);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    const allPreviews = [...previewImages, ...newPreviews].slice(0, 4);
    setPreviewImages(allPreviews);
  };

  const handleRemoveImage = (indexToRemove) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    const newPreviews = previewImages.filter((_, index) => index !== indexToRemove);
    
    setImages(newImages);
    setPreviewImages(newPreviews);
    
    console.log("🗑️ Image removed. Remaining:", newImages.length);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const reorderedImages = Array.from(images);
    const [movedImage] = reorderedImages.splice(sourceIndex, 1);
    reorderedImages.splice(destinationIndex, 0, movedImage);

    const reorderedPreviews = Array.from(previewImages);
    const [movedPreview] = reorderedPreviews.splice(sourceIndex, 1);
    reorderedPreviews.splice(destinationIndex, 0, movedPreview);

    setImages(reorderedImages);
    setPreviewImages(reorderedPreviews);

    console.log("🔄 Images reordered:", sourceIndex, "→", destinationIndex);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProductData((prevState) => {
      const updatedData = {
        ...prevState,
        [name]: value,
      };

      if (
        (name === "price" || name === "discountedPrice") &&
        updatedData.price &&
        updatedData.discountedPrice &&
        parseFloat(updatedData.price) > parseFloat(updatedData.discountedPrice)
      ) {
        const price = parseFloat(updatedData.price);
        const discountedPrice = parseFloat(updatedData.discountedPrice);
        const discount = ((price - discountedPrice) / price) * 100;
        updatedData.discountPersent = discount.toFixed(2);
      }

      return updatedData;
    });
  };

  const handleSizeChange = (e, index) => {
    let { name, value } = e.target;
    name = name === "size_quantity" ? "quantity" : name;

    const sizes = [...productData.size];
    sizes[index][name] = value;
    setProductData((prevState) => ({
      ...prevState,
      size: sizes,
    }));
  };

  const handleAddSize = () => {
    const sizes = [...productData.size];
    sizes.push({ name: "", quantity: "" });
    setProductData((prevState) => ({
      ...prevState,
      size: sizes,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setSuccess(false);

    const formData = new FormData();

    console.log("📦 Building FormData for UPDATE...");
    console.log("Product Data:", productData);
    console.log("Images state:", images.length);
    console.log("Preview images:", previewImages.length);
    console.log("📂 Categories:", {
      top: productData.topLavelCategory,
      second: productData.secondLavelCategory,
      third: productData.thirdLavelCategory
    });

    // Validate images: Must have either new images OR existing preview images
    if (images.length === 0 && previewImages.length === 0) {
      console.error("⚠️ No images found for product update!");
      setError(true);
      setErrorMessage("Please select at least one product image");
      setLoading(false);
      return;
    }

    // Validate categories
    if (!productData.topLavelCategory || !productData.secondLavelCategory || !productData.thirdLavelCategory) {
      console.error("⚠️ Categories not properly set!");
      setError(true);
      setErrorMessage("Product category is missing. Please select all category levels.");
      setLoading(false);
      return;
    }

    // Add product data fields
    for (let key in productData) {
      if (key === "images" || key === "_id") {
        continue;
      }
      if (key === "size") {
        formData.append("size", JSON.stringify(productData.size));
      } else {
        formData.append(key, productData[key]);
      }
    }

    // Add images
    if (images.length > 0) {
      images.forEach((image, index) => {
        console.log(`Adding new image ${index + 1}`);
        formData.append("images", image);
      });
    } else {
      console.log("✅ No new images - keeping existing images:", previewImages.length);
      formData.append("existingImages", JSON.stringify(previewImages));
    }

    formData.append("productId", productData._id);

    try {
      await dispatch(updateProduct(formData));
      setSuccess(true);
      setLoading(false);
      console.log("✅ Product updated successfully");
      
      // Redirect to products page after 1.5 seconds with refresh trigger
      setTimeout(() => {
        navigate('/admin/products', { replace: true, state: { refreshProducts: true } });
      }, 1500);
    } catch (err) {
      console.error("❌ Update failed:", err);
      setError(true);
      setErrorMessage(err.response?.data?.error || err.message || "Failed to update product");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productData.thirdLavelCategory && !customersProduct.product) {
      fetch(`${API_BASE_URL}/api/admin/products/${productData.thirdLavelCategory}`)
        .then((res) => {
          if (!res.ok) throw new Error('Size chart not found');
          return res.json();
        })
        .then((data) => {
          if (!data?.sizes || data.sizes.length === 0) {
            setSizeChart(null);
            setProductData((prevState) => ({
              ...prevState,
              size: [{ name: "", quantity: 0 }],
            }));
          } else {
            const formattedSizes = data.sizes.map((sizeObj) => ({
              name: sizeObj.label,
              quantity: 0,
            }));
            setSizeChart(data);
            setProductData((prevState) => ({
              ...prevState,
              size: formattedSizes,
            }));
          }
        })
        .catch((error) => {
          setSizeChart(null);
          setProductData((prevState) => ({
            ...prevState,
            size: [{ name: "", quantity: 0 }],
          }));
        });
    }
  }, [productData.thirdLavelCategory, customersProduct.product]);

  const secondLevelOptions = productData.topLavelCategory
    ? Object.keys(categoryHierarchy[productData.topLavelCategory])
    : [];

  const thirdLevelOptions = productData.topLavelCategory &&
    productData.secondLavelCategory &&
    categoryHierarchy[productData.topLavelCategory][productData.secondLavelCategory]
      ? categoryHierarchy[productData.topLavelCategory][productData.secondLavelCategory]
      : [];

  return (
    <Fragment className="createProductContainer">
      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Product updated successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={error}
        autoHideDuration={6000}
        onClose={() => setError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(false)} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>

      <Typography
        variant="h3"
        sx={{ textAlign: "center" }}
        className="py-10 text-center"
      >
        Update Product
      </Typography>

      {loading && (
        <Alert severity="info" sx={{ mb: 2, mx: 3 }}>
          Updating product...
        </Alert>
      )}

      <form
        onSubmit={handleSubmit}
        className="createProductContainer min-h-screen"
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <input
                type="file"
                accept="image/*"
                name="images"
                multiple
                onChange={(e) => handleImageUpload(e)}
                style={{ marginBottom: '8px' }}
              />
              <Typography variant="caption" color="text.secondary" display="block">
                Upload up to 4 images. Drag to reorder. First image will be the main product image.
              </Typography>
            </Box>
            
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="images" direction="horizontal">
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ 
                      display: "flex", 
                      gap: 2, 
                      mt: 2, 
                      flexWrap: "wrap",
                      minHeight: previewImages.length === 0 ? '120px' : 'auto',
                      border: previewImages.length === 0 ? '2px dashed #ccc' : 'none',
                      borderRadius: 1,
                      padding: 2,
                      alignItems: 'center',
                      justifyContent: previewImages.length === 0 ? 'center' : 'flex-start'
                    }}
                  >
                    {previewImages.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        No images uploaded yet
                      </Typography>
                    ) : (
                      previewImages.map((img, index) => (
                        <Draggable key={`image-${index}`} draggableId={`image-${index}`} index={index}>
                          {(provided, snapshot) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              sx={{
                                position: 'relative',
                                border: snapshot.isDragging ? '2px solid #1976d2' : '2px solid #e0e0e0',
                                borderRadius: 1,
                                overflow: 'hidden',
                                backgroundColor: snapshot.isDragging ? '#f5f5f5' : 'white',
                                boxShadow: snapshot.isDragging ? '0 5px 15px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                }
                              }}
                            >
                              <Box
                                {...provided.dragHandleProps}
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  backgroundColor: 'rgba(0,0,0,0.6)',
                                  color: 'white',
                                  padding: '4px',
                                  cursor: 'grab',
                                  display: 'flex',
                                  alignItems: 'center',
                                  '&:active': {
                                    cursor: 'grabbing'
                                  }
                                }}
                              >
                                <DragIndicatorIcon fontSize="small" />
                              </Box>

                              <IconButton
                                size="small"
                                onClick={() => handleRemoveImage(index)}
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  right: 0,
                                  backgroundColor: 'rgba(255,255,255,0.9)',
                                  color: 'error.main',
                                  '&:hover': {
                                    backgroundColor: 'error.main',
                                    color: 'white',
                                  },
                                  padding: '4px',
                                  margin: '4px',
                                }}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>

                              {index === 0 && (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    backgroundColor: 'rgba(25, 118, 210, 0.9)',
                                    color: 'white',
                                    padding: '2px 4px',
                                    fontSize: '10px',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  MAIN IMAGE
                                </Box>
                              )}

                              <img
                                src={img}
                                alt={`preview ${index + 1}`}
                                width="120"
                                height="120"
                                style={{ 
                                  objectFit: "cover", 
                                  display: 'block',
                                  opacity: snapshot.isDragging ? 0.8 : 1
                                }}
                              />
                            </Box>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Brand"
              name="brand"
              value={productData.brand}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={productData.title}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Color"
              name="color"
              value={productData.color}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              value={productData.quantity}
              onChange={handleChange}
              type="number"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              value={productData.price}
              onChange={handleChange}
              type="number"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Discounted Price"
              name="discountedPrice"
              value={productData.discountedPrice}
              onChange={handleChange}
              type="number"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Discount Percentage"
              name="discountPersent"
              value={productData.discountPersent}
              onChange={handleChange}
              type="number"
            />
          </Grid>

          <Grid item xs={6} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Top Level Category</InputLabel>
              <Select
                name="topLavelCategory"
                value={productData.topLavelCategory}
                onChange={(e) => {
                  handleChange(e);
                  setProductData((prev) => ({
                    ...prev,
                    secondLavelCategory: "",
                    thirdLavelCategory: "",
                  }));
                }}
              >
                {Object.keys(categoryHierarchy).map((topKey) => (
                  <MenuItem key={topKey} value={topKey}>
                    {topKey.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={4}>
            <FormControl fullWidth disabled={!productData.topLavelCategory}>
              <InputLabel>Second Level Category</InputLabel>
              <Select
                name="secondLavelCategory"
                value={productData.secondLavelCategory}
                onChange={(e) => {
                  handleChange(e);
                  setProductData((prev) => ({
                    ...prev,
                    thirdLavelCategory: "",
                  }));
                }}
              >
                {secondLevelOptions.map((secondKey) => (
                  <MenuItem key={secondKey} value={secondKey}>
                    {secondKey.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={4}>
            <FormControl fullWidth disabled={!productData.secondLavelCategory}>
              <InputLabel>Third Level Category</InputLabel>
              <Select
                name="thirdLavelCategory"
                value={productData.thirdLavelCategory}
                onChange={handleChange}
              >
                {thirdLevelOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              name="description"
              rows={3}
              onChange={handleChange}
              value={productData.description}
            />
          </Grid>

          {productData.size.length > 0 ? (
            <>
              {productData.size.map((size, index) => (
                <Grid container item spacing={3} key={index}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Size Name"
                      name="name"
                      value={size.name}
                      onChange={(event) => handleSizeChange(event, index)}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Quantity"
                      name="size_quantity"
                      type="number"
                      value={size.quantity}
                      onChange={(event) => handleSizeChange(event, index)}
                      required
                      fullWidth
                    />
                  </Grid>
                </Grid>
              ))}
              {!sizeChart && (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    onClick={handleAddSize}
                    sx={{ mt: 1 }}
                  >
                    + Add Another Size
                  </Button>
                </Grid>
              )}
            </>
          ) : (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity (Free Size)"
                name="quantity"
                type="number"
                value={productData.quantity}
                onChange={handleChange}
                required
              />
            </Grid>
          )}

          {sizeChart && (
            <Box mt={2}>
              <Typography variant="h6">Size Chart</Typography>
              <table className="sizeChartTable">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Bust</th>
                    <th>Waist</th>
                    <th>Hips</th>
                    <th>Length</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChart.sizes.map((s) => (
                    <tr key={s.label}>
                      <td>{s.label}</td>
                      <td>{s.bust || "-"}</td>
                      <td>{s.waist || "-"}</td>
                      <td>{s.hips || "-"}</td>
                      <td>{s.length || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}

          <Grid item xs={12}>
            <Button
              variant="contained"
              sx={{ p: 1.8 }}
              className="py-20"
              size="large"
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Product"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Fragment>
  );
};

export default UpdateProductForm;
