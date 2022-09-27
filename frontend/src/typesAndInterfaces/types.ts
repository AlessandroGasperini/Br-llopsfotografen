export type UserData = {
  user: string,
  eventKey: number,
  admin: boolean
}

export type Pictures = {
  takenPicture: string,
}

export type UserName = {
  userInfo: string,
}

export type Emails = {
  email: string
  eventKey: number
  username: string
  _id: string
}

export type EventKey = {
  eventKey: number,
}

export type DeletePictureInfo = {
  user: UserData,
  picture: Pictures
}

export type EventModal = {
  eventTitle: string
  setModal: Function//?????
  setTitle: Function //?????
}

export type EventInfo = {
  title: string
  newTitle: string
}


export type ConfirmAccount = {
  emailExists: boolean
  eventKeyExists: boolean
  success: boolean
  usernameExists: boolean
}



