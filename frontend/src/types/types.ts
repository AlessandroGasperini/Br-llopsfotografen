export type UserData = {
  userName: string,
}

export type Pictures = {
  takenPicture: string,
}

export type DeletePictureInfo = {
  user: UserData,
  picture: Pictures
}