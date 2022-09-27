import { useRef, useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom";
import DeletePicture from "../Components/DeletePictureModal";
import trashCan from "../assets/trash.png"
import cameraClosed from "../assets/cameraClosed.png"
import cameraOpen from "../assets/cameraOpen.png"
import { EventData, AddPicture, AllPictures } from "../typesAndInterfaces/interfaces"
import { UserData } from "../typesAndInterfaces/types"
import styles from "./GuestPage.module.css"
import left from "../assets/left.png"
import right from "../assets/right.png"

function GuestPage() {

    const navigate = useNavigate()
    const location = useLocation()
    const userData: EventData = location.state.data

    const photoRef = useRef<HTMLCanvasElement | any>(null) // | null funkade inte WTF?
    const videoRef = useRef<HTMLVideoElement | any>(null) // | null funkade inte WTF?
    const [hasPhoto, setHasPhoto] = useState<boolean>(false)

    const [takenPicture, setTakenPicture] = useState<string>("")
    const [pictureSlide, setPictureSlide] = useState<number>(0)
    const [openCloseCam, setOpenCloseCam] = useState<boolean>(true)
    const [closeCam, setCloseCam] = useState<boolean>(false)
    const [fullPage, setFullPage] = useState<boolean>(false)
    const [deleteCheck, setDeleteCheck] = useState<boolean>(false)

    const [allPictures, setAllPictures] = useState<AllPictures[]>([])
    localStorage.setItem("allPictures", JSON.stringify(allPictures));


    // Logga ut knappen tas bort vid fullPage picture
    useEffect(() => {
        if (allPictures.length == 0) {
            setFullPage(false)
        }
    })

    useEffect(() => {
        getPictures()
    }, [])


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
        window.location.reload()
    }

    // Öppna kameran
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
                    let tracks = stream.getTracks(); // void??

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
        let video = videoRef.current // Object??
        let photo = photoRef.current // Object??

        photo.width = width
        photo.height = height

        let ctx: CanvasRenderingContext2D = photo.getContext("2d")

        ctx.drawImage(video, 0, 0, width, height)

        let jpgURL: string = photoRef.current.toDataURL("image/jpeg");
        setHasPhoto(true)
        setTakenPicture(jpgURL)
    }

    // Lägger till bilder
    async function addPicture(): Promise<void> {
        let picture: AddPicture = {
            takenPicture: takenPicture,
            user: location.state.username,
            eventKey: location.state.eventKey,
            firstName: userData.name
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

    // Hämtar guests takna bilder på detta event
    async function getPictures(): Promise<void> {

        let user: UserData = {
            user: location.state.username,
            eventKey: location.state.eventKey,
            admin: false
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
        localStorage.setItem("token", JSON.stringify(token)); // jaha nudå?? behöver inte använda denna

        const response = await fetch('http://localhost:2500/loggedin', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        if (data.loggedIn == false) {
            localStorage.clear(); // Rensar allt som sparats
            window.location.reload() // Gör så att kameran även stängs av
            navigate("/")
        }
    }
    isLoggedIn()


    // Loggar ut, rensar och stänger av kameran om den är på
    function logOut(): void {
        localStorage.clear();
        navigate("/")
        closeCamera()
    }

    return (
        <section>

            <header className={styles.header}>
                <h1>{userData.eventTitle}</h1>
                <img onClick={closeCam ? () => closeCamera() : () => getCamera()} src={closeCam ? cameraOpen : cameraClosed} alt="" />
            </header>

            <p className={styles.name}>{userData.name}</p>

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


            {allPictures.length == 0 && !closeCam && <h4 className={styles.noImg}>Ta en bild då tråkmåns</h4>}

            {
                !closeCam && allPictures.length !== 0 ? < section className={styles.smallPictures} >

                    <section className={!fullPage ? styles.pictureWrap : ""}>
                        {
                            allPictures && !fullPage ?
                                allPictures.map((picture: any, id: number) => (
                                    <article className={styles.allPictures} key={id}>
                                        <img className={styles.oneImg} onClick={() => selectPic(id)} src={picture.takenPicture} alt="" />
                                    </article>
                                )) : null
                        }
                    </section>


                    <section className={styles.pictureToggle}>
                        {
                            fullPage ? <section>
                                {pictureSlide === -1 ? null : <section> {allPictures && allPictures.length != pictureSlide ? <img className={styles.pictureLarge} src={allPictures[pictureSlide].takenPicture} alt="" /> : null} </section>}

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


                    {deleteCheck && <DeletePicture closeModal={setDeleteCheck} deleteInfo={allPictures[pictureSlide]} setNewAllPictures={setAllPictures} index={pictureSlide} setIndex={setPictureSlide} allPictures={allPictures.length} admin={false} />}

                </section > : null}
            {!fullPage && <button className={styles.logOutBtn} onClick={() => logOut()} >Logga ut</button>}
        </section >
    );
}

export default GuestPage;