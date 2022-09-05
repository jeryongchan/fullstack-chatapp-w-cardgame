import useSocketInit from "./useSocketInit";
import { useSelector } from 'react-redux'
const { Outlet, Navigate } = require("react-router");

export const useAuth = () => {
    // console.log(useSelector(state => state.user.loggedIn))
    return useSelector(state => state.user.loggedIn);
};

const PrivateRoutes = () => {
    useSocketInit();
    return useAuth() ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;