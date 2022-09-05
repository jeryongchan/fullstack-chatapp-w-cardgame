import { Formik, Form } from "formik";
import * as Yup from "yup";
import socket from "../../socket";
import { Stack, Button } from "@mui/material"
import TextFieldWrapper from "../utils/TextField";
import gameActions from "../state/actionCreators"

const ChatBox = ({ userid }) => {
    return (
        <Formik
            initialValues={{ message: "" }}
            validationSchema={Yup.object({
                message: Yup.string().min(1).max(255),
            })}
            onSubmit={(values, actions) => {
                const message = {to: userid, from: null, content: values.message}
                socket.emit("dm", message);
                gameActions.addMessage(message);
                actions.resetForm();
            }}
        >
            <Form>
                <Stack direction="row">
                <TextFieldWrapper
                    margin="dense"
                    name="message"
                    placeholder="Type message here..."
                    autoComplete="off"
                />
                    <Button
                        type="submit"
                        size="lg"
                        sx={{
                            fontWeight: "550",
                            color: "#7A4069"
                        }}
                    >
                    Send
                </Button>
                </Stack>
            </Form>
        </Formik>
    )
    
}


export default ChatBox;