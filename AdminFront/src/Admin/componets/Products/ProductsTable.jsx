import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, findProducts } from "../../../Redux/Customers/Product/Action";
import Tooltip from "@mui/material/Tooltip";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import LowStockModal from "../Orders/LowStockModal";

// Category hierarchy for filtering
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

const ProductsTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customersProduct } = useSelector((store) => store);
  const [filterValue, setFilterValue] = useState({
    availability: "",
    topLevelCategory: "",
    secondLevelCategory: "",
    thirdLevelCategory: "",
    sort: "",
  });


  // query 
  const searchParams = new URLSearchParams(location.search);
  const availability = searchParams.get("availability");
  const topLevelCategory = searchParams.get("topLevelCategory");
  const secondLevelCategory = searchParams.get("secondLevelCategory");
  const thirdLevelCategory = searchParams.get("thirdLevelCategory");
  const sort = searchParams.get("sort");
  const page = searchParams.get("page");


const handlePaginationChange = (event, value) => {
  searchParams.set("page", value); // ✅ Use 1-based value for consistency
  const query = searchParams.toString();
  navigate({ search: `?${query}` });
};


  useEffect(() => {
    setFilterValue({
      availability: availability || "",
      topLevelCategory: topLevelCategory || "",
      secondLevelCategory: secondLevelCategory || "",
      thirdLevelCategory: thirdLevelCategory || "",
      sort: sort || "price_low",
    });
    
    // Use third level category for filtering if available, otherwise use second level
    const categoryFilter = thirdLevelCategory || secondLevelCategory || "";
    
    const data = {
      category: categoryFilter,
      colors: [],
      sizes: [],
      minPrice: 0,
      maxPrice: 100000,
      minDiscount: 0,
      sort: sort || "price_low",
      pageNumber: parseInt(page || 1),
      pageSize: 10,
      stock: availability,
    };
    
    console.log("🔄 Fetching products with filters:", data);
    dispatch(findProducts(data));
    
    // Clear navigation state after using it
    if (location.state?.refreshProducts) {
      window.history.replaceState({}, document.title);
    }
  }, [availability, topLevelCategory, secondLevelCategory, thirdLevelCategory, sort, page, customersProduct.deleteProduct, customersProduct.updateProduct, location.state, dispatch]);

const handleFilterChange = (e, sectionId) => {
  const newValue = e.target.value;
  
  // When top level changes, reset second and third level
  if (sectionId === "topLevelCategory") {
    setFilterValue((values) => ({
      ...values,
      topLevelCategory: newValue,
      secondLevelCategory: "",
      thirdLevelCategory: ""
    }));
    searchParams.set("topLevelCategory", newValue);
    searchParams.delete("secondLevelCategory");
    searchParams.delete("thirdLevelCategory");
  }
  // When second level changes, reset third level
  else if (sectionId === "secondLevelCategory") {
    setFilterValue((values) => ({
      ...values,
      secondLevelCategory: newValue,
      thirdLevelCategory: ""
    }));
    searchParams.set("secondLevelCategory", newValue);
    searchParams.delete("thirdLevelCategory");
  }
  // For other filters (thirdLevelCategory, availability, sort)
  else {
    setFilterValue((values) => ({ ...values, [sectionId]: newValue }));
    searchParams.set(sectionId, newValue);
  }
  
  searchParams.set("page", 1); // reset to page 1
  const query = searchParams.toString();
  navigate({ search: `?${query}` });
};


  const handleDeleteProduct=(productId)=>{
    console.log("delete product ",productId)
    dispatch(deleteProduct(productId))
  }
console.log("🛍️ All Products from Redux:", customersProduct);

const handleUpdateProduct = (product)=>{
  navigate("/product/create", {state:{product}})
}

const [openModalSizes, setOpenModalSizes] = useState([]);
const [isModalOpen, setIsModalOpen] = useState(false);

