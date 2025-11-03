# Dev Events App

A modern, full-stack web application for discovering and managing developer events including hackathons, meetups, and conferences. Built with Next.js 16, React 19, and MongoDB.

## 🚀 Features

- **Browse Events**: View featured events on the homepage and explore all available events
- **Search & Filter**: Search events by title, filter by mode (online/offline/hybrid), and location
- **Sort Events**: Sort by newest, oldest, or title (ascending/descending)
- **Event Details**: View comprehensive event information including agenda, tags, organizer details, and venue information
- **Create Events**: Create new events with image upload, agenda items, tags, and detailed information
- **Book Events**: Book your spot at events with email registration
- **Responsive Design**: Fully responsive UI that works on all devices
- **Modern UI**: Beautiful interface with smooth animations and transitions

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.1
- **React**: 19.2.0
- **Database**: MongoDB with Mongoose 8.19.2
- **Styling**: Tailwind CSS 4
- **TypeScript**: 5.x
- **Icons**: Lucide React
- **Analytics**: PostHog (optional)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+ and npm
- MongoDB database (local or cloud instance like MongoDB Atlas)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dev_evens_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

   Replace `your_mongodb_connection_string` with your MongoDB connection string. For example:
   - Local MongoDB: `mongodb://localhost:27017/dev_events`
   - MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/dev_events`

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
dev_evens_app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── events/        # Events API endpoints
│   ├── create-event/      # Create event page
│   ├── event/             # Individual event detail pages
│   ├── events/            # Events listing page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── BookEvent.tsx      # Event booking component
│   ├── EventCard.tsx     # Event card component
│   ├── EventDetails.tsx  # Event details component
│   ├── EventsList.tsx    # Events list component
│   ├── ExploreBtn.tsx    # Explore button component
│   ├── LightRays.tsx     # Light rays animation
│   └── Navbar.tsx        # Navigation bar
├── database/             # Database models
│   ├── booking.model.ts  # Booking model
│   ├── event.model.ts    # Event model
│   └── index.ts          # Model exports
├── lib/                  # Utility functions
│   ├── actions/          # Server actions
│   │   ├── booking.actions.ts
│   │   └── event.actions.ts
│   ├── constants.ts      # App constants
│   ├── mongodb.ts        # MongoDB connection
│   └── utils.ts          # Utility functions
└── public/               # Static assets
    ├── icons/            # Icon files
    └── images/           # Image assets
```

## 🔌 API Endpoints

### Events API

- **GET `/api/events`**: Fetch all events
  - Returns: Array of all events sorted by creation date (newest first)

- **POST `/api/events`**: Create a new event
  - Body: FormData with event details including:
    - `title` (string, required)
    - `description` (string, required, max 500 chars)
    - `overview` (string, required, max 500 chars)
    - `image` (file, required)
    - `venue` (string, required)
    - `location` (string, required)
    - `date` (date, required)
    - `time` (time, required)
    - `mode` (string, required: "online" | "offline" | "hybrid")
    - `audience` (string, required)
    - `organizer` (string, required)
    - `agenda` (JSON array, required)
    - `tags` (JSON array, required)
  - Returns: Created event object

- **GET `/api/events/[slug]`**: Fetch a single event by slug
  - Returns: Event object with matching slug

## 📝 Database Models

### Event Model

- `title`: Event title
- `slug`: URL-friendly identifier (auto-generated)
- `description`: Event description (max 500 characters)
- `overview`: Event overview (max 500 characters)
- `image`: Base64 encoded image data
- `venue`: Venue name
- `location`: Event location (city, state)
- `date`: Event date (ISO format)
- `time`: Event time (HH:MM format)
- `mode`: Event mode (online, offline, hybrid)
- `audience`: Target audience
- `agenda`: Array of agenda items
- `organizer`: Organizer name
- `tags`: Array of tags
- `createdAt`: Creation timestamp
- `updatedAt`: Update timestamp

### Booking Model

- `eventId`: Reference to Event document
- `email`: Attendee email address
- `createdAt`: Booking timestamp
- `updatedAt`: Update timestamp

## 🚦 Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint

## 🎨 Features in Detail

### Event Management

- **Automatic Slug Generation**: Event slugs are automatically generated from titles
- **Date/Time Normalization**: Dates and times are normalized to consistent formats
- **Image Storage**: Images are stored as base64 data URLs in MongoDB
- **Validation**: Comprehensive validation for all event fields

### Event Discovery

- **Search**: Real-time search across event titles and descriptions
- **Filtering**: Filter by event mode (online/offline/hybrid) and location
- **Sorting**: Multiple sorting options (newest, oldest, title A-Z, title Z-A)
- **Responsive Cards**: Beautiful event cards with hover effects

### Booking System

- **Email Validation**: Validates email format before booking
- **Event Verification**: Ensures the event exists before creating a booking
- **Simple Registration**: Quick booking process with just an email

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NEXT_PUBLIC_BASE_URL` | Base URL for API calls | Yes (for client-side) |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 🙋 Support

For support, please open an issue in the repository or contact the development team.

---

Built with ❤️ using Next.js and MongoDB
