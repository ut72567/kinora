import { jsPDF } from 'jspdf'

export async function generateIdentityPdf(identity) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  doc.setFillColor(10, 18, 28)
  doc.rect(0, 0, pageWidth, 72, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.text('KINORA', 40, 42)

  doc.setTextColor(17, 24, 39)
  doc.setFontSize(26)
  doc.text(identity.name || 'Unnamed identity', 40, 110)
  doc.setFontSize(12)
  doc.text(`Generic Name: ${identity.genericName || 'Not specified'}`, 40, 138)
  doc.text(`Relationship: ${identity.relationship || 'Not specified'}`, 40, 158)
  doc.text(`KINORA ID: ${identity.id || 'N/A'}`, 40, 178)

  if (identity.breed) {
    doc.text(`Breed / Model: ${identity.breed}`, 40, 198)
  }

  doc.setDrawColor(15, 118, 110)
  doc.setLineWidth(1)
  doc.line(40, 230, pageWidth - 40, 230)

  doc.setFontSize(11)
  doc.setTextColor(75, 85, 99)
  doc.text('Privately issued digital identity. Not a government-issued identification document.', 40, 270)
  doc.text('KINORA', 40, pageHeight - 60)

  const qrText = `${window.location.origin}/identity/${identity.id}`
  const canvas = document.createElement('canvas')
  canvas.width = 120
  canvas.height = 120
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const qrCode = await import('qrcode').then((mod) => mod.default.toDataURL(qrText))
  const image = new Image()
  image.src = qrCode
  await new Promise((resolve) => {
    image.onload = resolve
  })
  doc.addImage(image, 'PNG', pageWidth - 170, 120, 120, 120)

  doc.save(`${identity.id || 'kinora-identity'}.pdf`)
}
