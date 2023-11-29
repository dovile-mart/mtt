//import './App.css'
//import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TabMUI from './navigation/TabMUI';
import FrontPage from './components/FrontPage';
import MyEvents from './components/MyEvents';
import LoginPage from './components/Login';
import RegisterPage from './components/Register';
import EventDetails from './components/EventDetails';
import AddEvent from './components/AddEvent';
import EditEvent from './components/EditEvent';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './components/AuthContext';

const mttTheme = createTheme({  //https://colorhunt.co/palette/164863427d9d9bbec8ddf2fd
  palette: {
    contrastThreshold: 4.5, //saavutettavuuteen???
    primary: {
      main: '#427D9D',
      //light: '#9BBEC8', // light: will be calculated from palette.primary.main,
      //dark: '#164863',  // dark: will be calculated from palette.primary.main,
      //contrastText: '#DDF2FD',  // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: '#9BBEC8',
      light: '#DDF2FD',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#164863',
    },
    components: {
      bgcolor:"#F1B4BB",
      color: "#FFF5E0",
      danger:"#FF6969",
      error: "#F8BB86",
      submit: "#A5DC86"
    }
  },
});


export default function App() {
  
  return (
    <ThemeProvider theme={mttTheme}>
      <CssBaseline />
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<TabMUI />}>
            <Route index element={<FrontPage />} />
            <Route path='myevents' element={<MyEvents />} />
            <Route path='login' element={<LoginPage />} />
            <Route path='register' element={<RegisterPage />} />
            <Route path='event/:eventId' element={<EventDetails />} />
            <Route path='addevent' element={<AddEvent />} />
            <Route path='editevent/:eventId' element={<EditEvent />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </AuthProvider>
      </ThemeProvider>

  )
}