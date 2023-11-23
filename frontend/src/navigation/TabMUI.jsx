import { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import { Toolbar } from '@mui/material';
import { Link, Outlet, useMatch } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const mttLogo1 = 'src/images/mttLogo1.png';
const mttLogo2 = 'src/images/mttLogo2.png';

function TabMUI() {
  const [logo, setLogo] = useState(null);
  const { isAuthenticated, logout } = useAuth();
  const myEventsMatch = useMatch('/myevents');

  useEffect(() => {
    const random = Math.random();
    const selectedLogo = random < 0.5 ? mttLogo1 : mttLogo2;

    setLogo(selectedLogo);
  }, []);

  const tabValue = myEventsMatch ? 1 : 0;

  return (
    <>
      <AppBar position='sticky' sx={{ mt: 0, mb: '36px' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 0, verticalAlign: "left", bgcolor: "secondary.light" }}>
            {logo && (
              <Link to='/'>
                <img src={logo} alt="MTT Logo" style={{ height: '150px', width: 'auto', marginTop: "5px" }} />
              </Link>
            )}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Tabs value={tabValue} variant='fullWidth' centered selectionFollowsFocus textColor='inherit' TabIndicatorProps={{ style: { background: 'white' } }}>
              <Tab label='Home' component={Link} to='/' />
              {isAuthenticated && (
                <Tab label='My events' component={Link} to='myevents' />
              )}
            </Tabs>
          </Box>
          <Box>
            {isAuthenticated ? (
              <button title="Log out" onClick={logout}>Log out</button>
            ) : (
              <>
                <a href="/login">
                  <button title="Log in">Log in</button>
                </a>
                <a href="/register">
                  <button title="Register">Register</button>
                </a>
              </>
            )}
          </Box>
        </Toolbar>  
      </AppBar>
      <Outlet />
    </>
  );
}

export default TabMUI;
