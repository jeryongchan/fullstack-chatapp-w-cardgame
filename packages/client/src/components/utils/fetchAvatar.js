export const fetchAvatar = async (username) => {
    console.log("username", username)
    return await fetch(`${process.env.REACT_APP_SERVER_URL}/image/` + username
    ).catch(err => {
        console.log('err', err)
        return;
    }).then(res => {
        console.log('res', res)
        if (res === 'no avatar') {
            return null;
        }
        if (!res || !res.ok || res.status >= 400) {
            console.log("no res", res)
            return
        }
        return res.blob();
    }).then(data => {
        console.log("data", data)
        if (data) {
            const objectURL = URL.createObjectURL(data);
            console.log("objectURL", objectURL)
            return objectURL;
        } else {
            console.log("no avatar sent")
            return "/assets/blankprofilepic.png";
        }
        console.log("na")
        return

    });
}
