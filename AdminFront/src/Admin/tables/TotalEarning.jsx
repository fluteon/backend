import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuUp from 'mdi-material-ui/MenuUp'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import { useSelector } from 'react-redux'

const TotalEarning = ({ amount = 0 }) => {
  const { topCategories = [] } = useSelector(state => state.adminsOrder.overview || {});

  return (
    <Card>
      <CardHeader
        title='Total Earnings'
        titleTypographyProps={{ sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' } }}
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(1.5)} !important` }}>
        <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
          <Typography variant='h4' sx={{ fontWeight: 600, fontSize: '2.125rem !important' }}>
            ₹{amount.toLocaleString()}
          </Typography>
          {/* Example: Add growth data later */}
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main', ml: 2 }}>
            <MenuUp sx={{ fontSize: '1.875rem', verticalAlign: 'middle' }} />
            <Typography variant='body2' sx={{ fontWeight: 600, color: 'success.main' }}>
              +12%
            </Typography>
          </Box>
        </Box>

        <Typography component='p' variant='caption' sx={{ mb: 5 }}>
          Compared to last year
        </Typography>

        {topCategories.length > 0 ? topCategories.map((item, index) => (
          <Box
            key={item.title}
            sx={{
              display: 'flex',
              alignItems: 'center',
              ...(index !== topCategories.length - 1 ? { mb: 4 } : {})
            }}
          >
            <Avatar variant='rounded' sx={{ mr: 3, width: 40, height: 40 }}>
              <img src={item.imgSrc} alt={item.title} height={item.imgHeight || 25} />
            </Avatar>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ mr: 2 }}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {item.title}
                </Typography>
                <Typography variant='caption'>{item.subtitle}</Typography>
              </Box>
              <Box sx={{ minWidth: 85 }}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  ₹{item.amount.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Box>
        )) : (
          <Typography variant='body2'>No top category data available.</Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default TotalEarning