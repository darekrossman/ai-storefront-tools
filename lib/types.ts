export type GeneratedImageResponse = {
  images: {
    url: string
    width: number
    height: number
    content_type: string
  }[]
  prompt: string
  seed: number
}
