# Rep-mpanosWeb
Web(pt2)

## Role Capabilities

This project implements role-based access control with three main roles. The rules below match the requested specification and are enforced in the backend controllers and reflected in the frontend pages.

- Juan Sao Ville (ADMIN)
	- Full control of the system.
	- Can view and edit all registrations (users, victims, feedback, rewards).
	- Can create (POST /rewards), assign (PUT /rewards/:id/assign) and delete rewards (DELETE /rewards/:id).
	- Can view the leaderboard and all user statistics (GET /stats/leaderboard).

- Slaves
	- Can register new victims (POST /victims) and see their own victims (GET /victims/me).
	- Can view their own statistics (GET /stats/me) including number of captures and recent victims.
	- Compete for rewards (rewards are visible at GET /rewards/public and admins can award rewards to slaves).

- Developers
	- Publicly accessible "Developer Resistance" page with tips and memes (frontend `/resistance`).
	- Optional feedback form available publicly and authenticated (POST /feedback for anonymous, POST /feedback/auth for logged-in users).

## Main Pages (UI)

- Login Page (role-based redirection on login).
- Juan Sao Ville's Dashboard (Admin)
	- View all users and stats, leaderboard, create/assign/delete rewards, manage victims.
- Slave Dashboard
	- Capture form (name, skills, last seen, transformation status) and My Victims list.
- Developer Resistance Page
	- Public tips/memes and feedback form; community reviews displayed publicly.

If you'd like, I can also add a short section with example endpoints and example curl/requests for each role.
