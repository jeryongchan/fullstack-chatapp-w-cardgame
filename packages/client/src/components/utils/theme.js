// import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        background: {
            light: '#D3EBCD',
            dark: '#2C3333'
        },
        text: {
            light: '#D3EBCD',
            white: '#E7F6F2',
            dark: '2C3333'
        },
        nav: {
            brown: "#635666", 
            lightgreen: "#AEDBCE",
            mediumgreen: "#A5C9CA",
            darkgreen: "#395B64",
            darkgrey: "#2C3333",
            light: '#E7DFD5',
            purple: "#7A4069"
        }
    },
    typography: {
        // "fontFamily": "\"MyCustomFont\"",
        // "fontSize": 20,
        // "lineHeight": 1.5,
        // "letterSpacing": 0.32,
        // useNextVariants: true,
        // suppressDeprecationWarnings: true,
        h5: {
          "fontWeight": 600,
        },
      },
});