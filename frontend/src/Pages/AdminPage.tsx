import { useRef, useState, useEffect } from "react"
import { useNavigate, useLocation, Link, useSearchParams } from "react-router-dom";

function AdminPage() {

    const navigate = useNavigate()
    const location = useLocation()
    const user = location.state

    const [ableDelete, setAbleDelete] = useState(false)


    async function deleteAccount() {
        let event = {
            eventKey: user.eventKey
        }

        const response = await fetch('http://localhost:2500/deleteAccount', {
            method: 'DELETE',
            body: JSON.stringify(event),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();

    }


    async function isLoggedIn() {
        //hitta fram vår session storage - ta token därifrån
        const token = location.state.data.token

        const response = await fetch('http://localhost:2500/loggedin', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        if (data.loggedIn == false) {
            sessionStorage.clear(); // Rensar allt som sparats
            window.location.reload() // Gör så att kameran även stängs av
            navigate("/")
        }
    }
    isLoggedIn()


    return (
        <section>
            <h1>{user.data.eventTitle}</h1>
            <h4>{user.data.name}</h4>
            <button onClick={() => setAbleDelete(!ableDelete)}> ...</button>
            {ableDelete && <h4 onClick={() => deleteAccount()}>RADERA KONTO</h4>}
            <p>Admin Page</p>
        </section>
    );
}

export default AdminPage;