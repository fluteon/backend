import { useState } from "react";
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

import { Fragment } from "react";
import "./CreateProductForm.css";
import { useDispatch } from "react-redux";
import { createProduct } from "../../../Redux/Customers/Product/Action";

const initialSizes = [
  { name: "S", quantity: 0 },
  { name: "M", quantity: 0 },
  { name: "L", quantity: 0 },
];

const CreateProductForm = () => {
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
    size: initialSizes,
    quantity: "",
    topLavelCategory: "",
    secondLavelCategory: "",
    thirdLavelCategory: "",
    description: "",
  });
const dispatch=useDispatch();
const jwt=localStorage.getItem("jwt")

const handleImageUpload = (e) => {
  const files = Array.from(e.target.files).slice(0, 4); // only first 4 files
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
    name==="size_quantity"?name="quantity":name=e.target.name;

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

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   dispatch(createProduct({data:productData,jwt}))
  //   console.log(productData);
  // };

  const handleSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData();

  // Append product fields
  for (let key in productData) {
    if (key === "size") {
      formData.append("size", JSON.stringify(productData.size));
    } else {
      formData.append(key, productData[key]);
    }
  }

  // Append images
  images.forEach((image) => {
    formData.append("images", image);
  });

  dispatch(createProduct({ data: formData, jwt }));
};

  return (
    <Fragment className="createProductContainer ">
      <Typography
        variant="h3"
        sx={{ textAlign: "center" }}
        className="py-10 text-center "
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
  <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
    {previewImages.map((img, index) => (
      <img key={index} src={img} alt="preview" width="100" height="100" style={{ objectFit: 'cover', borderRadius: 4 }} />
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
                onChange={handleChange}
                label="Top Level Category"
              >
                <MenuItem value="men">Men</MenuItem>
                <MenuItem value="women">Women</MenuItem>
                <MenuItem value="kids">Kids</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Second Level Category</InputLabel>
              <Select
                name="secondLavelCategory"
                value={productData.secondLavelCategory}
                onChange={handleChange}
                label="Second Level Category"
              >
                <MenuItem value="bottom_wear">Bottom Wear</MenuItem>
                <MenuItem value="shirts">Shirts</MenuItem>
                <MenuItem value="tops">Tops</MenuItem>
                <MenuItem value="kurtis">Kurtis</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Third Level Category</InputLabel>
              <Select
                name="thirdLavelCategory"
                value={productData.thirdLavelCategory}
                onChange={handleChange}
                label="Third Level Category"
              >
                <MenuItem value="formal_pants">Formal Pants</MenuItem>
                <MenuItem value="cotton_pants">Cotton Pants</MenuItem>
                <MenuItem value="linen_pants">Linen Pants</MenuItem>
                <MenuItem value="cargos">Cargo</MenuItem>
                <MenuItem value="track_pants">Track Pants</MenuItem>
                <MenuItem value="jeans">Jeans</MenuItem>
                <MenuItem value="formal_shirts">Formal Shirts</MenuItem>
                <MenuItem value="satin_shirts">Satin Shirts</MenuItem>
                <MenuItem value="hidden_button_shirts">Hidden Button Shirts</MenuItem>
                <MenuItem value="tanic_tops">Tanic Top</MenuItem>
                <MenuItem value="tank_tops">Tank Top</MenuItem>
                <MenuItem value="peplum_tops">Peplum Top</MenuItem>
                <MenuItem value="crop_tops">Crop Tops</MenuItem>
                <MenuItem value="office_wear_kurtis">Office Wear</MenuItem>
                <MenuItem value="a_line_kurtis">A-Line-Kurtis</MenuItem>
                <MenuItem value="kalamkari">Kalamkari Kurti</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="outlined-multiline-static"
              label="Description"
              multiline
              name="description"
              rows={3}
              onChange={handleChange}
              value={productData.description}
            />
          </Grid>
          {productData.size.map((size, index) => (
            <Grid container item spacing={3} >
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
                  onChange={(event) => handleSizeChange(event, index)}
                  required
                  fullWidth
                />
              </Grid> </Grid>
            
          ))}
          <Grid item xs={12} >
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
