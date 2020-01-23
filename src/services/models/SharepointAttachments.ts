// Generated by https://quicktype.io

export interface Attachment {
  __metadata: AttachmentMetadata;
  FileName: string;
  FileNameAsPath: Path;
  ServerRelativePath: Path;
  ServerRelativeUrl: string;
}

export interface Path {
  __metadata: FileNameAsPathMetadata;
  DecodedUrl: string;
}

export interface FileNameAsPathMetadata {
  type: Type;
}

export enum Type {
  SPResourcePath = "SP.ResourcePath"
}

export interface AttachmentMetadata {
  id: string;
  uri: string;
  type: string;
}
