import { useNavigate, useLocation, Link } from "react-router-dom";


function DeleteAccountModal(props: any) {
    const navigate = useNavigate()
    const closeModal = props.closeModal
    const userInfo = props.userInfo


    // async function deleteAccount() {
    //     navigate("/")
    //     const user = {
    //         userInfo: userInfo
    //     }

    //     const response = await fetch('http://localhost:2500/deleteAccount', {
    //         method: 'DELETE',
    //         body: JSON.stringify(user),
    //         headers: {
    //             "Content-Type": "application/json"
    //         }
    //     });
    //     const data = await response.json();

    //     console.log(data);

    // }

    return (
        <section className="modalContainer">
            <h1>Är du säker på att du vill radera ditt konto?</h1>
            {/* <button onClick={() => deleteAccount()}>Radera konto</button> */}
            <button onClick={() => closeModal(false)}>Ångra</button>
        </section>
    );
}

export default DeleteAccountModal;