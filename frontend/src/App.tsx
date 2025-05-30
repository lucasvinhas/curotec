import ResourceList from './components/ResourceList';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// A simple theme for Material UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // A standard blue
    },
    secondary: {
      main: '#dc004e', // A standard pink
    },
  },
});

function App() {
  return (
    <Box sx={{ minHeight: '100vh', minWidth: '100vw', pt: 4, px: 2}}>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize CSS and apply baseline styles */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Resource Management Challenge
          </Typography>
        </Toolbar>
      </AppBar>
      <ResourceList />
    </ThemeProvider>
    </Box>
  );
}

export default App;
