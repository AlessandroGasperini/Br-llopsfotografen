import { useState } from "react";


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

    interface newAccount {
        title?: string
        firstName: string
        lastName: string
        username: string
        email: string
        password: string
        eventKey?: number
    }

    let adminAccount: newAccount = {
        title: title,
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: password,
        eventKey: eventKey
    }

    let guestAccount: newAccount = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: password,
    }


    async function createNewAccount(account: newAccount) {
        const response = await fetch('http://localhost:2500/api/signup', {
            method: 'POST',
            body: JSON.stringify(account),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        console.log(data);
    }


    function createKey() {
        setEventKey(Math.floor(Math.random() * 90000) + 10000)

    }

    // const [tryKey, setTryKey] = useState<boolean>()

    // async function createKey() {
    //     // let key = Math.floor(Math.random() * 90000) + 10000;

    //     let kekek = Math.floor(Math.random() * 5) + 1;

    //     const response = await fetch('http://localhost:2500/api/controllKey', {
    //         method: 'POST',
    //         body: JSON.stringify({ kekek }),
    //         headers: {
    //             "Content-Type": "application/json"
    //         }
    //     });
    //     const data = await response.json();
    //     setEventKey(kekek)
    //     setTryKey(data.keyExcists)
    // }
    // console.log(tryKey);


    // if (tryKey === true) {
    //     // createKey()
    //     console.log("ni gör vi en ny nyckel");

    // }





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

                <h5>{eventKey}</h5>
                {guestOrAdmin && <button onClick={() => createKey()}>Ge mig en kod</button>}
                <input onClick={() => setShowPsw(!showPsw)} type="checkbox" />
                <button onClick={() => createNewAccount(guestOrAdmin ? adminAccount : guestAccount)}>Skapa konto</button>
            </article>

        </section >
    );
}

export default CreateAccount;