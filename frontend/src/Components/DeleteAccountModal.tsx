import { useNavigate, useLocation, Link } from "react-router-dom";
import { Email } from "../typesAndInterfaces/types"

function DeleteAccountModal(props: any) {
    const navigate = useNavigate()
    const closeModal = props.closeModal
    const userInfo = props.userInfo

    function deleteAll() {
        sendEmail()
        deleteAccount()
        deleteEventPictures()
    }

    let message = "Inga bilder togs på eventet"

    function adminPictures() {
        message = props.pictures[0].takenPicture
    }

    if (props.pictures.length) {
        adminPictures()
    }



    const email: Email = {
        from: "asg.gasperini@gmail.com",
        to: userInfo.data.email,
        subject: "GALLERI FRÅN " + userInfo.data.eventTitle,
        message: message // skickar bara en bild atm
    }

    async function sendEmail() {

        const response = await fetch('http://localhost:2500/sendEmail', {
            method: 'POST',
            body: JSON.stringify(email),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json();
    }

    let eventKey = {
        eventKey: userInfo.eventKey
    }
    async function deleteEventPictures() {

        const response = await fetch('http://localhost:2500/deleteEventPictures/eventGallery/', {
            method: 'DELETE',
            body: JSON.stringify(eventKey),
            headers: {
                "Content-Type": "application/json"
            }
        })
    }

    async function deleteAccount() {
        deleteEventPictures()
        navigate("/")
        window.location.reload()
        const user = {
            userInfo: userInfo.username
        }

        const response = await fetch('http://localhost:2500/deleteAccount', {
            method: 'DELETE',
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(resp => resp.json())
            .then(data => console.log(data))
    }






    return (
        <section className="modalContainer">
            <h1 onClick={() => adminPictures()}>Är du säker på att du vill radera ditt konto?</h1>
            <h2>Kom ihåg att spara bilder innan du raderar kontot</h2>
            <button onClick={() => deleteAll()}>Radera konto</button>
            <button onClick={() => closeModal(false)}>Ångra</button>
        </section >

    );
}

export default DeleteAccountModal;