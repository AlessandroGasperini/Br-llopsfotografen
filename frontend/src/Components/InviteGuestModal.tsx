import { useState } from "react";
import { Email, InviteGuest } from "../typesAndInterfaces/interfaces"
import styles from "./InviteGuestModal.module.css"

function InviteGuestModal(props: InviteGuest) {
    console.log(props);

    const [emailInfo, setEmailInfo] = useState<string>("")

    const userProps = props.userInfo.data

    const email: Email = {
        from: "phyllographen@gmail.com",
        to: emailInfo,
        subject: "Phyllographen - Eventkod till " + userProps.eventTitle,
        message: "Ladda ner Phyllographen, skapa gästkonto och använd eventkoden. EVENTKOD: " + props.userInfo.eventKey
    }

    async function sendEmail(): Promise<void> {

        await props.setInvite(false)

        const response = await fetch('http://localhost:2500/sendEmail', {
            method: 'POST',
            body: JSON.stringify(email),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json();

    }

    return (
        <section className="modalContainer">
            <h1 className={styles.h1}>Bjud in gäster och dela med dig av eventkoden</h1>
            <input className={styles.input} placeholder="E-mail" type="email" onChange={(e) => setEmailInfo(e.target.value)} />

            {emailInfo != "" && <button className={styles.inviteBtn} onClick={() => sendEmail()}>BJUD IN</button>}
            <button className={styles.close} onClick={() => props.setInvite(false)}>STÄNG</button>
        </section>
    );
}

export default InviteGuestModal;