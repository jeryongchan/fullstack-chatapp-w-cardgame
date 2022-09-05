export const fetchAvatar = async (username) => {
    return await fetch("http://localhost:4000/image/" + username
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