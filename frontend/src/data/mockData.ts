import type { Activity, Attendee, Event, MetricCard, Venue } from "../types/domain";

export const metrics: MetricCard[] = [
  { label: "Total Events", value: "128", delta: "+12 this month" },
  { label: "Upcoming Events", value: "18", delta: "6 open for registration" },
  { label: "Total Venues", value: "34", delta: "82% active" },
  { label: "Total Attendees", value: "42,860", delta: "+9.4% growth" },
  { label: "Attendance Rate", value: "87.5%", delta: "+3.2% vs last month" },
  { label: "Active Registrations", value: "5,482", delta: "1,204 pending check-in" }
];

export const trendData = [
  { day: "Mon", attendance: 720, registrations: 910 },
  { day: "Tue", attendance: 880, registrations: 1080 },
  { day: "Wed", attendance: 960, registrations: 1220 },
  { day: "Thu", attendance: 840, registrations: 990 },
  { day: "Fri", attendance: 1120, registrations: 1370 },
  { day: "Sat", attendance: 1320, registrations: 1500 },
  { day: "Sun", attendance: 780, registrations: 880 }
];

export const eventPerformance = [
  { name: "Tech Summit", rate: 94, conversion: 88 },
  { name: "Career Expo", rate: 81, conversion: 73 },
  { name: "Edu Forum", rate: 89, conversion: 80 },
  { name: "Health Conf", rate: 76, conversion: 68 }
];

export const venues: Venue[] = [
  {
    id: "ven_001",
    name: "Grand Meridian Hall",
    address: "12 Persiaran Sentral",
    city: "Kuala Lumpur",
    state: "WP Kuala Lumpur",
    country: "Malaysia",
    postalCode: "50470",
    contactPerson: "Aisha Rahman",
    contactNumber: "+60 12-345 6601",
    email: "aisha@meridian.example",
    capacity: 1200,
    status: "Active"
  },
  {
    id: "ven_002",
    name: "Nexus Convention Centre",
    address: "88 Jalan Inovasi",
    city: "Petaling Jaya",
    state: "Selangor",
    country: "Malaysia",
    postalCode: "47810",
    contactPerson: "Marcus Lim",
    contactNumber: "+60 16-220 4490",
    email: "events@nexus.example",
    capacity: 2500,
    status: "Active"
  },
  {
    id: "ven_003",
    name: "Aurora Training Studio",
    address: "7 Jalan Ilmu",
    city: "Shah Alam",
    state: "Selangor",
    country: "Malaysia",
    postalCode: "40100",
    contactPerson: "Nur Iman",
    contactNumber: "+60 17-803 9921",
    email: "studio@aurora.example",
    capacity: 160,
    status: "Inactive"
  }
];

export const events: Event[] = [
  {
    id: "evt_001",
    name: "Malaysia Digital Leadership Summit",
    description: "Executive technology summit for enterprise digital transformation leaders.",
    category: "Technology",
    venueId: "ven_001",
    venueName: "Grand Meridian Hall",
    organizer: "Nadia Chong",
    startDate: "2026-07-08",
    endDate: "2026-07-09",
    startTime: "09:00",
    endTime: "17:00",
    registrationDeadline: "2026-07-01",
    capacity: 900,
    registrations: 742,
    status: "Open",
    bannerUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80",
    sessions: [
      {
        id: "ses_001",
        eventId: "evt_001",
        name: "Keynote: AI Operating Models",
        speaker: "Dr. Farah Tan",
        description: "How leadership teams can scale AI responsibly.",
        startTime: "09:30",
        endTime: "10:30",
        room: "Main Hall",
        attendanceRate: 92
      },
      {
        id: "ses_002",
        eventId: "evt_001",
        name: "Cyber Resilience Roundtable",
        speaker: "Irwan Salleh",
        description: "Preparedness exercises for regional security teams.",
        startTime: "11:00",
        endTime: "12:15",
        room: "Room A",
        attendanceRate: 86
      }
    ]
  },
  {
    id: "evt_002",
    name: "Regional Career Expo",
    description: "Multi-campus hiring fair with employer showcases.",
    category: "Career",
    venueId: "ven_002",
    venueName: "Nexus Convention Centre",
    organizer: "Daniel Ho",
    startDate: "2026-08-14",
    endDate: "2026-08-14",
    startTime: "10:00",
    endTime: "18:00",
    registrationDeadline: "2026-08-10",
    capacity: 2100,
    registrations: 1840,
    status: "Published",
    bannerUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80",
    sessions: []
  },
  {
    id: "evt_003",
    name: "Healthcare Innovation Forum",
    description: "Clinical and operational innovation forum for healthcare providers.",
    category: "Healthcare",
    venueId: "ven_001",
    venueName: "Grand Meridian Hall",
    organizer: "Priya Kumar",
    startDate: "2026-06-28",
    endDate: "2026-06-28",
    startTime: "08:30",
    endTime: "15:30",
    registrationDeadline: "2026-06-22",
    capacity: 620,
    registrations: 611,
    status: "Closed",
    bannerUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80",
    sessions: []
  }
];

export const attendees: Attendee[] = [
  {
    id: "att_001",
    registrationId: "REG-2026-0001",
    eventId: "evt_001",
    name: "Hannah Lee",
    email: "hannah.lee@example.com",
    mobile: "+60 12-456 8890",
    organization: "Apex University",
    registrationDate: "2026-06-05",
    attendanceStatus: "Present",
    qrToken: "ATTEND|REG-2026-0001|evt_001"
  },
  {
    id: "att_002",
    registrationId: "REG-2026-0002",
    eventId: "evt_001",
    name: "Raymond Ng",
    email: "raymond.ng@example.com",
    mobile: "+60 13-890 1120",
    organization: "BrightSoft",
    registrationDate: "2026-06-08",
    attendanceStatus: "Late",
    qrToken: "ATTEND|REG-2026-0002|evt_001"
  },
  {
    id: "att_003",
    registrationId: "REG-2026-0003",
    eventId: "evt_002",
    name: "Sara Aziz",
    email: "sara.aziz@example.com",
    mobile: "+60 19-237 4500",
    organization: "SMK Damansara",
    registrationDate: "2026-06-11",
    attendanceStatus: "Absent",
    qrToken: "ATTEND|REG-2026-0003|evt_002"
  }
];

export const activities: Activity[] = [
  { id: "act_001", label: "New registration", detail: "Hannah Lee joined Malaysia Digital Leadership Summit", time: "4 min ago" },
  { id: "act_002", label: "Attendance check-in", detail: "Raymond Ng checked in late at Main Hall", time: "18 min ago" },
  { id: "act_003", label: "Event updated", detail: "Regional Career Expo capacity increased to 2,100", time: "1 hr ago" },
  { id: "act_004", label: "Notification sent", detail: "Reminder batch delivered to 742 attendees", time: "2 hr ago" }
];
