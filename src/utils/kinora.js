export function generateKinoraId() {
  const partOne = Math.random().toString(16).slice(2, 6).toUpperCase()
  const partTwo = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `KR-${partOne}-${partTwo}`
}
