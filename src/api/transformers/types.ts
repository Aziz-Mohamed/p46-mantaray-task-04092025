// Raw API data types from MockAPI
export interface ApiEvent {
  id: string;
  title: string;
  description: string;
  date: string; // ISO timestamp
  time: string; // ISO timestamp
  location: string;
  price: string; // String from MockAPI
  image: string;
  capacity: string; // String from MockAPI
  availableSpots: string; // String from MockAPI
  speakersName: string; // Note: MockAPI uses 'speakersName' (plural)
  speakerTitle: string;
  speakerBio: string;
  speakerAvatar: string;
  createdAt: string;
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface ApiRegistration {
  id: string;
  userId: string;
  eventId: string;
  userName: string;
  userEmail: string;
  registeredAt: string;
  status: 'confirmed' | 'cancelled';
}
