import { Formik, Form } from 'formik';
import { useState } from "react";
import { formSchema } from "@card-app/common";
import { useNavigate } from "react-router-dom";
import { Container, Box, Button, Stack, Typography } from "@mui/material";
import TextFieldWrapper from "../utils/TextField";
import actions from "../state/actionCreators"

const SignUp = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    return (
        <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={formSchema}
            onSubmit={(values, formActions) => {
                const vals = { ...values }
                formActions.resetForm();
                fetch(`${process.env.REACT_APP_SERVER_URL}/auth/signup`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(vals),
                }).catch(err => {
                    return;
                }).then(res => {
                    if (!res || !res.ok || res.status >= 400) {
                        return;
                    }
                    return res.json();
                }).then(data => {
                    if (!data) return;
                    const { username, loggedIn, status } = data;
                    console.log(username)
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
                            <Typography variant="h5" py={2}>
                                CREATE ACCOUNT
                            </Typography>
                            <Typography variant="h6" align="center" color="red">
                                {error}
                            </Typography>
                            <TextFieldWrapper
                                margin="dense"
                                name="username"
                                placeholder="Enter username"
                                autoComplete="off"
                                label="Username"

                            />
                            <TextFieldWrapper
                                margin="dense"
                                name="password"
                                placeholder="Enter password"
                                autoComplete="off"
                                label="Password"
                                type="password"
                            />
                            <Stack
                                sx={{ pt: 4 }}
                                direction="row"
                                spacing={2}
                                justifyContent="center"
                            >
                                <Button variant="contained" color="secondary" type="submit">Create Account</Button>
                                <Button variant="contained" color="secondary" onClick={() => navigate("/")}>Back</Button>
                            </Stack>
                        </Box>
                    </Container>

                </Form>

            )}
        </Formik>
    )
};

export default SignUp;