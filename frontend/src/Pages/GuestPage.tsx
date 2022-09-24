import { useRef, useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom";
import DeletePicture from "../Components/DeletePictureModal";
import trashCan from "../assets/trash.png"
import cameraClosed from "../assets/cameraClosed.png"
import cameraOpen from "../assets/cameraOpen.png"
import { EventData, AddPicture, AllPictures } from "../typesAndInterfaces/interfaces"
import { UserData } from "../typesAndInterfaces/types"



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

    const [allPictures, setAllPictures] = useState<AllPictures[]>([])
    localStorage.setItem("allPictures", JSON.stringify(allPictures));

    function closeCamera(): void {
        setOpenCloseCam(false)
        window.location.reload()
    }


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

    if (!openCloseCam) {
        getCamera()
    }

    function takePic(): void { // ??? Void nu pga saknar return
        const width = 414
        const height = 400
        let video = videoRef.current
        let photo = photoRef.current

        photo.width = width
        photo.height = height

        let ctx = photo.getContext("2d")// VAD BLIR DETTA I TS?

        ctx.drawImage(video, 0, 0, width, height)

        let jpgURL = photoRef.current.toDataURL("image/jpeg"); // VAD BLIR DETTA I TS?
        setHasPhoto(true)
        setTakenPicture(jpgURL)
    }




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

    useEffect(() => {
        getPictures()
    }, [])



    const [fullPage, setFullPage] = useState(false)
    const [deleteCheck, setDeleteCheck] = useState(false)


    function selectPic(id: number): void {
        setPictureSlide(id)
        setFullPage(true)
    }


    useEffect(() => {
        if (pictureSlide === allPictures.length) {
            setPictureSlide(0)
        }

    }, [pictureSlide])

    if (pictureSlide === -1) {
        setPictureSlide(allPictures.length - 1)
    }



    async function isLoggedIn(): Promise<void> {
        //hitta fram vår session storage - ta token därifrån
        const token = location.state.data.token

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

            <header>
                <h1>{userData.eventTitle}</h1>
                <img onClick={closeCam ? () => closeCamera() : () => getCamera()} src={closeCam ? cameraOpen : cameraClosed} alt="" />
            </header>

            <p>{userData.name}</p>


            {
                !hasPhoto && closeCam ? <section className="camera">
                    <video ref={videoRef} ></video>
                    {closeCam && <button onClick={() => takePic()}>SNAP</button>}
                </section> : null
            }

            {
                hasPhoto && <button onClick={() => {
                    setHasPhoto(false)
                    getCamera()
                }}>Ta ny bild</button>
            }


            <section className={"result" + (hasPhoto ? "hasPhoto" : "")}>
                <canvas ref={photoRef} ></canvas>
            </section>

            {takenPicture && hasPhoto && <button onClick={() => addPicture()}>Lägg till bild</button>}

            {allPictures.length == 0 && <h4>Ta en bild då tråkmåns</h4>}

            {
                !closeCam && allPictures.length !== 0 ? < section >

                    <h4>Dina bilder</h4>
                    {
                        allPictures && !fullPage ?
                            allPictures.map((picture: any, id: number) => (
                                <article key={id}>
                                    <img className="img" onClick={() => selectPic(id)} src={picture.takenPicture} alt="" />
                                </article>
                            )) : null
                    }


                    {
                        fullPage ? <section>
                            {pictureSlide === -1 ? null : <section> {allPictures && allPictures.length != pictureSlide ? <img src={allPictures[pictureSlide].takenPicture} alt="" /> : null} </section>}
                            {allPictures.length == 1 ? null : <article>
                                <button onClick={() => setPictureSlide(pictureSlide - 1)}>left</button>
                                <button onClick={() => setPictureSlide(pictureSlide + 1)}>right</button>
                            </article>}

                            <img className="trashCan" onClick={() => setDeleteCheck(true)} src={trashCan} alt="" />
                            {deleteCheck && <DeletePicture closeModal={setDeleteCheck} deleteInfo={allPictures[pictureSlide]} index={pictureSlide} />}

                            <h4 onClick={() => setFullPage(false)}>X</h4>
                        </section> : null
                    }

                    {deleteCheck && <DeletePicture closeModal={setDeleteCheck} deleteInfo={allPictures[pictureSlide]} setNewAllPictures={setAllPictures} index={pictureSlide} setIndex={setPictureSlide} allPictures={allPictures.length} />}

                </section > : null}
            <button onClick={() => logOut()} >Logga ut</button>
        </section >
    );
}

export default GuestPage;