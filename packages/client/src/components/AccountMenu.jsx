import * as React from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
// import Settings from "@mui/icons-material/Settings";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Logout from "@mui/icons-material/Logout";
import { useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import Typography from '@mui/material/Typography';
import socket from "../socket";
import actions from "./state/actionCreators"

export default function AccountMenu() {
    const user = useSelector(state => state.user);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <React.Fragment>
            <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
                <Typography sx={{
                    pr: "15px",
                    fontSize: 20,
                }}>{useSelector(state => state.user.username)}</Typography>
                <Tooltip title="Account settings">
                    <IconButton
                        sx={{ justifyContent: 'right' }}
                        variant="text"
                        color="inherit"
                        onClick={handleClick}
                    >
                        <Avatar
                            hideBadge={true}
                            username={user.username}
                            avatar={user.avatar} />
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1
                        },
                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0
                        }
                    }
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem onClick={() => {
                    console.log("as")
                    navigate("/profile")
                }}>
                    <ListItemIcon>
                        <AccountCircle fontSize="small" />
                    </ListItemIcon>
                    Profile
                </MenuItem>
                {/* <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem> */}
                <MenuItem onClick={() => {
                    actions.setLoggedIn(false);
                    socket.disconnect();
                    return fetch("http://localhost:4000/auth/logout", {
                        method: "get",
                        credentials: "include",
                    })
                        .catch(err => {
                            console.log("errr")
                            return;
                        })
                        .then(res => {
                            console.log("logged out")
                            navigate("/login")
                            return;
                        })
                }}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}
