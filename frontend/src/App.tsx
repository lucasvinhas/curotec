import React from 'react';
import ResourceList from './components/ResourceList';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

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
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize CSS and apply baseline styles */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Resource Management Challenge
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 2, mb: 2 }}>
        <ResourceList />
      </Container>
    </ThemeProvider>
  );
}

export default App;
