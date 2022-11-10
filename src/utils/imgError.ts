import { AppModule } from '@/store/modules/app'

export const imgError = (e: Event) => {
  if (AppModule.bookInfo.bookCover) {
    (e.target as HTMLImageElement).src = AppModule.bookInfo.bookCover
  } else {
    (e.target as HTMLImageElement).style.display = 'none'
  }
}

export const imgErrorNone = (e: Event) => {
  (e.target as HTMLImageElement).style.display = 'none'
}
