import React from "react";
import { Link } from "react-router-dom";

function CreatedAccountModal(props: any) {


    const info = props.data


    return (
        <section className="modalContainer">
            Välkommen {info.firstName}

            {info.eventKey ? <article>
                DIN EVENTKOD ÄR
                <br />
                {info.eventKey}
                <br />
                TA EN SCREENSHOT OCH DELA MED GÄSTERNA
            </article> : null}

            <Link to={"/"}><button>Logga in</button></Link>

        </section>
    );
}

export default CreatedAccountModal;