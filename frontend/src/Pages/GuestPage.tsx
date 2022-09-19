import { useRef, useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom";

function GuestPage() {

    const location = useLocation()

    const photoRef = useRef<any>(null)
    const videoRef = useRef<any>(null)
    const [hasPhoto, setHasPhoto] = useState<boolean>(false)

    const [takenPicture, setTakenPicture] = useState<string>("")


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

        let dada = photoRef.current.toDataURL()
        setTakenPicture(dada)

        console.log(dada);

    }



    async function addPicture() {

        let picture = {
            takenPicture: takenPicture,
            user: location.state
        }

        const response = await fetch('http://localhost:2500/api/addPicture', {
            method: 'POST',
            body: JSON.stringify(picture),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
    }




    return (
        <section>
            <h1>Gäääst</h1>


            <section className="camera">
                <video ref={videoRef} ></video>
                <button onClick={() => takePic()}>SNAP</button>
            </section>



            <section className={"result" + (hasPhoto ? "hasPhoto" : "")}>
                <canvas ref={photoRef} ></canvas>
                <button>CLOSE</button>
            </section>

            <button onClick={() => addPicture()}>Lägg till bild</button>

            <button onClick={() => getCamera()}>Öppna Kamera</button>

        </section>
    );
}

export default GuestPage;