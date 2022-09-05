import HomeIcon from '@mui/icons-material/Home';
import GameIcon from '@mui/icons-material/SportsEsports';
import AboutIcon from '@mui/icons-material/Info';

export const drawerItems = [
    {
        id: 0,
        icon: <HomeIcon />,
        label: 'Home',
        route: '',
    },
    {
        id: 2,
        icon: <GameIcon />,
        label: 'Games',
        route: 'game',
    },
    {
        id: 2,
        icon: <AboutIcon />,
        label: 'About',
        route: 'about',
    },
]
