import Views from "./components/views";
import Drawer from "./components/Drawer";
import useUserInit from "./components/useUserInit";

function App() {
    useUserInit();

    return (
        <Drawer>
            <Views />
        </Drawer>
    );
}

export default App;

