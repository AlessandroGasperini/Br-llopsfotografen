
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
    usernameBool: boolean,
}

export interface AddPicture {
    takenPicture: string
    user: string
    eventKey: number,
    firstName: string
}

export interface AllPictures {
    eventKey: number
    takenPicture: string
    user: string
    _id: string,
    firstName: string
}

export interface InputNewAccount {
    title?: string
    firstName: string
    lastName: string
    username: string
    email: string
    password: string
    eventKey?: number
    img?: string
}

export interface NewAccount {
    admin: boolean
data: {
    title?: string
    firstName: string
    lastName: string
    username: string
    email: string
    password: string
    eventKey?: number
    img?: string
}}


export interface Email  {
    from: string
    to: string
    subject: string
    message?: string
    attachments?: Object[]
  }

  export interface DeleteInfo {
        admin: boolean
        email: string
        eventKeySuccess: boolean
        eventTitle: string
        name: string
        success: boolean
        token: string
        usernameBool: boolean
    }

    export interface LoginAdmin {
       data: DeleteInfo
       eventKey: number
       username: string
    }

    export interface InviteGuest {
        setInvite: Function
        userInfo: {
            data: DeleteInfo
            eventKey: number
            username: string
        }
    }
  

  export interface DeleteAccount {
    admin: boolean
    closeModal: Function
    pictures: Array<AllPictures>
    userInfo:  {
        data: DeleteInfo
        eventKey: number
        username: string
    }
    
}

export interface Picture  {
    user: string,
    picture: string,
    index: number
    admin: boolean
    eventKey: number
}


export interface DeletePictureInfo {
    allPictures: number
    closeModal: Function
    setIndex: Function
    setNewAllPictures: Function
    index: number
    deleteInfo: AllPictures
}

