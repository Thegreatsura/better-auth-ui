function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === "object" && !Array.isArray(item)
}

function isPlainObject(item: unknown): item is Record<string, unknown> {
  if (!isObject(item)) return false

  // Handle special object types that should not be merged
  if (item instanceof Date) return false
  if (item instanceof RegExp) return false

  return true
}

export function resizeAvatar(
  file: File,
  size = 256,
  extension: "png" | "jpg" | "webp" | "inherit" = "png"
): Promise<File> {
  const MAX_SIZE = size
  const resolvedExtension =
    extension === "inherit" ? file.name.split(".").pop() : extension
  const mimeType =
    extension === "inherit"
      ? file.type
      : `image/${extension === "jpg" ? "jpeg" : extension}`

  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      const { naturalWidth: w, naturalHeight: h } = img
      const side = Math.min(w, h)

      const cropX = (w - side) / 2
      const cropY = (h - side) / 2

      const outSize = Math.min(side, MAX_SIZE)

      const canvas = document.createElement("canvas")
      canvas.width = outSize
      canvas.height = outSize

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      ctx.drawImage(img, cropX, cropY, side, side, 0, 0, outSize, outSize)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Could not create blob from canvas"))
            return
          }
          resolve(
            new File([blob], file.name.replace(/\.[^.]+$/, `.${resolvedExtension}`), {
              type: mimeType
            })
          )
        },
        mimeType,
        1
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to load image"))
    }

    img.src = url
  })
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}

export function deepmerge<T>(target: T, source: Partial<T>): T {
  if (isPlainObject(target) && isPlainObject(source)) {
    const result: Record<string, unknown> = { ...target }

    for (const [key, value] of Object.entries(source)) {
      if (value === undefined) continue // skip undefineds

      if (key in target) {
        result[key] = deepmerge(
          (target as Record<string, unknown>)[key],
          value as unknown as Partial<T>
        )
      } else {
        result[key] = value
      }
    }

    return result as T
  }

  return source as T
}
