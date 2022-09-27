import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Email, DeleteAccount } from "../typesAndInterfaces/interfaces"
import { EventKey, UserName, Emails } from "../typesAndInterfaces/types"
import styles from "./InviteGuestModal.module.css"


function DeleteAccountModal(props: DeleteAccount) {

    const navigate = useNavigate()
    const closeModal = props.closeModal
    const userInfo = props.userInfo
    const [emilList, setEmailList] = useState<string>("")
    const allEmails: any = []



    function deleteAll(): void {
        sendEmail()
        deleteAccount()
        deleteEventPictures()
    }

    useEffect(() => {
        getEmails()
    }, [])

    let message: string = "Inga bilder togs på eventet"
    let allPics: any = [];
    let picsToSend: object[] = [];

    if (props.pictures.length) {
        adminPictures()
    }

    async function adminPictures(): Promise<void> {
        props.pictures.map((picture, id) => (
            !allPics.includes(picture.takenPicture) ? allPics.push(picture.takenPicture) : null
        ))

        message = props.pictures[0].takenPicture
    }

    allPics.forEach((picture: string, id: number) => {

        let onePicture = {
            filename: 'picture' + id + ".jpg",
            content: picture.split("base64,")[1],
            encoding: "base64"
        };
        picsToSend.push(onePicture);
    });


    if (props.pictures.length) {
        adminPictures()
    }

    console.log("allPics", allPics);
    console.log("piccylist", picsToSend);


    const email: Email = {
        from: "phyllographen@gmail.com",
        to: userInfo.data.email,
        subject: "Gästlista & " + "GALLERI FRÅN " + userInfo.data.eventTitle,
        message: "Gästlista " + emilList,  // skickar bara en bild atm
        attachments: picsToSend
    }

    async function getEmails(): Promise<void> {

        let eventKey: EventKey = {
            eventKey: userInfo.eventKey
        }
        const response = await fetch('http://localhost:2500/eventEmails/getEmails', {
            method: 'POST',
            body: JSON.stringify(eventKey),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json();

        await data.map((email: Email | any, id: number) => ( // Vrf jiddrar den?? 
            !allEmails.includes(email.email) ? allEmails.push(email.email) : null
        ))
        setEmailList(allEmails.join(', '))
    }





    async function sendEmail(): Promise<void> {
        const response = await fetch('http://localhost:2500/sendEmail', {
            method: 'POST',
            body: JSON.stringify(email),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json();
    }

    let eventKey: EventKey = {
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
            userInfo: userInfo.username,
            eventKey: userInfo.eventKey
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
            <h1 onClick={() => adminPictures()}>Är du säker på att du vill avsluta eventet och ditt konto?</h1>
            <h2 className={styles.h2} >Alla dina bilder och gästlistan kommer att skickas till din mail</h2>


            <button className={styles.deleteBtn} onClick={() => deleteAll()}>Radera konto</button>
            <button className={styles.close} onClick={() => closeModal(false)}>Ångra</button>
        </section >

    );
}

export default DeleteAccountModal;