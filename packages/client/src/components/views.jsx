import { Routes, Route } from "react-router-dom";
import Login from "./Login/Login";
import SignUp from "./Login/SignUp";
import Home from "./Home/Home";
import GameRoom from "./Game/GameRoom";
import Profile from "./Profile";
import WaitingRoom from "./Game/WaitingRoom";
import Game from "./Game/Game";
import About from "./About";
import PageNotFound from "./PageNotFound";
import PrivateRoutes from "./PrivateRoute";
import { useAuth } from "./PrivateRoute";
const { Outlet } = require("react-router");

const Views = () => {
    return useAuth() === undefined ? (
        <div>Loading...</div>
    ) : (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/about" element={<About />} />
                <Route element={<PrivateRoutes />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/game" element={<Outlet />}>
                        <Route path="" element={<GameRoom />} />
                        <Route path="waitingroom" element={<WaitingRoom />} />
                        <Route path=":gamepin" element={<Game />} />
                    </Route>
                </Route>
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </>
    )
};

export default Views;


// const Views = () => {
//     const { user } = useContext(UserContext);
//     return user.loggedIn === null ? (
//         <Text>Loading...</Text>
//     ) :
//         (
//         <>
//         <Routes>
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<SignUp />} />
//             <Route element={<PrivateRoutes />}>
//                 <Route path="/" element={<Home />} />
//                 <Route path="/game" element={<Game />} />
//             </Route>
//             <Route path="*" element={<Login />} />
//         </Routes>
//         </>
//     );
// };
