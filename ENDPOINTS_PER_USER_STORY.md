
This document breaks down backend API endpoints **user story by user story**, in the order of development phases.



##  User Story 1: Splash Screen Branding

No backend endpoints required — purely frontend implementation with static branding.

---

##  User Story 2: Dual Authentication Options  


| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/auth/signin`         | Log in user with email/password |
| POST   | `/auth/signup`         | Register new user |
| POST   | `/auth/oauth/google`   | Google login/signup |
| POST   | `/auth/oauth/facebook` | Facebook login/signup |
| POST   | `/auth/oauth/apple`    | Apple login/signup |

---

##  User Story 3: Sign In Page  


| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/auth/token/refresh`  | Token refresh |
| POST   | `/auth/logout`         | Logout user |
| DELETE   | `/auth/delete`         | delete user account |
| POST   | `/auth/verify-email`   | (Optional) Email verification endpoint |

---

##  User Story 4: Sign Up Page  


> All endpoints in this user story were already defined in phase 2 and 3.

---

##  User Story 5: Anonymous Username Setup

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/anonymous-name` | POST | Submit validated anonymous username |
| `/auth/anonymous-name/validate` | POST | Validate availability and format of proposed name |

---

##  User Story 6: Personal Info and Preferences

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/user/preferences` | POST | Submit personal form data (state of mind, experience, reminders) |
| `/user/preferences` | GET | Get saved preferences |
| `/user/preferences` | PUT | Update form data |

---

##  User Story 7: Dashboard - Mood Check-In and Community Access

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mood-checkin` | POST | Submit selected mood + notes |
| `/mood-checkin/progress` | GET | Retrieve check-in streak |
| `/community` | GET | Get available support communities |
| `/community/join/:id` | POST | Join selected community |
| `/appointments/user` | GET | Show “Chat with Therapist” if active session exists |

---

##  User Story 8: Support Community Selection Screen

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/community` | GET | List communities with description |
| `/community/join/:id` | POST | Join a specific community |

---

##  User Story 9: Journal Entry Screen

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/journal` | GET | Fetch list of journal entries |
| `/journal` | POST | Create new journal entry |
| `/journal/:id` | GET | View single journal entry |
| `/journal/:id` | PUT | Edit a journal entry |
| `/journal/:id` | DELETE | Delete a journal entry |

---

##  User Story 10: Anonymous Community Chatroom

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/community/chat/:communityId` | GET | Fetch live community chat (WebSocket recommended) |
| `/community/chat/send` | POST | Send message to chatroom |
| `/community/chat/notify` | POST | Notify others when user joins/leaves |
| `/community/chat/exit` | POST | Exit chatroom |
| `/community/chat/history` | DELETE (cron) | Auto-clear chat history per user on exit |

---

##  User Story 11: Therapist Booking Screen

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/therapists` | GET | List therapists with names and specializations |
| `/therapists/:id` | GET | Get detailed therapist profile |

---

##  User Story 12: Therapist Profile Page

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/therapists/:id` | GET | View therapist qualifications, pricing, bio |
| `/appointments` | POST | Start booking with selected therapist |

---

##  User Story 13: Appointment Scheduling Interface

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/appointments` | POST | Book appointment with date, time, notes |
| `/appointments/:id` | GET | View specific appointment |
| `/appointments/user` | GET | Get user's list of bookings |

---

##  User Story 14: Payment Method Selection

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/payment/methods` | GET | List all available payment options |
| `/payment/initiate` | POST | Begin payment transaction |
| `/payment/verify` | POST | Confirm/verify payment |
| `/payment/total` | GET | Get calculated price (with any dynamic updates) |

---

##  User Story 15: Session Booking Confirmation

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/appointments/:id` | GET | View confirmed session details |
| `/appointments/email-reminder` | POST (or cron) | Send reminder email for upcoming session |

---

##  User Story 16: Therapy Chatroom

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/appointments/:id/chat` | GET | Access chatroom only if session booked |
| `/therapy/chat/send` | POST | Send message in therapy chat |
| `/therapy/chat/exit` | POST | Exit chatroom |
| `/therapy/chat/history` | DELETE (cron) | Clear expired messages |
| `/therapy/chat/notify` | POST | Join/leave notification |

---

##  User Story 17: Edit Profile Screen

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/user/profile` | GET | Get current profile info |
| `/user/profile/edit` | PUT | Update email, password, or username |

---

##  User Story 18: Settings Page

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/settings` | GET | Fetch settings options |
| `/settings` | PUT | Update country or other info |
| `/settings/contact` | POST | Send support message |
| `/auth/logout` | POST | Log out of session |
