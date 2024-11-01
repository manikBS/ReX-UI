 
import * as React from "react";
import { AppBar, Toolbar, Typography, Button, MenuItem, Menu, IconButton } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

export interface HeaderProps {}

const pages= [
    {
        title: "Templates",
        href: "/"
    },{
        title: "Template Builder",
        href: "/builder"
    },
];

const Header: React.FC<HeaderProps> = () => {
  const dipatch = useDispatch();
    const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSettings = () => {
        // Add logic for handling settings button click
        handleClose();
    };

    const handleProfile = () => {
        // Add logic for handling profile button click
        handleClose();
    };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <img src={require("./../../../assets/logo-64.png")} alt="Logo" style={{ height: 30, marginRight: 16 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, maxWidth: "fit-content" }}>
            ReX
          </Typography>
          {pages.map(page => (
            <Button key={page.title} 
                    component={Link}
                    to={page.href} 
                    sx={{ my: 2, color: "white", display: "block" }}>
              {page.title}
            </Button>
          ))}
            <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleClick}
                sx={{ ml: 2 }}
            >
                {user && user.picture ? (
                    <img src={user.picture} alt="Profile" style={{ borderRadius: '50%', width: '32px', height: '32px' }} />
                ) : (
                    <AccountCircleIcon />
                )}
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {isAuthenticated ? (
                    <>
                        <MenuItem onClick={handleProfile}>Profile</MenuItem>
                        <MenuItem onClick={handleSettings}>Settings</MenuItem>
                        <MenuItem onClick={() => logout()}>Logout</MenuItem>
                    </>
                ) : (
                    <MenuItem onClick={() => loginWithRedirect()}>Login</MenuItem>
                )}
            </Menu>  
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
