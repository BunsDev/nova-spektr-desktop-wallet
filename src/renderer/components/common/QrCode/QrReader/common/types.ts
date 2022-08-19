export const enum Errors {
  UNABLE_TO_GET_MEDIA,
  USER_DENY,
  NO_VIDEO_INPUT,
  CANNOT_START,
  BAD_NEW_CAMERA,
}

export type ErrorObject = {
  code: Errors;
  message: string;
};
