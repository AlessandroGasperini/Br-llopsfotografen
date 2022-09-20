import { useRef, useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom";

function GuestPage() {

    const location = useLocation()
    const userData = location.state.data

    const photoRef = useRef<any>(null)
    const videoRef = useRef<any>(null)
    const [hasPhoto, setHasPhoto] = useState<boolean>(false)

    const [takenPicture, setTakenPicture] = useState<string>("")
    const [selectedPicture, setSelectedPicture] = useState<any>()
    const [pictureOptions, setPictureOptions] = useState<boolean>(false)
    const [pictureSlide, setPictureSlide] = useState<number>(0)


    function getCamera() {
        navigator.mediaDevices.getUserMedia({
            video: { width: 500, height: 500 }
        })
            .then(stream => {
                let video = videoRef.current

                video.srcObject = stream
                video.play()
            }).catch(err => {
                console.error(err)

            })
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
        // let dada = photoRef.current.toDataURL()

        setTakenPicture(jpgURL)

        // console.log(jpgURL);


        //closeCamera() ------------????????

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
        const data = await response.json();
    }




    const [allPictures, setAllPictures]: any = useState([])

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



    async function deletePicture() {

        let picture = {
            user: location.state.username
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





    function selectPic(picture: any, id: number) {
        setSelectedPicture(picture)
        setPictureSlide(id)
    }


    useEffect(() => {
        if (pictureSlide === allPictures.length) {
            setPictureSlide(0)
        }
    }, [pictureSlide])


    return (
        <section>
            <h1>{userData.eventTitle}</h1>
            <p>Gäst</p>

            {photoRef.current != null ? null : <section className="camera">
                <video ref={videoRef} ></video>
                <button onClick={() => takePic()}>SNAP</button>
            </section>}



            <section className={"result" + (hasPhoto ? "hasPhoto" : "")}>
                <canvas ref={photoRef} ></canvas>
                <button>CLOSE</button>
            </section>

            <button onClick={() => addPicture()}>Lägg till bild</button>

            <button onClick={() => getCamera()}>Öppna Kamera</button>

            {allPictures ?
                allPictures.map((picture: any, id: number) => (
                    <article>
                        <img className="img" onClick={() => selectPic(picture, id)} src={picture.takenPicture} alt="" />
                    </article>
                )) : null
            }


            {allPictures && allPictures.length != pictureSlide ? <img src={allPictures[pictureSlide].takenPicture} alt="" /> : null}
            <button onClick={() => setPictureSlide(pictureSlide - 1)}>left</button> <button onClick={() => setPictureSlide(pictureSlide + 1)}>right</button><h4>X</h4>

        </section>
    );
}

export default GuestPage;