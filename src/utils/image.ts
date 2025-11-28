/**
 * Kép fájl konvertálása Base64 string-gé
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Kép optimalizálása (méretezés és tömörítés)
 */
export function optimizeImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Méretezés az arányok megtartásával
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Base64 konverzió tömörítéssel
        const optimizedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(optimizedBase64);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

/**
 * Képfájl validálása
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Csak JPEG, PNG és WebP formátumú képek támogatottak.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'A kép mérete maximum 5MB lehet.',
    };
  }

  return { valid: true };
}
