export interface LoginInterface {
    username: string
    password: string
    eventKey: number
}

export interface EventData {
    admin: boolean
    eventKeySuccess: boolean
    eventTitle: string
    name: string
    success: boolean
    token: string
    usernameBool: boolean
}

export interface AddPicture {
    takenPicture: string
    user: string
    eventKey: number
}

export interface AllPictures {
    eventKey: number
    takenPicture: string
    user: string
    _id: string
}