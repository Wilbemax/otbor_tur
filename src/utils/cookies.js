export const setCookies = (name, value) => {
    document.cookie = `${name}=${value}`
}


export const getCookies = (name) => {
    const cookie = document.cookie.split("; ")
    .find(row => row.startsWith(`${name}=`))

    return cookie ? cookie.split("=")[1] : null
}