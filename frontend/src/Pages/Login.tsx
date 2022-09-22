import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate()

    const [eventData, setEventData] = useState<any>(true)


    const [showPsw, setShowPsw] = useState<boolean>(false)
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [eventKey, setEventKey] = useState<number>(0)

    interface loginInterface {
        username: string
        password: string
        eventKey: number
    }

    let logIn: loginInterface = {
        username: username,
        password: password,
        eventKey: eventKey
    }

    async function login(logIn: loginInterface) {
        const response = await fetch('http://localhost:2500/login', {
            method: 'PUT',
            body: JSON.stringify(logIn),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);

        setEventData(data)

        if (data.success && data.eventKeySuccess && !data.admin) {
            navigate("/Guest", { state: { data, eventKey, username } })
        } else if (data.success && data.eventKeySuccess && data.admin) {
            navigate("/Admin", { state: { data, eventKey, username } })

        }

    }





    return (
        <section>
            <h1>Login</h1>

            <article>
                <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Användarnamn" />
                <input onChange={(e) => setPassword(e.target.value)} type={showPsw ? "text" : "password"} placeholder="Lösenord" />
                <input onChange={(e) => setEventKey(parseInt(e.target.value))} type="text" placeholder="Event-kod" />
                <input onClick={() => setShowPsw(!showPsw)} type="checkbox" />
                <button onClick={() => login(logIn)}>Logga in</button>


                {eventData.username === false ? <p>Användarnamnet finns ej</p> : null}
                {eventData.success === false && eventData.username === true ? <p>Lösenordet är fel</p> : null}
                {eventData.success === true && eventData.username === true && eventData.eventKeySuccess === false ? <p>Eventet finns inte</p> : null}

                <Link to={"/CreateAccount"}>Skapa konto</Link>
            </article>
        </section>
    );
}

export default Login;