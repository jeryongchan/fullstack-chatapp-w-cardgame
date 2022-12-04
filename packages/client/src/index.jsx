import ReactDOM from "react-dom";
import React from "react";
import App from "./App";
import { HashRouter } from 'react-router-dom'
import './index.css';
import { Provider } from 'react-redux'
import { store } from "./components/state/store"
import { theme } from "./components/utils/theme"
import { ThemeProvider } from '@mui/system';

ReactDOM.render(
    <React.StrictMode >
        <HashRouter >
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <App />
                </ThemeProvider>
            </Provider>
        </HashRouter >
    </React.StrictMode>,
    document.getElementById("root")
);
