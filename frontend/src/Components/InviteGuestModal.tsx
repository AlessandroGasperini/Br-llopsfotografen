import { useState } from "react";

function InviteGuestModal(props: any) {

    const [emailInfo, setEmailInfo] = useState<string>("")

    const userProps = props.userInfo.data

    const email = {
        from: "asg.gasperini@gmail.com",
        to: emailInfo,
        subject: "Phyllographen - Eventkod till " + userProps.eventTitle,
        message: "Ladda ner Phyllographen skapa gästkonto och använd eventkoden. EVENTKOD: " + props.userInfo.eventKey
    }

    async function sendEmail() {

        await props.setInvite(false)

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
            <h1>Bjud in gäster och dela med dig av eventkoden</h1>
            <input type="email" onChange={(e) => setEmailInfo(e.target.value)} />

            <button onClick={() => props.setInvite(false)}>STÄNG</button>
            {emailInfo != "" && <button onClick={() => sendEmail()}>BJUD IN</button>}
        </section>
    );
}

export default InviteGuestModal;