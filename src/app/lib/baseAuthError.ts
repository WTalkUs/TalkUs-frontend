import { FirebaseError } from "firebase/app";

/** Dictionary containing some firebase auth error messages in Spanish to show to end user
 *
 * @see https://gist.github.com/eduardolat/f666d3f9319abe61ccf29573b90d08c0
 *
 * Could be more useful to use a library like: @see https://github.com/JebBarbas/firebase-error-translator
 * but seems abandoned and apparently there isn't any npm package published
 */
const firebaseErrorCodeToEndUserMessage: Record<string, string> = {
  "auth/app-deleted": "No se encontró la base de datos",
  "auth/expired-action-code": "El código de acción o el enlace ha caducado",
  "auth/invalid-action-code":
    "El código de acción no es válido. Esto puede suceder si el código está mal formado o ya se ha utilizado",
  "auth/user-disabled": "El usuario correspondiente esta deshabilitado",
  "auth/weak-password": "La contraseña es demasiado débil",
  "auth/invalid-email": "La dirección de correo electrónico no es válida",
  "auth/invalid-credential": "Usuario o Contraseña incorrecta",
  "auth/wrong-password": "Usuario o Contraseña incorrecta",
  "auth/user-not-found": "Usuario o Contraseña incorrecta",

  "auth/email-already-in-use":
    "Correo electrónico ya está en uso por otra cuenta",
  "auth/account-exists-with-different-credential":
    "Correo electrónico ya asociado con otra cuenta",
  "auth/credential-already-in-use": "Ya existe una cuenta para esta credencial",

  "auth/operation-not-allowed":
    "El tipo de cuenta correspondiente a esta credencial aún no está activado",
  "auth/invalid-verification-code":
    "El código de verificación de credencial no es válido",
  "auth/invalid-verification-id":
    "El ID de verificación de credencial no es válido",
};

export function parseFirebaseAuthError(error: unknown): string {
  const defaultErrorMessage = "Algo Salio mal, por favor intente de nuevo";

  if (!(error instanceof FirebaseError) || !(error instanceof Error)) {
    return defaultErrorMessage;
  }

  const isKnownError = !!firebaseErrorCodeToEndUserMessage[error.code];
  if (!isKnownError) return defaultErrorMessage;

  return firebaseErrorCodeToEndUserMessage[error.code];
}