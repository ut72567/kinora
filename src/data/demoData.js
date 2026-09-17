export const demoIdentities = [
  {
    id: 'KR-7F4A-92KD8M',
    name: 'Bruno',
    genericName: 'Dog',
    breed: 'German Shepherd',
    category: 'Pet',
    relationship: 'Brother',
    photoUrl: '',
    verified: true,
    isLost: false,
    registeredBy: 'Owner',
  },
  {
    id: 'KR-7D1A-8T8R2Q',
    name: 'Alpha Boss',
    genericName: 'Lenovo ThinkCentre M72e Tiny',
    model: 'M72e Tiny',
    category: 'Device',
    relationship: 'Brother',
    photoUrl: '',
    verified: true,
    isLost: true,
    registeredBy: 'Owner',
  },
  {
    id: 'KR-5Q1D-9L4R2',
    name: 'Aster',
    genericName: 'Guitar',
    breed: '',
    category: 'Collectible',
    relationship: 'Companion',
    photoUrl: '',
    verified: true,
    isLost: false,
    registeredBy: 'Owner',
  },
]

export const demoContactRequests = [
  {
    id: 'cr-101',
    identityId: 'KR-7F4A-92KD8M',
    senderName: 'Ananya',
    senderEmail: 'ananya@example.com',
    message: 'I think I found Bruno near the park. Please let me know.',
    status: 'New',
  },
  {
    id: 'cr-102',
    identityId: 'KR-7D1A-8T8R2Q',
    senderName: 'Daniel',
    senderEmail: 'daniel@example.com',
    message: 'I saw the device and can confirm it was left in the office lobby.',
    status: 'Reviewed',
  },
]

export const demoUser = {
  name: 'Shivansh Ranjan Tripathi',
  email: 'shivansh@xneon.store',
}
