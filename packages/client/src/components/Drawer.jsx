import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Button } from "@mui/material";
import { drawerItems } from "./utils/drawerItems";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./PrivateRoute";
import AccountMenu from "./AccountMenu";

const drawerWidth = 240;

const Content = styled(Box, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        // padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
        display: 'flex',
        flexDirection: 'column',
        overflowY: "hidden",
    }),
);

const ContentWrapper = styled(Box)({
    height: "calc(100vh - 64px)",

});
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    minHeight: '64px',
    justifyContent: 'flex-end',

}));


export default function PersistentDrawerLeft({ children }) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box id="parentbox" sx={{
            display: 'flex',
        }}>
            <AppBar id="appbar" position="fixed" open={open}>
                <Toolbar id="toolbar" sx={{ bgcolor: theme.palette.nav.darkgreen, color: theme.palette.text.white, justifyContent: "space-between" }}>
                    <Box id="childbox">
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{ mr: 2, ...(open && { display: 'none' }) }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Button sx={{ fontSize: '20px' }}
                            variant="text"
                            color="inherit"
                            onClick={() => navigate('')}>
                            Home
                        </Button>
                    </Box>
                    {useAuth() && <AccountMenu />}
                </Toolbar>
            </AppBar>
            <Drawer id="drawer"
                PaperProps={{
                    sx: {
                        backgroundColor: theme.palette.nav.light,
                        color: theme.palette.text.dark,
                    }
                }}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },

                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader id="drawerheader">
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <List>
                    {drawerItems.map((item) => (
                        <ListItem button key={item.id} onClick={() => navigate(item.route)}>
                            <ListItemIcon sx={{pl:"15px"}}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText  primaryTypographyProps={{ fontSize: '1.1rem' }} primary={item.label} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Content id="content" open={open}>
                <DrawerHeader />
                <ContentWrapper>
                    {children}
                </ContentWrapper>
            </Content>
        </Box>
    );
}
