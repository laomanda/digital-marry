export type GuestWish = {
  id: string | number
  name: string
  message: string
  attending: boolean
  time: string
  source?: 'rsvp' | 'seed'
}
