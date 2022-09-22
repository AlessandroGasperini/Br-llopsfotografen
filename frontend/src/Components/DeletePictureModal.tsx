function DeletePicture(props: any) {


    const pictureData = props.deleteInfo
    const closeModalFunc = props.closeModal

    async function deletePicture() {
        window.location.reload()
        // Raderar från alla bilder (picturesDB)
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

    }

    return (
        <section className="modalContainer">
            <img src={pictureData.takenPicture} alt="" />
            <h1>ÄR DU SÄKER ATT DU VILL REDERA?</h1>
            <button onClick={() => deletePicture()}>RADERA</button>
            <button onClick={() => closeModalFunc(false)}>ÅNGRA</button>
        </section>
    );
}

export default DeletePicture;