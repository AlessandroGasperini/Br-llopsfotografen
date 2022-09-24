export type UserData = {
  user: string,
  eventKey: number,
  admin: boolean
}

export type Pictures = {
  takenPicture: string,
}

export type DeletePictureInfo = {
  user: UserData,
  picture: Pictures
}

export type Email = {
  from: string
  to: string
  subject: string
  message?: string 
}