import { Box, Typography, Button } from '@mui/material'

export const NFTComponent = ({
  img, earn, type, mint
}: {
  img: string, earn: number, type: number, mint: (t: number) => void
}) => (
  <Box sx={{
    position: 'relative',
    padding: 5,
  }}>
    <Box sx={{
      border: '12px solid black',
      borderRadius: 8,
      display: 'flex',
      '& > img': {
        borderRadius: 4,
        height: '100%',
        width: '100%',
      }
    }}>
      <img alt="" src={img} />
    </Box>
    <Box sx={{
      position: 'absolute',
      height: '100%',
      width: '100%',
      top: 0,
      left: 0,
      display: 'flex',
    }}>
      <Box display='flex' flex={1} flexDirection='column' justifyContent='end'>
        <Button sx={{
          border: `8px solid black`,
          borderRadius: 4,
          p: 2,
          background: '#b622b5',
          '&:hover': {
            background: '#b622b5',
          }
        }}
        onClick={() => mint(type)}
        >
          <Typography color={'#fff'} fontSize={32}>
            Mint
          </Typography>
        </Button>
      </Box>
      <Box display='flex' flex={1} flexDirection='column'>
        <Box sx={{
          border: 8,
          borderRadius: 4,
          background: '#b622b5',
          px: 2,
          py: 1,
        }}>
          <Typography color={'#fff'} fontSize={22}>Earn: {earn}gh</Typography>
          <Typography color={'#fff'} fontSize={22}>Time: 24h</Typography>
        </Box>
      </Box>
    </Box>
  </Box>
)
