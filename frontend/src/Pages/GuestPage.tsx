import { useRef, useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom";
import DeletePicture from "../Components/DeletePictureModal";
import trashCan from "../assets/trash.png"

function GuestPage() {

    const navigate = useNavigate()
    const location = useLocation()
    const userData = location.state.data
    console.log("gusest", location.state);

    const photoRef = useRef<any>(null)
    const videoRef = useRef<any>(null)
    const [hasPhoto, setHasPhoto] = useState<boolean>(false)

    const [takenPicture, setTakenPicture] = useState<string>("")
    const [pictureSlide, setPictureSlide] = useState<number>(0)
    const [openCloseCam, setOpenCloseCam] = useState<boolean>(true)
    const [closeCam, setCloseCam] = useState<boolean>(false)


    function closeCamera() {
        setOpenCloseCam(false)
        window.location.reload()
    }


    function getCamera() {
        navigator.mediaDevices.getUserMedia({
            video: { width: 500, height: 500 }
        })
            .then(stream => {
                let video = videoRef.current
                if (openCloseCam) {
                    video.srcObject = stream
                    video.play()
                } else {
                    let tracks = stream.getTracks();
                    // now close each track by having forEach loop
                    tracks.forEach(function (track) {
                        // stopping every track
                        track.stop();
                        video.srcObject = null;

                        // vi var här!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                        setOpenCloseCam(true)
                        // window.location.reload()
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

    function takePic() {
        const width = 414
        const height = 400
        let video = videoRef.current
        let photo = photoRef.current

        photo.width = width
        photo.height = height

        let ctx = photo.getContext("2d")

        ctx.drawImage(video, 0, 0, width, height)
        setHasPhoto(true)

        var jpgURL = photoRef.current.toDataURL("image/jpeg");

        setTakenPicture(jpgURL)
    }




    async function addPicture() {
        let picture = {
            takenPicture: takenPicture,
            user: location.state.username,
            eventKey: location.state.eventKey
        }

        const response = await fetch('http://localhost:2500/addPicture', {
            method: 'POST',
            body: JSON.stringify(picture),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json()
        console.log(data);
        getPictures()
        setHasPhoto(false)
        getCamera()

    }




    const [allPictures, setAllPictures]: any = useState([])
    console.log(allPictures);


    async function getPictures() {
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
        setAllPictures(data)
    }

    useEffect(() => {
        getPictures()
    }, [])



    const [fullPage, setFullPage] = useState(false)
    const [deleteCheck, setDeleteCheck] = useState(false)


    function selectPic(id: number) {
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


    async function isLoggedIn() {
        //hitta fram vår session storage - ta token därifrån
        const token = location.state.data.token

        const response = await fetch('http://localhost:2500/loggedin', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        if (data.loggedIn == false) {
            sessionStorage.clear(); // Rensar allt som sparats
            window.location.reload() // Gör så att kameran även stängs av
            navigate("/")
        }
    }
    isLoggedIn()




    return (
        <section>
            <h1>{userData.eventTitle}</h1>
            <p>{userData.name}</p>

            {!hasPhoto && closeCam ? <section className="camera">
                <video ref={videoRef} ></video>
                {closeCam && <button onClick={() => takePic()}>SNAP</button>}
            </section> : null}

            {hasPhoto && <button onClick={() => {
                setHasPhoto(false)
                getCamera()
            }}>Ta ny bild</button>}


            <section className={"result" + (hasPhoto ? "hasPhoto" : "")}>
                <canvas ref={photoRef} ></canvas>
            </section>

            {takenPicture && hasPhoto && <button onClick={() => addPicture()}>Lägg till bild</button>}

            {!hasPhoto && <button onClick={closeCam ? () => closeCamera() : () => getCamera()}>{closeCam ? "Stäng kamera" : "Öppna kamera"}</button>}


            {!closeCam && <section>

                <h4>Dina bilder</h4>
                {allPictures && !fullPage ?
                    allPictures.map((picture: any, id: number) => (
                        <article key={id}>
                            <img className="img" onClick={() => selectPic(id)} src={picture.takenPicture} alt="" />
                        </article>
                    )) : null
                }

                {fullPage ? <section>
                    {pictureSlide === -1 ? null : <section> {allPictures && allPictures.length != pictureSlide ? <img src={allPictures[pictureSlide].takenPicture} alt="" /> : null} </section>}
                    {allPictures.length == 1 ? null : <article>
                        <button onClick={() => setPictureSlide(pictureSlide - 1)}>left</button>
                        <button onClick={() => setPictureSlide(pictureSlide + 1)}>right</button>
                    </article>}

                    <img className="trashCan" onClick={() => setDeleteCheck(true)} src={trashCan} alt="" />

                    <h4 onClick={() => setFullPage(false)}>X</h4>
                </section> : null}

                {deleteCheck && <DeletePicture closeModal={setDeleteCheck} deleteInfo={allPictures[pictureSlide]} index={pictureSlide} />}
            </section>}
        </section>
    );
}

export default GuestPage;