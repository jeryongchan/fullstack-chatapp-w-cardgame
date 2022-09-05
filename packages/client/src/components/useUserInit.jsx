import { useNavigate, useLocation } from "react-router-dom";
import actions from "./state/actionCreators";
import { store } from "./state/store";
import { fetchAvatar } from "./utils/fetchAvatar";
import { useEffect } from "react";

const useUserInit = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    useEffect(async () => {
        await fetch("http://localhost:4000/auth/login", {
            credentials: "include",
        })
            .catch(() => {
                actions.setLoggedIn(false)
                return;
            })
            .then(r => {
                if (!r || !r.ok || r.status >= 400) {
                    actions.setLoggedIn(false)
                    return;
                }
                return r.json();
            })
            .then(data => {
                if (!data) {
                    actions.setLoggedIn(false)
                    return;
                }
                const { username, loggedIn, status } = data;
                actions.setLoggedIn(loggedIn);
                actions.setUsername(username)
                navigate(pathname);
            });
        actions.setAvatar(await fetchAvatar(store.getState().user.username));
    }, [])
}

export default useUserInit;