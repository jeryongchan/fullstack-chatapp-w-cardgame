import { Formik, Form } from 'formik';
import { useNavigate } from "react-router-dom";
import { formSchema } from "@card-app/common";
import { useState } from "react";
import { Container, Box, Button, Stack, Typography } from "@mui/material";
import TextFieldWrapper from "../utils/TextField";
import actions from "../state/actionCreators"
import { useTheme } from '@mui/material';

const Login = () => {
    const [error, setError] = useState(null)
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={formSchema}
            onSubmit={(values, formActions) => {
                const vals = { ...values }
                formActions.resetForm();
                fetch(`${process.env.REACT_APP_SERVER_URL}/auth/login`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(vals),
                }).catch(err => {
                    console.log("e", err);
                    return;
                }).then(res => {
                    if (!res || !res.ok || res.status >= 400) {
                        console.log("f", res);
                        return;
                    }
                    return res.json();
                }).then(data => {
                    console.log("d", data);
                    if (!data) return;
                    const { username, loggedIn, status } = data;
                    actions.setUsername(username);
                    actions.setLoggedIn(loggedIn);
                    if (status) {
                        setError(status);
                    } else if (loggedIn) {
                        navigate("/");
                    }
                });
            }}>
            {() => (
                <Form>
                    <Container component="main" maxWidth="xs">
                        <Box
                            sx={{
                                mt: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="h5" fontWeight="fontWeightBold" sx={{
                                py: 5,
                                fontSize: 32,
                                fontWeight: 500
                            }}>
                                LOG IN
                            </Typography>
                            <Typography variant="h6" align="center" color="red">
                                {error}
                            </Typography>
                            <TextFieldWrapper
                                name="username"
                                placeholder="Enter username"
                                label="Username"
                                autoComplete="off"
                                margin="dense"

                            />
                            <TextFieldWrapper
                                name="password"
                                placeholder="Enter password"
                                label="Password"
                                type="password"
                                autoComplete="off"
                                margin="dense"
                            />
                            <Stack
                                sx={{ pt: 4 }}
                                direction="row"
                                spacing={2}
                                justifyContent="center"
                            >
                                <Button variant="contained" sx={{
                                    ':hover': {
                                        bgcolor: theme.palette.nav.purple,
                                        color: 'white',
                                    },
                                    bgcolor: theme.palette.nav.brown
                                }} type="submit">
                                    Log In
                                </Button>
                                <Button variant="contained" sx={{
                                    ':hover': {
                                        bgcolor: theme.palette.nav.purple,
                                        color: 'white',
                                    },
                                    bgcolor: theme.palette.nav.brown
                                }}
                                    onClick={() => navigate("/register")}>
                                    Create Account
                                </Button>
                            </Stack>
                        </Box>
                    </Container>
                </Form>
            )}
        </Formik>
    )
};

export default Login;
