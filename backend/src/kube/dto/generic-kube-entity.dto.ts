export class ImageDto {
  name: string;
  image: string;
}

export class ImageListDto {
  name: string;
  gitAnnotations: object;
  imageList: ImageDto[];
}
