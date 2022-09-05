import { Stack } from "@mui/material"
const TabPanel = (props) => {
    const { children, friendIndex, tabIndex } = props;
    return (friendIndex === tabIndex && (
        <Stack
            sx={{
                overflowX: "hidden", // scrollbars belong here
                maxHeight: "inherit",
                justifyContent: "bottom",
                height: "100%",
                padding: "1rem",
                boxSizing: "border-box"
            }}
            direction="column-reverse"
        >
            {children}
        </Stack>
    ));
}

export default TabPanel;