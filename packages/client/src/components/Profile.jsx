import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from "react";
import { fetchAvatar } from './utils/fetchAvatar';
import actions from './state/actionCreators';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
// import styles from "../styles/Home.module.css";

const Profile = () => {
    const user = useSelector(state => state.user);
    const [image, setImage] = useState();
    const [preview, setPreview] = useState();
    const [open, setOpen] = useState(false);
    const fileInputRef = useRef();
    const Input = styled('input')(() => ({
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        cursor: 'pointer',
        display: "none"
    }));
    const StyledButton = styled(Button)(() => ({
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        border: 'none',
        background: '#7A4069',
        color: '#E7F6F2',
    }));
    const StyledImage = styled('img')(() => ({
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        cursor: 'pointer',
        objectFit: "cover"
    }))
    useEffect(() => {
        if (image) {
            console.log(image)
            const reader = new FileReader();
            
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            console.log(reader)
            reader.readAsDataURL(image);
            console.log(reader)
            
        } else {
            setPreview(null);
        }
    }, [image]);

    return (
        <Box sx={{
            minHeight: '100vh',
            padding: '0 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            {preview ? (
                <StyledImage
                    src={preview}
                    onClick={() => {
                        setImage(null);
                    }}
                />
            ) : (
                <StyledButton
                    onClick={(event) => {
                        event.preventDefault();
                        fileInputRef.current.click();
                    }}
                >
                    Add Image
                </StyledButton>
            )}
            <Input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(event) => {
                    const file = event.target.files[0];
                    if (file && file.type.substr(0, 5) === "image") {
                        if (file.size > 1000000) {
                            alert("Please upload image with maximum size of 1MB")
                        } else {
                            setImage(file);
                        }
                    } else {
                        setImage(null);
                    }
                }}
            />
            <Button
                onClick={async () => {
                    let formData = new FormData();
                    console.log(user.username)
                    formData.append("username", user.username);
                    formData.append("avatar", image);
                    await fetch(`${process.env.REACT_APP_SERVER_URL}/image`, {
                        method: "POST",
                        body: formData,
                    }).catch(err => {
                        console.log("server error")
                        return;
                    }).then(res => {
                        return res.json();
                    }).then(data => {
                        if (!data) return;
                        else {
                            console.log(data)
                        }
                    });
                    const URL = await fetchAvatar(user.username);
                    console.log(URL);
                    actions.setAvatar(URL);
                    setOpen(true);
                }}>
                Save
            </Button>
            <Dialog open={open} onClose={()=>setOpen(false)}>
                <DialogTitle>{"Avatar updated!"}</DialogTitle>
                <DialogActions>
                    <Button onClick={()=>setOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Profile;
