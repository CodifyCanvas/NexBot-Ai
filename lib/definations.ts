export interface Chat {
  id: number
  userId: number
  chatId: string
  title: string
  isShareable: boolean
  createdAt: string // or `Date` if you parse it
}
