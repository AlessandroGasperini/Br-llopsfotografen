function DeletePicture(props: any) {


    const pictureData = props.deleteInfo


    async function deletePicture() {

        let picture = {
            user: pictureData.user,
            picture: pictureData._id,
            index: props.index
        }

        const response = await fetch('http://localhost:2500/deletePicture', {
            method: 'DELETE',
            body: JSON.stringify(picture),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        console.log(data);

    }

    return (
        <section className="modalContainer">
            <img src={pictureData.takenPicture} alt="" />
            <h1>ÄR DU SÄKER ATT DU VILL REDERA?</h1>
            <button onClick={() => deletePicture()}>RADERA</button> <button>ÅNGRA</button>

        </section>
    );
}

export default DeletePicture;