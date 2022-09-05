import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PersonAdd from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import TextField from "../utils/TextField";
import { Formik, Form } from 'formik';
import { friendSchema } from "@card-app/common";
import socket from "../../socket"
import { useState } from "react";
import { Typography } from '@mui/material';
import actions from "../state/actionCreators";

const AddFriendModal = () => {
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const [error, setError] = useState("");

    return (
        <>
            <IconButton onClick={handleClickOpen}>
                <PersonAdd />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="xs"
            >
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogTitle>Add a friend!</DialogTitle>
                <DialogContent>
                    <Formik initialValues={{ friendName: "" }}
                        onSubmit={(values) => {
                            socket.emit("add_friend", values.friendName, ({ errorMsg, done, newFriend }) => {
                                if (done) {
                                    actions.addFriend(newFriend);
                                    handleClose();
                                    return;
                                }
                                setError(errorMsg);
                            })
                        }}
                        validationSchema={friendSchema}
                    >
                        <Form>
                            <Typography fontSize="sm" color="red" textAlign="center">{error}</Typography>
                            <TextField
                                label="Friend's name"
                                placeholder="Enter friend's username..."
                                autoComplete="off"
                                name="friendName" />
                            <DialogActions>

                                <Button type="submit" justifyContents="right">Add Friend</Button>
                            </DialogActions>
                        </Form>
                    </Formik>

                </DialogContent>
            </Dialog>
        </>
    );
}

export default AddFriendModal;


// import { Modal, ModalFooter, ModalBody, ModalHeader, ModalContent, ModalOverlay, Button, ModalCloseButton, Heading, useControllableState } from "@chakra-ui/react"
// import TextField from "../TextField";
// import { Formik, Form } from 'formik';
// import { friendSchema } from "@card-app/common";
// import socket from "../../socket"
// import { useCallback, useContext, useState } from "react";
// import { FriendContext } from "./Home"

// const AddFriendModal = ({ isOpen, onClose }) => {
//     const [error, setError] = useState("");
//     const closeModal = useCallback(
//         () => {
//             setError("");
//             onClose();
//         },
//         [onClose],
//     )
//     const { setFriendList } = useContext(FriendContext);
//     return <Modal isOpen={isOpen} onClose={closeModal} >
//         <ModalOverlay />
//         <ModalContent>
//             <ModalHeader>Add a friend!</ModalHeader>
//             <ModalCloseButton />
//             <Formik initialValues={{ friendName: "" }}
//                 onSubmit={(values) => {
//                     socket.emit("add_friend", values.friendName, ({ errorMsg, done, newFriend }) => {
//                         if (done) {
//                             setFriendList(c => [newFriend, ...c]);
//                             closeModal();
//                             return;
//                         }
//                         setError(errorMsg);
//                     })
//                 }}
//                 validationSchema={friendSchema}
//             >
//                 <Form>
//                     <ModalBody>
//                         <Heading fontSize="sm" as="p" color="red.500" textAlign="center">{error}</Heading>
//                         <TextField
//                             label="Friend's name"
//                             placeholder="Enter friend's username..."
//                             autoComplete="off"
//                             name="friendName" />
//                     </ModalBody>
//                     <ModalFooter>
//                         <Button colorScheme="blue" type="submit">Submit</Button>
//                     </ModalFooter>
//                 </Form>
//             </Formik>
//         </ModalContent>
//     </Modal>
// }

// export default AddFriendModal;






{/* <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="FriendName"
                        type="email"
                        fullWidth
                        variant="standard"
                    /> */}