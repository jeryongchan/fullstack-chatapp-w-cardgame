import useSocketInit from "./useSocketInit";
import { useSelector } from 'react-redux'
const { Outlet, Navigate } = require("react-router");

export const useAuth = () => {
    console.log("a", useSelector(state => state.user.loggedIn))
    // console.log(useSelector(state => state.user.loggedIn))
    return useSelector(state => state.user.loggedIn);
};

const PrivateRoutes = () => {
    console.log("b")
    useSocketInit();
    console.log("c")
    return useAuth() ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;