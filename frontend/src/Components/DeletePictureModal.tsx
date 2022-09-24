function DeletePicture(props: any) {


    const pictureData = props.deleteInfo
    const closeModalFunc = props.closeModal
    const setNewAllPictures = props.setNewAllPictures
    const index = props.index + 1
    const allPictures = props.allPictures
    const setIndex = props.setIndex


    console.log(allPictures, index);


    async function deletePicture() {
        closeModalFunc(false)

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
        }).then(resp => resp.json())
            .then(data => setNewAllPictures(data)
            )

        if (allPictures === index) {
            setIndex(0)
        }

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