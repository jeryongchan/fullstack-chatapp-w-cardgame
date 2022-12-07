export const fetchAvatar = async (username) => {
    return await fetch(`${process.env.REACT_APP_SERVER_URL}/image/` + username
    ).catch(err => {
        console.log('err', err)
        return;
    }).then(res => {
        console.log('res', res)
        if (!res || !res.ok || res.status >= 400) {
            console.log("no res", res)
            return "/assets/blankprofilepic.png";
        }
        return res.blob();
    }).then(data => {
        console.log("data", data)
        if (data) {
            const objectURL = URL.createObjectURL(data);
            console.log("objectURL", objectURL)
            return objectURL;
        } 
        console.log("na")
        return

    });
}
