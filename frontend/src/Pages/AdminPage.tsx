import { useRef, useState, useEffect } from "react"
import { useNavigate, useLocation, Link, useSearchParams } from "react-router-dom";
import DeleteAccountModal from "../Components/DeleteAccountModal";
import DeletePicture from "../Components/DeletePictureModal";
import trashCan from "../assets/trash.png"
import cameraClosed from "../assets/cameraClosed.png"
import cameraOpen from "../assets/cameraOpen.png"
import { AddPicture, AllPictures, LoginAdmin } from "../typesAndInterfaces/interfaces"
import { UserData, Pictures } from "../typesAndInterfaces/types"
import styles from "./AdminPage.module.css"
import InviteGuestModal from "../Components/InviteGuestModal";
import ChangeEventTitle from "../Components/ChangeEventTitle";
import hamburger from "../assets/hamburger.png"
import left from "../assets/left.png"
import right from "../assets/right.png"



function AdminPage() {

    const navigate = useNavigate()
    const location = useLocation()
    const user: LoginAdmin = location.state


    const [ableDelete, setAbleDelete] = useState<boolean>(false)
    const [accountModal, setAccountModal] = useState<boolean>(false)

    const photoRef = useRef<HTMLCanvasElement | any>(null) // | null funkade inte WTF?
    const videoRef = useRef<HTMLVideoElement | any>(null) // | null funkade inte WTF?
    const [hasPhoto, setHasPhoto] = useState<boolean>(false)
    const [fullPage, setFullPage] = useState<boolean>(false)
    const [deleteCheck, setDeleteCheck] = useState<boolean>(false)

    const [takenPicture, setTakenPicture] = useState<string>("")
    const [pictureSlide, setPictureSlide] = useState<number>(0)
    const [openCloseCam, setOpenCloseCam] = useState<boolean>(true)
    const [closeCam, setCloseCam] = useState<boolean>(false)
    const [invite, setInvite] = useState<boolean>(false)
    const [changeTitle, setChangeTitle] = useState<boolean>(false)
    const [title, setTitle] = useState<string>(user.data.eventTitle)


    const [allPictures, setAllPictures] = useState<AllPictures[]>([])
    localStorage.setItem("allPictures", JSON.stringify(allPictures)); // jaha nudå?? behöver inte använda denna


    useEffect(() => {
        getPictures()
    }, [])

    // Logga ut knappen tas bort vid fullPage picture
    useEffect(() => {
        if (allPictures.length == 0) {
            setFullPage(false)
        }
    })
    
    useEffect(() => {
        if (pictureSlide === allPictures.length) {
            setPictureSlide(0)
        }
    }, [pictureSlide])

    if (pictureSlide === -1) {
        setPictureSlide(allPictures.length - 1)
    }



    function closeCamera(): void {
        setOpenCloseCam(false)
        window.location.reload() // för att kameran ska stängas av helt på
    }

    // Öppna kamera
    function getCamera(): void {
        navigator.mediaDevices.getUserMedia({
            video: { width: 500, height: 500 }
        })
            .then(stream => {
                let video: HTMLVideoElement = videoRef.current
                if (openCloseCam) {
                    video.srcObject = stream
                    video.play()
                } else {
                    let tracks = stream.getTracks();

                    tracks.forEach(function (track) {
                        // stopping every track
                        track.stop();
                        video.srcObject = null;

                        setOpenCloseCam(true)
                    });
                }
            }).catch(err => {
                console.error(err)

            })
        setCloseCam(true)
    }


    // Ta bild
    function takePic(): void {
        const width = 300
        const height = 300
        let video = videoRef.current
        let photo = photoRef.current

        photo.width = width
        photo.height = height

        let ctx: CanvasRenderingContext2D = photo.getContext("2d")

        ctx.drawImage(video, 0, 0, width, height)

        let jpgURL: string = photoRef.current.toDataURL("image/jpeg");

        setHasPhoto(true)
        setTakenPicture(jpgURL)
    }



    // Lägg till bild
    async function addPicture(): Promise<void> {
        let picture: AddPicture = {
            takenPicture: takenPicture,
            user: location.state.username,
            eventKey: location.state.eventKey,
            firstName: user.data.name
        }

        const response = await fetch('http://localhost:2500/addPicture', {
            method: 'POST',
            body: JSON.stringify(picture),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json()
        getPictures()
        setHasPhoto(false)
        getCamera()
    }


    // Hämta alla bilder
    async function getPictures(): Promise<void> {

        let user: UserData = {
            user: location.state.username,
            eventKey: location.state.eventKey,
            admin: true
        }

        const response = await fetch('http://localhost:2500/pictures/userGallery/', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json"
            }

        });
        const data = await response.json();
        setAllPictures(data)
    }


    // Visar en bild på storskärm
    function selectPic(id: number): void {
        setPictureSlide(id)
        setFullPage(true)
    }


    async function isLoggedIn(): Promise<void> {
        //hitta fram vår session storage - ta token därifrån
        const token: string = location.state.data.token
        localStorage.setItem("token", JSON.stringify(token)); // Bara för att :)
        const response = await fetch('http://localhost:2500/loggedin', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        if (data.loggedIn == false) {
            localStorage.clear(); // Rensar allt som sparats
            navigate("/")
            window.location.reload() // Gör så att kameran även stängs av helt!!
        }
    }
    isLoggedIn()

    //Rensar localStorage vid utlogg
    function logOut(): void {
        localStorage.clear();
        navigate("/")
        closeCamera()
    }

    return (
        <section className={styles.container}>
            <header>
                <img onClick={() => setAbleDelete(!ableDelete)} src={hamburger} alt="" />
                {!ableDelete && <h1>{title}</h1>}
                {ableDelete && <article><h4 className={styles.invite} onClick={() => setInvite(true)}>Bjud in</h4></article>}
                {ableDelete && <article><h4 onClick={() => setChangeTitle(true)}>Ändra title</h4></article>}
                {ableDelete && <article><h4 onClick={() => setAccountModal(true)}>Radera konto</h4></article>}
                <img onClick={closeCam ? () => closeCamera() : () => getCamera()} src={closeCam ? cameraOpen : cameraClosed} alt="" />
            </header>

            {
                !hasPhoto && closeCam ? <section className="camera">
                    <video ref={videoRef} ></video>
                    {closeCam && <button className={styles.takePictureBtn} onClick={() => takePic()}>SNAP</button>}
                </section> : null
            }

            <section className={"result" + (hasPhoto ? "hasPhoto" : "")}>
                <canvas ref={photoRef} ></canvas>
            </section>

            <section className={styles.afterPicTaken}>
                {
                    hasPhoto && <button onClick={() => {
                        setHasPhoto(false)
                        getCamera()
                    }}>Ta ny bild</button>
                }
                {takenPicture && hasPhoto && <button onClick={() => addPicture()}>Lägg till bild</button>}
            </section>

            {allPictures.length == 0 && !closeCam && <h4 className={styles.noImg}>Va den första att ta en bild</h4>}

            {
                !closeCam && allPictures.length !== 0 ? < section className={styles.smallPictures} >

                    <section className={!fullPage ? styles.pictureWrap : ""}>

                        {
                            allPictures && !fullPage ?
                                allPictures.map((picture: any, id: number) => (
                                    <article className={styles.allPictures} key={id}>
                                        <img className={styles.oneImg} onClick={() => selectPic(id)} src={picture.takenPicture} alt="" />
                                        <p className={styles.userPhoto}>@{picture.firstName}</p>
                                    </article>
                                )) : null
                        }
                    </section>

                    <section className={styles.pictureToggle}>
                        {
                            fullPage ? <section>
                                {pictureSlide === -1 ? null : <section> {allPictures && allPictures.length != pictureSlide ? <img className={styles.pictureLarge} src={allPictures[pictureSlide].takenPicture} alt="" /> : null} </section>}
                                {allPictures && allPictures.length != pictureSlide && pictureSlide != -1 && <p className={styles.tookPicture}>@{allPictures[pictureSlide].firstName}</p>}
                                {allPictures.length == 1 ? null : <article className={styles.toggleBtns}>
                                    <img onClick={() => setPictureSlide(pictureSlide - 1)} src={left} alt="" />
                                    <img onClick={() => setPictureSlide(pictureSlide + 1)} src={right} alt="" />
                                </article>}

                                <article className={allPictures.length == 1 ? styles.noBtns : styles.trashContainer}>
                                    <h4 onClick={() => setFullPage(false)}>clås</h4>
                                    <img className={styles.trashCan} onClick={() => setDeleteCheck(true)} src={trashCan} alt="" />
                                </article>

                            </section> : null
                        }
                    </section>


                </section > : null}

            {!fullPage && <button className={styles.logOutBtn} onClick={() => logOut()} >Logga ut</button>}

            {changeTitle && <ChangeEventTitle setModal={setChangeTitle} setTitle={setTitle} eventTitle={user.data.eventTitle} />}
            {invite && <InviteGuestModal userInfo={user} setInvite={setInvite} />}
            {deleteCheck && <DeletePicture closeModal={setDeleteCheck} deleteInfo={allPictures[pictureSlide]} setNewAllPictures={setAllPictures} index={pictureSlide} setIndex={setPictureSlide} allPictures={allPictures.length} admin={true} />}
            {accountModal && <DeleteAccountModal pictures={allPictures} closeModal={setAccountModal} userInfo={user} admin={true} />}

        </section>
    );
}

export default AdminPage;