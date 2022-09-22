import { useRef, useState, useEffect } from "react"
import { useNavigate, useLocation, Link, useSearchParams } from "react-router-dom";
import DeleteAccountModal from "../Components/DeleteAccountModal";

function AdminPage() {

    const navigate = useNavigate()
    const location = useLocation()
    const user = location.state

    const [ableDelete, setAbleDelete] = useState(false)
    const [closeModal, setCloseModal] = useState<boolean>(false)




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
            {ableDelete && <h4 onClick={() => setCloseModal(true)}>RADERA KONTO</h4>}



            {closeModal && <DeleteAccountModal closeModal={setCloseModal} userInfo={user.username} />}

        </section>
    );
}

export default AdminPage;