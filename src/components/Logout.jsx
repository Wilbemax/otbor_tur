import { setCookies } from "../utils/cookies"

export const Logout = () => {


    const handleLogout = async() => {
        setCookies('token', null)
        window.location.href = '/'
    }

    return (
        <div style={{margin: '10rem auto', width: 100}}>
            <button onClick={handleLogout}  >Выйти</button>
        </div>
    )
    
}