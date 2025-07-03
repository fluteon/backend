import { useEffect, useState, Fragment } from "react";
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
} from "@mui/material";

import "./CreateProductForm.css";
import { useDispatch } from "react-redux";
import { createProduct } from "../../../Redux/Customers/Product/Action";
import api, { API_BASE_URL } from "../../../config/api";
const categoryHierarchy = {
  women: {
    bottom_wear: [
      { value: "formal_pants", label: "Formal Pants" },
      { value: "cotton_pants", label: "Cotton Pants" },
      { value: "linen_pants", label: "Linen Pants" },
      { value: "cargos", label: "Cargo" },
      { value: "track_pants", label: "Track Pants" },
      { value: "jeans", label: "Jeans" },
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
  },
  kids: {
    bottom_wear: [],
    tops: [],
    kurtis: [],
  },
};

const CreateProductForm = () => {
  
  const [sizeChart, setSizeChart] = useState(null);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

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

  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    for (let key in productData) {
      if (key === "size") {
        formData.append("size", JSON.stringify(productData.size));
      } else {
        formData.append(key, productData[key]);
      }
    }

    images.forEach((image) => {
      formData.append("images", image);
    });

    dispatch(createProduct({ data: formData, jwt }));
  };

useEffect(() => {
  if (productData.thirdLavelCategory) {
   fetch(`${API_BASE_URL}/api/admin/products/${productData.thirdLavelCategory}`)

      .then((res) => res.json())
      .then((data) => {
        console.log("Size chart response:", data);
        const formattedSizes = data.sizes.map((sizeObj) => ({
          name: sizeObj.label,
          quantity: 0,
        }));
        setSizeChart(data);
        setProductData((prevState) => ({
          ...prevState,
          size: formattedSizes,
        }));
      })
      .catch(() => {
        setSizeChart(null);
        setProductData((prevState) => ({
          ...prevState,
          size: [],
        }));
      });
  }
}, [productData.thirdLavelCategory]);

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
      <Typography
        variant="h3"
        sx={{ textAlign: "center" }}
        className="py-10 text-center"
      >
        Add New Product
      </Typography>
      <form
        onSubmit={handleSubmit}
        className="createProductContainer min-h-screen"
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <input
              type="file"
              accept="image/*"
              name="images"
              multiple
              onChange={(e) => handleImageUpload(e)}
            />
            <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
              {previewImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="preview"
                  width="100"
                  height="100"
                  style={{ objectFit: "cover", borderRadius: 4 }}
                />
              ))}
            </Box>
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
            >
              Add New Product
            </Button>
          </Grid>
        </Grid>
      </form>
    </Fragment>
  );
};

export default CreateProductForm;
