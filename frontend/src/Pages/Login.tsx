import { useState } from "react";

function Login() {

    const [showPsw, setShowPsw] = useState(false)


    return (
        <section>
            <h1>Login</h1>

            <article>
                <input type="text" placeholder="Användarnamn" />
                <input type={showPsw ? "text" : "password"} placeholder="Lösenord" />
                <input type="text" placeholder="Event-kod" />
                <input onClick={() => setShowPsw(!showPsw)} type="checkbox" />
                <button>Logga in</button>
            </article>
        </section>
    );
}

export default Login;