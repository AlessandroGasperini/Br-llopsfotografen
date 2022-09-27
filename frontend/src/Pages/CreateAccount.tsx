import { useState, useEffect } from "react";
import CreatedAccountModal from "../Components/CreatedAccountModal";
import hidePswImg from "../assets/hidePsw.png"
import showPswImg from "../assets/showPsw.png"
import { InputNewAccount } from "../typesAndInterfaces/interfaces"
import { ConfirmAccount } from "../typesAndInterfaces/types"
import styles from "./CreateAccount.module.css"

function CreateAccount() {
    const [showPsw, setShowPsw] = useState<boolean>(false)
    const [guestOrAdmin, setGuestOrAdmin] = useState<boolean>(false)
    const [showBtn, setShowBtn] = useState<boolean>(false)

    const [title, setTitle] = useState<string>("")
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmedPassword] = useState<string>("")
    const [eventKey, setEventKey] = useState<number>()

    const [confirmed, setConfirmed] = useState<ConfirmAccount | any>(false) //Any pga läser inte in de direkt

    let adminAccount: InputNewAccount = {
        title: title,
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: password,
        eventKey: eventKey,
    }

    let guestAccount: InputNewAccount = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: password,
    }

    // Skapa konto
    async function createNewAccount(account: InputNewAccount): Promise<void> {
        const response = await fetch('http://localhost:2500/signup', {
            method: 'POST',
            body: JSON.stringify(account),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        setConfirmed(data)
    }

    // Ger admin eventKod
    function createKey(): void {
        setEventKey(Math.floor(Math.random() * 90000) + 10000)

    }


    // Alla fält måste vara ifyllda för att skapa konto + admin måste hämta en eventKod
    useEffect(() => {
        if (firstName !== "" && lastName !== "" && username !== "" && email !== "" && password !== "" && password === confirmPassword) {
            if (!guestOrAdmin) {
                setShowBtn(true)

            } else if (guestOrAdmin && title !== "" && eventKey != null) {
                setShowBtn(true)
            }
        } else {
            setShowBtn(false)
        }
        if (!guestOrAdmin) {
            setTitle("")
        }

        if (guestOrAdmin && title === "") {
            setShowBtn(false)
        }
    })


    return (
        <section className={styles.container}>

            <h1 className={styles.createH1}>{guestOrAdmin ? "Skapa eventkonto" : "Skapa konto för att delta i event"}</h1>

            <section className={styles.adminOrGuest}>
                <h4 className={!guestOrAdmin ? styles.choosenAccount : ""} onClick={() => setGuestOrAdmin(false)}>GUEST</h4> <h4 className={guestOrAdmin ? styles.choosenAccount : ""} onClick={() => setGuestOrAdmin(true)}>ADMIN</h4>
            </section>
            <article>
                {guestOrAdmin && <input className={styles.eventTitle} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Event titel" />}
                <input onChange={(e) => setFirstName(e.target.value)} type="text" placeholder="Förnamn" />
                <input onChange={(e) => setLastName(e.target.value)} type="text" placeholder="Efternamn" />
                <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Användarnamn" />
                <input onChange={(e) => setEmail(e.target.value)} type="text" placeholder="E-mail" />

                <input onChange={(e) => setPassword(e.target.value)} type={showPsw ? "text" : "password"} placeholder="Lösenord" />
                <input onChange={(e) => setConfirmedPassword(e.target.value)} type={showPsw ? "text" : "password"} placeholder="Upprepa löseord" />
                {guestOrAdmin && <h5 className={styles.eventKey}>{eventKey}</h5>}
                {guestOrAdmin && <h2 className={styles.codeBtn} onClick={() => createKey()}>Ge mig en kod</h2>}

                <article className={!guestOrAdmin ? styles.eye : styles.adminEye}>
                    <img onClick={() => setShowPsw(!showPsw)} src={showPsw ? hidePswImg : showPswImg} alt="" />
                </article>

                {showBtn && <button className={!guestOrAdmin ? styles.createAccount : styles.createAccountAdmin} onClick={() => createNewAccount(guestOrAdmin ? adminAccount : guestAccount)}>Skapa konto</button>}

                <section className={!guestOrAdmin ? styles.exists : styles.existsAdmin}>
                    {confirmed.usernameExists && <h3>Användarnamnet finns redan</h3>}
                    {confirmed.emailExists && !confirmed.usernameExists ? <h3>Denna Email används redan</h3> : null}
                </section>

            </article>
            {confirmed.success ? <CreatedAccountModal admin={guestOrAdmin} data={guestOrAdmin ? adminAccount : guestAccount} /> : null}
        </section >
    );
}

export default CreateAccount;