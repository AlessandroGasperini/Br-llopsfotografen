import { useLocation, Link } from "react-router-dom";

function MyFavourites() {

    const location = useLocation()
    const data = location.state



    async function getFavourites() {
        let user = {
            user: location.state.username
        }
        const response = await fetch('http://localhost:2500/pictures', {
            method: 'PUT',
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
    }

    return (
        <section>
            <h1>{data.name}s sparade favoriter</h1>
        </section>
    );
}

export default MyFavourites;