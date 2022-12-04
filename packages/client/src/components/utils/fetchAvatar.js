export const fetchAvatar = async (username) => {
    return await fetch(`${process.env.REACT_APP_SERVER_URL}/image/` + username
    ).catch(err => {
        return;
    }).then(res => {
        if (!res || !res.ok || res.status >= 400) {
            return;
        }
        return res.blob();
    }).then(data => {
        if (data) {
            const objectURL = URL.createObjectURL(data);
            return objectURL;
        }
        return;
    });
}
