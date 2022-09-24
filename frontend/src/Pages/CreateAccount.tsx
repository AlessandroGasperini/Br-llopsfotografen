import { useState, useEffect } from "react";
import CreatedAccountModal from "../Components/CreatedAccountModal";
import hidePswImg from "../assets/hidePsw.png"
import showPswImg from "../assets/showPsw.png"
import { newAccount } from "../typesAndInterfaces/interfaces"

function CreateAccount() {
    const [showPsw, setShowPsw] = useState<boolean>(false)
    const [guestOrAdmin, setGuestOrAdmin] = useState<boolean>(false)

    const [title, setTitle] = useState<string>("")
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmedPassword] = useState<string>("")
    const [eventKey, setEventKey] = useState<number>()

    const [confirmed, setConfirmed] = useState<Object | any>(false)



    let adminAccount: newAccount = {
        title: title,
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: password,
        eventKey: eventKey,
    }

    let guestAccount: newAccount = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: password,
    }


    async function createNewAccount(account: newAccount) {
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


    function createKey() {
        setEventKey(Math.floor(Math.random() * 90000) + 10000)

    }

    const [showBtn, setShowBtn] = useState(false)




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
        <section>

            <h1>{guestOrAdmin ? "Skapa eventkonto" : "Skapa konto för att delta i event"}</h1>

            <button onClick={() => setGuestOrAdmin(false)}>GUEST</button> <button onClick={() => setGuestOrAdmin(true)}>ADMIN</button>
            <article>
                {guestOrAdmin && <input onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Event namn" />}
                <input onChange={(e) => setFirstName(e.target.value)} type="text" placeholder="Förnamn" />
                <input onChange={(e) => setLastName(e.target.value)} type="text" placeholder="Efternamn" />
                <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Användarnamn" />
                <input onChange={(e) => setEmail(e.target.value)} type="text" placeholder="E-mail" />

                <input onChange={(e) => setPassword(e.target.value)} type={showPsw ? "text" : "password"} placeholder="Lösenord" />
                <input onChange={(e) => setConfirmedPassword(e.target.value)} type={showPsw ? "text" : "password"} placeholder="Upprepa löseord" />
                <h5>{eventKey}</h5>
                {guestOrAdmin && <button onClick={() => createKey()}>Ge mig en kod</button>}

                <img onClick={() => setShowPsw(!showPsw)} src={showPsw ? hidePswImg : showPswImg} alt="" />

                {showBtn && <button onClick={() => createNewAccount(guestOrAdmin ? adminAccount : guestAccount)}>Skapa konto</button>}

                {confirmed.usernameExists && <h3>Användarnamnet finns redan</h3>}
                {confirmed.emailExists && !confirmed.usernameExists ? <h3>Denna Email används redan</h3> : null}

            </article>
            {confirmed.success ? <CreatedAccountModal admin={guestOrAdmin} data={guestOrAdmin ? adminAccount : guestAccount} /> : null}
        </section >
    );
}

export default CreateAccount;