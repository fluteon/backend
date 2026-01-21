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

const ProductsTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customersProduct } = useSelector((store) => store);
  const [filterValue, setFilterValue] = useState({
    availability: "",
    category: "",
    sort: "",
  });


  // query 
  const searchParams = new URLSearchParams(location.search);
  const availability = searchParams.get("availability");
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");
  const page = searchParams.get("page");


const handlePaginationChange = (event, value) => {
  searchParams.set("page", value); // ✅ Use 1-based value for consistency
  const query = searchParams.toString();
  navigate({ search: `?${query}` });
};


  useEffect(() => {
    // setFilterValue({ availability, category, sort });
      setFilterValue({
    availability: availability || "",
    category: category || "",
    sort: sort || "price_low",
  });
    const data = {
      category:category || "",
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
    dispatch(findProducts(data));
  }, [availability, category, sort,page,customersProduct.deleteProduct, dispatch]);

const handleFilterChange = (e, sectionId) => {
  const newValue = e.target.value;
  setFilterValue((values) => ({ ...values, [sectionId]: newValue }));
  searchParams.set(sectionId, newValue);
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
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filterValue.category}
                label="Category"
                onChange={(e) => handleFilterChange(e, "category")}
              >
                <MenuItem value={"blazer"}>Blazer</MenuItem>
                <MenuItem value={"blazers_sets"}>Blazer Sets</MenuItem>
                <MenuItem value={"cotton_pants"}>Cotton Pants</MenuItem>
                <MenuItem value={"formal_pants"}>Formal Pants</MenuItem>
                <MenuItem value={"saree"}>Saree</MenuItem>
                <MenuItem value={"lengha_choli"}>Lengha Choli</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
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
                <MenuItem value={"All"}>All</MenuItem>
                <MenuItem value={"in_stock"}>Instock</MenuItem>
                <MenuItem value={"out_of_stock"}>Out Of Stock</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
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
                <MenuItem value={"price_high"}>Heigh - Low</MenuItem>
                <MenuItem value={"price_low"}>Low - Heigh</MenuItem>
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
