import React from "react";
import { Link } from "react-router-dom";

function CreatedAccountModal(props: any) {

    const info = props.data

    console.log(info.email);

    const email = {
        from: "asg.gasperini@gmail.com",
        to: info.email,
        subject: "Phyllographen - Eventkod till " + info.title,
        message: "EVENTKOD: " + info.eventKey
    }

    async function sendEmail() {

        const response = await fetch('http://localhost:2500/sendEmail', {
            method: 'POST',
            body: JSON.stringify(email),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json();
        console.log(data);

    }

    return (
        <section className="modalContainer">
            Välkommen {info.firstName}

            {info.eventKey ? <article>
                DIN EVENTKOD ÄR
                <br />
                {info.eventKey}
                <br />
                TA EN SCREENSHOT OCH DELA MED GÄSTERNA
                DU HITTAR ÄVEN KODEN PÅ DIN MAIL
            </article> : null}

            <Link to={"/"}><button onClick={() => sendEmail()}>Logga in</button></Link>

        </section>
    );
}

export default CreatedAccountModal;