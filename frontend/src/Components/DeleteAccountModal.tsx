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

    let allPics: any = [];
    let picsToSend: object[] = [];

    if (props.pictures.length) {
        adminPictures()
    }

    // Lägger in alla bilder i en lista
    async function adminPictures(): Promise<void> {
        props.pictures.map((picture, id) => (
            !allPics.includes(picture.takenPicture) ? allPics.push(picture.takenPicture) : null
        ))
    }

    // Sätter attachment på varje bild
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


    const email: Email = {
        from: "phyllographen@gmail.com",
        to: userInfo.data.email,
        subject: "Gästlista & " + "GALLERI FRÅN " + userInfo.data.eventTitle,
        message: "Gästlista " + emilList,
        attachments: picsToSend
    }

    // Skickar mail med gästlistan + alla bilder som tagits på eventet
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

        // Samma email kan inte läggas in två gånger
        await data.map((email: Email | any, id: number) => ( // Osäker vrf any behövs
            !allEmails.includes(email.email) ? allEmails.push(email.email) : null
        ))
        setEmailList(allEmails.join(', '))
    }

    // Skickar email
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

    // Raderar alla bilder efter
    async function deleteEventPictures() {
        const response = await fetch('http://localhost:2500/deleteEventPictures/eventGallery/', {
            method: 'DELETE',
            body: JSON.stringify(eventKey),
            headers: {
                "Content-Type": "application/json"
            }
        })
    }

    // Raderar konto
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