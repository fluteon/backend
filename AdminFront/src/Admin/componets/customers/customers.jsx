// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import { Avatar, CardHeader, Pagination } from '@mui/material'
import {allUser} from "../../../Redux/Auth/Action"
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'


const Customers = () => {
const [searchParams, setSearchParams] = useSearchParams();
const page = Number(searchParams.get("page")) || 1;
const dispatch = useDispatch()
  const { userList, isLoading, currentPage, totalPages } = useSelector((store) => store.auth);

console.log("customers...",userList)
  const navigate=useNavigate();

function handlePaginationChange(event, value) {
  setSearchParams({ page: value.toString() });
}

  //   useEffect(() => {
  //   dispatch(allUser());
  // }, [dispatch]);

  useEffect(() => {
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
              
            </TableRow>
          </TableHead>
          <TableBody>
            {userList?.map((item,index) => (
              <TableRow hover key={item.name} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                <TableCell>{index+1}</TableCell>
                <TableCell> <Avatar alt={item.name} src={item.image} /> </TableCell>
      <TableCell>{`${item.firstName} ${item.lastName}`}</TableCell>
                <TableCell>{item.email}</TableCell>
                
                
               
               
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
