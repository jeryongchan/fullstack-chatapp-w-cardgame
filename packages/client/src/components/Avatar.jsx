import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import { styled } from "@mui/material/styles";
import Badge, { badgeClasses } from "@mui/material/Badge";
const UserAvatar = ({ hideBadge, username, avatar, connected }) => {
    const src = avatar;
    // console.log(username)
    // console.log(src)
    const char = username ? username.charAt(0) : "";
    const StyledBadge = styled(Badge)(({ theme }) => ({
        "& .MuiBadge-badge": {
            backgroundColor: `${connected ? "#44b700" : "#ff0000"}`,
            boxShadow: `0 0 0 3px ${theme.palette.background.paper}`,
        },
        [`& .${badgeClasses.dot}`]: {
            width: "11px",
            height: "11px",
            borderRadius: "50%"
        }
    }));

    const StyledAvatar = ({ alt, src }) => {
        return (
            <Avatar
                sx={{ bgcolor: deepOrange[500] }}
                alt={alt}
                src={src}
                style={{
                    width: "55px",
                    height: "55px",
                }}
            >{char}</Avatar>
        )
    }
    
    return hideBadge ?
        (<StyledAvatar
            alt={username}
            src={src}
        />) :
        (
            <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
            >
                <StyledAvatar
                    alt={username}
                    src={src}
                />
            </StyledBadge>
        )
}

export default UserAvatar;