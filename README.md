

This document outlines the complete API structure for the Headnest Mental Wellness App, organized by functional categories.

---

##  1. Authentication & User Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/signup` | POST | Register new user with email/password |
| `/auth/signin` | POST | Login with email/password |
| `/auth/oauth/google` | POST | Google OAuth login/signup |
| `/auth/oauth/apple` | POST | Apple ID OAuth login/signup |
| `/auth/oauth/facebook` | POST | Facebook OAuth login/signup |
| `/auth/anonymous-name` | POST | Submit anonymous username |
| `/auth/verify-email` | POST | Verify user email |
| `/auth/logout` | POST | Log out user |
| `/auth/token/refresh` | POST | Refresh authentication token |
| `/user/profile` | GET | Fetch current user profile |
| `/user/profile/edit` | PUT | Update username, email, or password |

---

##  2. Personal Info & Preferences

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/user/preferences` | POST | Submit onboarding preferences |
| `/user/preferences` | GET | Get saved preferences |
| `/user/preferences` | PUT | Update user preferences |

---

##  3. Mood Check-In

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mood-checkin` | POST | Submit daily mood and notes |
| `/mood-checkin` | GET | Retrieve mood entries |
| `/mood-checkin/progress` | GET | Get mood check-in streak progress |

---

##  4. Journal System

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/journal` | POST | Create a new journal entry |
| `/journal` | GET | List journal entries |
| `/journal/:id` | GET | View a specific journal entry |
| `/journal/:id` | PUT | Edit a journal entry |
| `/journal/:id` | DELETE | Delete a journal entry |

---

##  5. Anonymous Community Chatrooms

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/community` | GET | List available support communities |
| `/community/join/:id` | POST | Join a support community |
| `/community/leave/:id` | POST | Leave a support community |
| `/community/chat/:communityId` | GET | Fetch live chat messages |
| `/community/chat/send` | POST | Send a message in community chat |
| `/community/chat/exit` | POST | Exit a community chatroom |
| `/community/chat/notify` | POST | Send join/leave notification |

---

##  6. Therapist Booking

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/therapists` | GET | List all therapists |
| `/therapists/:id` | GET | Therapist profile info |
| `/appointments` | POST | Book an appointment |
| `/appointments/:id` | GET | Get details of a session |
| `/appointments/:id` | DELETE | Cancel session |
| `/appointments/user` | GET | List user’s past and upcoming sessions |
| `/appointments/:id/chat` | GET | Enter therapist chatroom if valid |
| `/appointments/:id/chat/exit` | POST | Exit therapist chatroom |
| `/appointments/email-reminder` | POST | Trigger reminder email manually (cron-based in prod) |

---

##  7. Therapist Chatroom

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/therapy/chat/:appointmentId` | GET | Load real-time chat messages |
| `/therapy/chat/send` | POST | Send message to therapist |
| `/therapy/chat/exit` | POST | Exit session chatroom |
| `/therapy/chat/notify` | POST | Notify join/leave |
| `/therapy/chat/history` | DELETE | Auto-delete expired chats (system) |

---

##  8. Payments

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/payment/methods` | GET | Get available payment methods |
| `/payment/initiate` | POST | Start payment process |
| `/payment/verify` | POST | Verify payment completion |
| `/payment/total` | GET | Fetch session total amount |

---

##  9. Settings

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/settings` | GET | View settings |
| `/settings` | PUT | Update country or other fields |
| `/settings/contact` | POST | Submit contact support message |
| `/auth/logout` | POST | Log out account |

---

##  10. Miscellaneous

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/splash-config` | GET | Get splash screen config (branding + breathing prompt) |
| `/health` | GET | Server healthcheck |
| `/version` | GET | App version info for frontend matching |

---

**Note:** Real-time features like community and therapy chat are expected to run over **WebSocket**, **Socket.io**, or similar persistent connection protocols.

