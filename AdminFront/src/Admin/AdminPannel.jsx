import * as React from "react";
import {Box,Avatar} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import { ThemeProvider } from "@emotion/react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ListItemIcon from "@mui/material/ListItemIcon";
import { customTheme } from "./them/customeThem";
import AdminNavbar from "./Navigation/AdminNavbar";
import Dashboard from "./Views/Admin";
import { Route, Routes, useNavigate } from "react-router-dom";
import DemoAdmin from "./Views/DemoAdmin";
import CreateProductForm from "./componets/createProduct/CreateProductFrom";
import "./AdminPannel.css";
import ProductsTable from "./componets/Products/ProductsTable";
import OrdersTable from "./componets/Orders/OrdersTable";
import Customers from "./componets/customers/customers";
import UpdateProductForm from "./componets/updateProduct/UpdateProduct";
import { useDispatch } from "react-redux";
import { getUser, logout } from "../Redux/Auth/Action";
import { useEffect } from "react";
import { deepPurple } from "@mui/material/colors";
import Coupan from "./componets/Coupan/Coupan";
import ReviewsTable from "./componets/Reviews/ReviewsTable";
import HomepageSections from "./componets/Homepage/HomepageSections";
import CategoryManagement from "./componets/CategoryManagement/CategoryManagement";
import { auth } from "../firebase";

const drawerWidth = 240;

const menu = [
  { name: "Dashboard", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Customers", path: "/customers" },
  { name: "Orders", path: "/orders" },
  { name: "Reviews", path: "/reviews" },
  { name: "Homepage Sections", path: "/homepage-sections" },
  { name: "Categories", path: "/categories" },
  { name: "Add Product", path: "/product/create" },
  { name: "Add Coupan Code", path: "/coupan"}
];


export default function AdminPannel() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [sideBarVisible, setSideBarVisible] = React.useState(false);
  const navigate=useNavigate();
  const dispatch=useDispatch();

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await auth.signOut();
      console.log('✅ Signed out from Firebase');
    } catch (error) {
      console.error('❌ Firebase signout error:', error);
    }
    
    // Clear all storage and dispatch logout
    sessionStorage.clear();
    localStorage.clear();
    dispatch(logout());
    navigate("/")
  };

  const jwt = sessionStorage.getItem("jwt");

  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt));
    }
  }, [jwt, dispatch]);

  const drawer = (
    <Box
      sx={{
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {isLargeScreen && <Toolbar />}
      <List>
        {menu.map((item, index) => (
          <ListItem key={item.name} disablePadding onClick={()=>navigate(item.path)}>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List sx={{ position: "absolute", bottom: 0, width: "100%" }}>
        <Divider />
       
        <ListItem onClick={handleLogout}  disablePadding >
            <ListItemButton>
            <Avatar
  className="text-white"
  onClick={handleLogout}
  sx={{
    bgcolor: deepPurple[500],
    color: "white",
    cursor: "pointer",
  }}
>
  {(auth?.user?.firstName?.[0] || "A").toUpperCase()}
</Avatar>
              {/* <ListItemText className="ml-5" primary={"Logout"} /> */}
            </ListItemButton>
          </ListItem>
        
      </List>
    </Box>
  );

  const handleSideBarViewInMobile = () => {
    setSideBarVisible(true);
  };

  const handleCloseSideBar = () => {
    setSideBarVisible(false);
  };

  const drawerVariant = isLargeScreen ? "permanent" : "temporary";

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ display: `${isLargeScreen ? "flex" : "block"}` }}>
        <CssBaseline />
        <AdminNavbar handleSideBarViewInMobile={handleSideBarViewInMobile} />

        <Drawer
          variant={drawerVariant}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              ...(drawerVariant === "temporary" && {
                top: 0,
                [`& .MuiPaper-root.MuiDrawer-paperAnchorTop.MuiDrawer-paperTemporary`]:
                  {
                    position: "fixed",
                    left: 0,
                    right: 0,
                    height: "100%",
                    zIndex: (theme) => theme.zIndex.drawer + 2,
                  },
              }),
            },
          }}
          open={isLargeScreen || sideBarVisible}
          onClose={handleCloseSideBar}
        >
          {drawer}
        </Drawer>
        <Box className="adminContainer" component="main" sx={{ flexGrow: 1 }}>
          <Toolbar />
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="product/create" element={<CreateProductForm />} />
  <Route path="product/update/:productId" element={<UpdateProductForm />} />
  <Route path="products" element={<ProductsTable />} />
  <Route path="orders" element={<OrdersTable />} />
  <Route path="customers" element={<Customers />} />
  <Route path="reviews" element={<ReviewsTable />} />
  <Route path="homepage-sections" element={<HomepageSections />} />
  <Route path="categories" element={<CategoryManagement />} />
  <Route path="demo" element={<DemoAdmin />} />
  <Route path="coupan" element={<Coupan />} />
</Routes>


        </Box>
      </Box>
    </ThemeProvider>
  );
}
