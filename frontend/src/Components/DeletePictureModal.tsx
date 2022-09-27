import { Picture, DeletePictureInfo } from "../typesAndInterfaces/interfaces"
import styles from "./InviteGuestModal.module.css"

function DeletePicture(props: DeletePictureInfo | any) { // tar med mindre props from guest därför ANY

    const pictureData = props.deleteInfo
    const closeModalFunc = props.closeModal
    const setNewAllPictures = props.setNewAllPictures
    const index = props.index + 1
    const allPictures = props.allPictures
    const setIndex = props.setIndex
    const eventKey = props.deleteInfo.eventKey

    async function deletePicture(): Promise<void> {
        closeModalFunc(false)

        let picture: Picture = {
            user: pictureData.user,
            picture: pictureData._id,
            index: props.index,
            admin: props.admin,
            eventKey: eventKey
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
            <img className={styles.img} src={pictureData.takenPicture} alt="" />
            <h1 className={styles.youSure}>Är du säker på att du vill radera?</h1>

            <article className={styles.btns}>
                <button onClick={() => deletePicture()}>Radera</button>
                <button onClick={() => closeModalFunc(false)}>Ångra</button>
            </article>
        </section>
    );
}

export default DeletePicture;