const handleOpenModal = (sizes) => {
  setOpenModalSizes(sizes);
  setIsModalOpen(true);
};


  return (
    <Box width={"100%"}>
      <Card className="p-3">
        <CardHeader
          title="Sort"
          sx={{
            pt: 0,
            alignItems: "center",
            "& .MuiCardHeader-action": { mt: 0.6 },
          }}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="top-level-category-label">Top Category</InputLabel>
              <Select
                labelId="top-level-category-label"
                id="top-level-category"
                value={filterValue.topLevelCategory}
                label="Top Category"
                onChange={(e) => handleFilterChange(e, "topLevelCategory")}
              >
                <MenuItem value="">All</MenuItem>
                {Object.keys(categoryHierarchy).map((topKey) => (
                  <MenuItem key={topKey} value={topKey}>
                    {topKey.charAt(0).toUpperCase() + topKey.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth disabled={!filterValue.topLevelCategory}>
              <InputLabel id="second-level-category-label">Second Category</InputLabel>
              <Select
                labelId="second-level-category-label"
                id="second-level-category"
                value={filterValue.secondLevelCategory}
                label="Second Category"
                onChange={(e) => handleFilterChange(e, "secondLevelCategory")}
              >
                <MenuItem value="">All</MenuItem>
                {filterValue.topLevelCategory &&
                  Object.keys(categoryHierarchy[filterValue.topLevelCategory]).map(
                    (secondKey) => (
                      <MenuItem key={secondKey} value={secondKey}>
                        {secondKey.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </MenuItem>
                    )
                  )}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth disabled={!filterValue.secondLevelCategory}>
              <InputLabel id="third-level-category-label">Third Category</InputLabel>
              <Select
                labelId="third-level-category-label"
                id="third-level-category"
                value={filterValue.thirdLevelCategory}
                label="Third Category"
                onChange={(e) => handleFilterChange(e, "thirdLevelCategory")}
              >
                <MenuItem value="">All</MenuItem>
                {filterValue.topLevelCategory &&
                  filterValue.secondLevelCategory &&
                  categoryHierarchy[filterValue.topLevelCategory][filterValue.secondLevelCategory].map(
                    (thirdOption) => (
                      <MenuItem key={thirdOption.value} value={thirdOption.value}>
                        {thirdOption.label}
                      </MenuItem>
                    )
                  )}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Availability
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filterValue.availability}
                label="Availability"
                onChange={(e) => handleFilterChange(e, "availability")}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value={"in_stock"}>Instock</MenuItem>
                <MenuItem value={"out_of_stock"}>Out Of Stock</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Sort By Price
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filterValue.sort}
                label="Sort By Price"
                onChange={(e) => handleFilterChange(e, "sort")}
              >
                <MenuItem value={"price_high"}>High - Low</MenuItem>
                <MenuItem value={"price_low"}>Low - High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>
      <Card className="mt-2">
        <CardHeader
          title="All Products"
          sx={{
            pt: 2,
            alignItems: "center",
            "& .MuiCardHeader-action": { mt: 0.6 },
          }}
        />
        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Category</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Price</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Quantity</TableCell>
                <TableCell sx={{ textAlign: "center "}}>Update</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customersProduct?.products?.content?.map((item) => (
<TableRow
  hover
  key={item.name}
  sx={{
    backgroundColor: item.sizes?.some(size => size.quantity < 2)
      ? "#fff3cd" // light warning yellow
      : "inherit",
    color: item.sizes?.some(size => size.quantity < 2)
      ? "#000" // black text for warning rows
      : "inherit",
    "& td": {
      color: item.sizes?.some(size => size.quantity < 2) ? "#000" : "inherit",
    },
    "&:last-of-type td, &:last-of-type th": { border: 0 },
  }}
>


                  <TableCell>
                    {" "}
                    <Avatar alt={item.titel} src={item.imageUrl?.[0]} />{" "}
                  </TableCell>

                  <TableCell
                    sx={{ py: (theme) => `${theme.spacing(0.5)} !important` }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: "0.875rem !important",
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography variant="caption">{item.brand}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{item.category.name}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{item.discountedPrice}</TableCell>
                  {/* <TableCell sx={{ textAlign: "center" }}>{item.quantity}</TableCell> */}
<TableCell sx={{ textAlign: "center" }}>
  {item.quantity}
  {item.sizes?.some((size) => size.quantity < 2) && (
    <Tooltip title="Click to view low stock sizes">
      <WarningAmberIcon
        color="warning"
        sx={{ ml: 1, fontSize: 20, cursor: "pointer" }}
        onClick={() => handleOpenModal(item.sizes)}
      />
    </Tooltip>
  )}
</TableCell>


                  <TableCell sx={{ textAlign: "center"}}>
                    <Button varient="text" onClick={()=>handleUpdateProduct(item)}> Update</Button>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Button variant="text" onClick={()=>handleDeleteProduct(item._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Card className="mt-2 border">
        {/* <Pagination
          className="py-5 border w-auto"
          size="large"
          count={10}
          color="primary"
          onChange={handlePaginationChange}
        /> */}

        <div className="mx-auto px-4 py-5 flex justify-center shadow-lg rounded-md">
          <Pagination
            count={customersProduct.products?.totalPages}
            color="primary"
            className=""
            onChange={handlePaginationChange}
            // value={page}
          />
        </div>
      </Card>
      <LowStockModal
  open={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  sizes={openModalSizes}
/>

    </Box>
  );
};

export default ProductsTable;
