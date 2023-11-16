export class UploadFileRequestDto {
  image?: Express.Multer.File[];
  video?: Express.Multer.File[];
  voice?: Express.Multer.File[];
}
