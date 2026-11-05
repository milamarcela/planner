import { loadJSON, saveJSON } from "./storage";

const KEY = "profile";

export interface Profile {
  name: string;
  avatar: string;
}

export function getProfile(): Profile {
  return loadJSON<Profile>(KEY, { name: "", avatar: "" });
}

export function saveProfile(profile: Profile): void {
  saveJSON(KEY, profile);
}

export function setAvatar(dataUrl: string): void {
  saveProfile({ ...getProfile(), avatar: dataUrl });
}

export function readImageFile(file: File, maxBytes = 1_500_000): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("El archivo debe ser una imagen."));
      return;
    }
    if (file.size > maxBytes) {
      reject(new Error("La imagen supera 1.5 MB. Elige una más liviana."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      if (!result.startsWith("data:image/")) {
        reject(new Error("El archivo no es una imagen válida."));
        return;
      }
      resolve(result);
    };
    reader.onerror = () => reject(new Error("No pude leer la imagen."));
    reader.readAsDataURL(file);
  });
}
