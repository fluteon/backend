// ** MUI Imports
import Grid from "@mui/material/Grid";
import AdminPannel from "../../Styles/AdminPannelWrapper";
import Achivement from "../tables/Achivement";
import MonthlyOverview from "../tables/MonthlyOverView";
import SalesOverview from "../tables/WeeklyOverview"; // Renamed for clarity
import TotalEarning from "../tables/TotalEarning";
import CardStatsVertical from "../../Styles/CardStatsVertical";
import CustomersTable from "../tables/CustomersTable";
import { ThemeProvider, createTheme } from "@mui/material";
import { customTheme } from "../them/customeThem";
import "./Admin.css";
import RecentlyAddeddProducts from "../tables/RecentlyAddeddProducts";
import SalesOverTime from "../tables/SalesOverTime";
import RecentOrders from "../tables/RecentOrders";
import { Box, Card, CardContent, Typography } from "@mui/material"; // Added Box, Card, CardContent, Typography for better structure
import { BriefcaseVariantOutline, HelpCircleOutline, Poll, CurrencyUsd } from "mdi-material-ui";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardOverview } from "../../../src/Redux/Admin/Orders/Action";
import { useEffect } from "react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { overview, loading, error } = useSelector((state) => state.adminsOrder);

  useEffect(() => {
    dispatch(fetchDashboardOverview());
  }, [dispatch]);

  return (
    <div className="adminContainer">
      <ThemeProvider theme={customTheme}>
        <AdminPannel>
          <Grid container spacing={3}> {/* Increased spacing for better visual separation */}

            {/* Top Row: Achievement & Monthly Overview */}
            <Grid item xs={12} md={4}>
              <Achivement sales={overview?.totalRevenue} />
            </Grid>
            <Grid item xs={12} md={8}>
              <MonthlyOverview overview={overview} />
            </Grid>

            {/* Second Row: Sales Overview, Total Earnings, and Stats Cards */}
            {/* Using a nested Grid container for better alignment and equal height management */}
            <Grid container item xs={12} spacing={3} alignItems="stretch"> {/* Increased spacing here too */}
       <Grid item xs={12} md={6} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
  <Box sx={{ flexGrow: 1 }}>
    <SalesOverview overview={overview} />
  </Box>
</Grid>

<Grid item xs={12} md={6} lg={4} sx={{ display: 'flex' }}>
  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
    <Card sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <TotalEarning 
          amount={overview?.totalRevenue}
          lastYearAmount={overview?.lastYearRevenue}
          topCategories={overview?.topCategories || []}
        />
      </CardContent>
    </Card>
  </Box>
</Grid>


              <Grid item xs={12} md={12} lg={4} sx={{ display: 'flex' }}> {/* Changed md to 12 for better stacking on medium screens */}
                {/* Wrapped the CardStatsVertical in a single Card to give it a unified look */}
                <Card sx={{ flexGrow: 1 }}> {/* Card will expand to fill available space */}
                  <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Key Metrics
                    </Typography>
                    <Grid container spacing={2} sx={{ flexGrow: 1 }}> {/* This grid will fill the card content */}
                      <Grid item xs={6}>
                        <CardStatsVertical
                          stats={`$${overview?.totalProfit || 0}`}
                          icon={<Poll />}
                          color="success"
                          trendNumber="+42%"
                          title="Total Profit"
                          subtitle="Weekly Profit"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <CardStatsVertical
                          stats={`$${overview?.totalRefund || 0}`}
                          title="Refunds"
                          trend="negative"
                          color="secondary"
                          trendNumber="-15%"
                          subtitle="Past Month"
                          icon={<CurrencyUsd />}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <CardStatsVertical
                          stats={`${overview?.weeklyOrderCount || 0}`}
                          trend="positive"
                          trendNumber="+12%"
                          title="New Orders"
                          subtitle="Weekly Orders"
                          icon={<BriefcaseVariantOutline />}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <CardStatsVertical
                          stats={`${overview?.totalQueries || 0}`}
                          color="warning"
                          trend="neutral"
                          trendNumber="--"
                          subtitle="Last Week"
                          title="Sales Queries"
                          icon={<HelpCircleOutline />}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Third Row: Customers Table & Recent Orders */}
<Grid item xs={12} md={6} lg={4}>
  <CustomersTable customers={overview?.recentUsers || []} />
</Grid>

<Grid item xs={12} md={6} lg={8}>
  <RecentOrders orders={overview?.recentOrders || []} />
</Grid>


            {/* Fourth Row: Recently Added Products & Sales Over Time */}
            <Grid item xs={12} md={6} lg={8}> {/* md to 6, lg to 8 */}
              <RecentlyAddeddProducts />
            </Grid>
            <Grid item xs={12} md={6} lg={4}> {/* md to 6, lg to 4 */}
              <SalesOverTime />
            </Grid>

            {/* Example of a full-width table if needed at the bottom */}
            {/* If you intend to have two CustomersTable, consider if one is enough or rename them for clarity */}
            {/* <Grid item xs={12}>
              <CustomersTable />
            </Grid> */}

          </Grid>
        </AdminPannel>
      </ThemeProvider>
    </div>
  );
};

export default Dashboard;