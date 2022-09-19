import { useState } from "react";


function CreateAccount() {
    const [showPsw, setShowPsw] = useState<boolean>(false)
    const [guestOrAdmin, setGuestOrAdmin] = useState<boolean>(false)


    const [title, setTitle] = useState<string>("")
    const [firstName, setFirstName] = useState<string>("")
    const [LastName, setLastName] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmedPassword] = useState<string>("")
    const [eventKey, setEventKey] = useState<string>("")





    return (
        <section>

            <button onClick={() => setGuestOrAdmin(false)}>GUEST</button> <button onClick={() => setGuestOrAdmin(true)}>ADMIN</button>
            <article>
                {guestOrAdmin && <input onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Event namn" />}
                <input onChange={(e) => setFirstName(e.target.value)} type="text" placeholder="Förnamn" />
                <input onChange={(e) => setLastName(e.target.value)} type="text" placeholder="Efternamn" />
                <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Användarnamn" />
                <input onChange={(e) => setEmail(e.target.value)} type="text" placeholder="E-mail" />

                <input onChange={(e) => setPassword(e.target.value)} type={showPsw ? "text" : "password"} placeholder="Lösenord" />
                <input onChange={(e) => setConfirmedPassword(e.target.value)} type={showPsw ? "text" : "password"} placeholder="Upprepa löseord" />

                {guestOrAdmin && <input onChange={(e) => setEventKey(e.target.value)} type="text" placeholder="Event-kod" />}
                <input onClick={() => setShowPsw(!showPsw)} type="checkbox" />
                <button>Logga in</button>
            </article>

        </section >
    );
}

export default CreateAccount;