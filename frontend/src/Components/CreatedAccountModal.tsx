import React from "react";
import { Link } from "react-router-dom";
import { NewAccount, Email } from "../typesAndInterfaces/interfaces"
import styles from "./CreateAccountModal.module.css"


function CreatedAccountModal(props: NewAccount) {

    const info = props.data
    const admin = props.admin

    const email: Email = {
        from: "phyllographen@gmail.com",
        to: info.email,
        subject: "Phyllographen - Eventkod till " + info.title,
        message: "EVENTKOD: " + info.eventKey
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

    return (
        <section className="modalContainer">

            <h1 className={styles.welcome}>Välkommen {info.firstName}</h1>

            {info.eventKey ? <article className={styles.adminKeyInfo}>
                <h2>DIN EVENTKOD ÄR</h2>
                <br />
                <h1 className={styles.eventKey}>{info.eventKey}</h1>
                <br />
                <h3>TA EN SCREENSHOT OCH DELA MED GÄSTERNA</h3>
                <h3>DU HITTAR ÄVEN KODEN PÅ DIN MAIL</h3>
            </article> : null}

            <article className={styles.createBtn}>
                <Link to={"/"}><button onClick={admin ? () => sendEmail() : () => null}>Logga in</button></Link>
            </article>

        </section>
    );
}

export default CreatedAccountModal;