import { useRef, useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom";

function AdminPage() {

    const location = useLocation()
    const user = location.state

    console.log(user);




    return (
        <section>
            <h1>{user.data.eventTitle}</h1>
            <p>Admin Page</p>
        </section>
    );
}

export default AdminPage;