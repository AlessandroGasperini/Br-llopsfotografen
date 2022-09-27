import { useState } from "react";
import { EventModal, EventInfo } from "../typesAndInterfaces/types"
import styles from "./InviteGuestModal.module.css"

function ChangeEventTitle(props: EventModal) {

    const [changedTittle, setChangedTitle] = useState<string>("")

    async function changeTitle() {
        props.setTitle(changedTittle) // byter titel på sidan
        props.setModal(false) // Stänger modal

        let eventInfo: EventInfo = {
            title: props.eventTitle,
            newTitle: changedTittle
        }

        const response = await fetch('http://localhost:2500/changeTitle', {
            method: 'PUT',
            body: JSON.stringify(eventInfo),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json();
    }

    return (
        <section className="modalContainer">
            <h1 className={styles.h1}>Ändrea eventnamn</h1>

            <input className={styles.inputTitle} placeholder="Nytt titelnamn" onChange={(e) => setChangedTitle(e.target.value)} type="text" />

            {changedTittle != "" ? <button className={styles.inviteBtn} onClick={() => changeTitle()}>Ändra</button> : null}

            <button className={styles.close} onClick={() => props.setModal(false)}>stäng</button>
        </section>
    );
}

export default ChangeEventTitle;