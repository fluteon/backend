// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { Avatar, CardHeader, Pagination } from '@mui/material'
import {allUser} from "../../../Redux/Auth/Action"
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'


const Customers = () => {
const [searchParams, setSearchParams] = useSearchParams();
const page = Number(searchParams.get("page")) || 1;
const dispatch = useDispatch()
  const { userList, isLoading, currentPage, totalPages } = useSelector((store) => store.auth);

console.log("👥 Customers Page - Redux State:", {
  userListCount: userList?.length,
  currentPage,
  totalPages,
  isLoading,
  page,
  userList: userList?.slice(0, 2) // Show first 2 users for debugging
});

function handlePaginationChange(event, value) {
  setSearchParams({ page: value.toString() });
}

  useEffect(() => {
  console.log("🔄 Fetching users for page:", page);
  dispatch(allUser(page)); // <-- pass page number to action
}, [dispatch, page]);
  return (
    <Box>
         <Card>
      <CardHeader
          title='All Customers'
          sx={{ pt: 2, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
          
        />
      <TableContainer>
        <Table sx={{ minWidth: 390 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
            <TableCell>User Id</TableCell>
            <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userList?.map((item,index) => (
              <TableRow hover key={item._id || index} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                <TableCell>
                  <Avatar alt={`${item.firstName} ${item.lastName}`} src={item.image}>
                    {item.firstName?.[0]}{item.lastName?.[0]}
                  </Avatar>
                </TableCell>
                <TableCell>{`${item.firstName} ${item.lastName}`}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  {item.createdAt 
                    ? new Date(item.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'N/A'
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
    <Card className="mt-2 felx justify-center items-center">
<Pagination
  className="py-5 w-auto"
  size="large"
  count={totalPages || 10}
  page={page}
  color="primary"
  onChange={handlePaginationChange}
/>
      </Card>
    </Box>
   
  )
}

export default Customers;
