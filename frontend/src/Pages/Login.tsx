import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css"
import hidePswImg from "../assets/hidePsw.png"
import showPswImg from "../assets/showPsw.png"
import hamburger from "../assets/hamburger.png"
import logo from "../assets/logo.png"
import { LoginInterface, EventData } from "../typesAndInterfaces/interfaces"


function Login() {
    const navigate = useNavigate()

    const [eventData, setEventData] = useState<EventData | any>(false) // any????????? inte satt än


    const [showPsw, setShowPsw] = useState<boolean>(false)
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [eventKey, setEventKey] = useState<number>(0)

    let logIn: LoginInterface = {
        username: username,
        password: password,
        eventKey: eventKey
    }



    async function login(logIn: LoginInterface): Promise<void> {
        const response = await fetch('http://localhost:2500/login/getUser/', {
            method: 'POST',
            body: JSON.stringify(logIn),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data: EventData = await response.json();
        setEventData(data)

        if (data.success && data.eventKeySuccess && !data.admin) {
            navigate("/Guest", { state: { data, eventKey, username } })
        } else if (data.success && data.eventKeySuccess && data.admin) {
            navigate("/Admin", { state: { data, eventKey, username } })

        }
    }

    return (
        <section className={styles.container}>
            <header>
                <img className={styles.hamburger} src={hamburger} alt="" />
                <h1>P h y l l o g r a p h e n</h1>
                <img className={styles.logo} src={logo} alt="" />
            </header>



            <article className={styles.inputs}>
                <article>
                    <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Användarnamn" />
                </article>

                <article>
                    <input onChange={(e) => setPassword(e.target.value)} type={showPsw ? "text" : "password"} placeholder="Lösenord" />
                </article>

                <article>
                    <input onChange={(e) => setEventKey(parseInt(e.target.value))} type="text" placeholder="Event-kod" />
                    <section className={styles.eye}>
                        <img onClick={() => setShowPsw(!showPsw)} src={showPsw ? hidePswImg : showPswImg} alt="" />
                    </section>
                </article>

                <article className={styles.btnAndPswContainer}>
                    <button onClick={() => login(logIn)}>Logga in</button>
                </article>

                <article className={styles.wrongLogin}>
                    {eventData.usernameBool === false ? <p>Användarnamnet finns ej</p> : null}
                    {eventData.success === false && eventData.usernameBool === true ? <p>Lösenordet är fel</p> : null}
                    {eventData.success === true && eventData.usernameBool === true && eventData.eventKeySuccess === false ? <p>Eventet finns inte</p> : null}
                </article>


                <div className={styles.createBtn}><Link className={styles.createLink} to={"/CreateAccount"}>Skapa konto</Link></div>
            </article>
        </section>
    );
}

export default Login;