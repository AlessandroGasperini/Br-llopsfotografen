import { useState } from "react";

function ChangeEventTitle(props: any) {

    const [changedTittle, setChangedTitle] = useState("")

    async function changeTitle() {
        props.setTitle(changedTittle)
        props.setModal(false)
        let eventInfo = {
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
        console.log(data);
    }

    return (
        <section className="modalContainer">
            <h1>Ändrea eventnamn</h1>

            <input onChange={(e) => setChangedTitle(e.target.value)} type="text" />

            {changedTittle != "" ? <button onClick={() => changeTitle()}>Ändra</button> : null}

            <button onClick={() => props.setModal(false)}>stäng</button>
        </section>
    );
}

export default ChangeEventTitle;