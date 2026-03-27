# RapidoClone — Production-Style Uber Clone (Next.js App Router)

This repository provides a scalable **starter architecture** for an Uber-like platform built with:

- Next.js (App Router, JavaScript)
- Tailwind CSS
- MongoDB + Mongoose
- NextAuth.js (Credentials + OAuth-ready)
- Socket.IO (real-time dispatch and tracking)
- Google Maps API (Places, Directions, Distance Matrix)

It is designed for three roles:

1. Rider
2. Driver
3. Admin

---

## 1) Complete Folder Structure

```txt
src/
  app/
    (public)/
      login/page.js
      register/page.js
    (rider)/
      rider/
        book/page.js
        history/page.js
        track/[rideId]/page.js
    (driver)/
      driver/
        dashboard/page.js
        requests/page.js
        earnings/page.js
    (admin)/
      admin/
        dashboard/page.js
        rides/page.js
        drivers/page.js
        pricing/page.js
        complaints/page.js

    api/
      auth/[...nextauth]/route.js
      rides/route.js
      rides/[rideId]/route.js
      drivers/status/route.js
      drivers/approve/route.js
      pricing/route.js
      complaints/route.js
      socket/route.js

    layout.js
    page.js
    loading.js
    error.js

  components/
    common/
      AppShell.jsx
      StatCard.jsx
      DataTable.jsx
      EmptyState.jsx
      ConfirmModal.jsx
      RatingStars.jsx
    maps/
      MapCanvas.jsx
      LocationPicker.jsx
      DriverTrackerMap.jsx
      RoutePreview.jsx
    ride/
      FareEstimator.jsx
      RideTypeSelector.jsx
      RideRequestCard.jsx
      TripTimeline.jsx
      TripHistoryList.jsx
    driver/
      DriverAvailabilityToggle.jsx
      IncomingRideDrawer.jsx
      EarningsChart.jsx
      DocumentUploader.jsx
    admin/
      AdminSidebar.jsx
      ApprovalQueue.jsx
      PricingEditor.jsx
      ComplaintsBoard.jsx

  config/
    constants.js
    roles.js
    socket-events.js

  lib/
    db/connect.js
    auth/options.js
    auth/guards.js
    google/maps.js
    socket/client.js
    socket/server.js
    validation/schemas.js
    utils/fare.js
    utils/response.js

  middleware/
    role-middleware.js

  models/
    User.js
    DriverProfile.js
    Vehicle.js
    Ride.js
    PricingRule.js
    Complaint.js
    Rating.js

  services/
    ride.service.js
    pricing.service.js
    dispatch.service.js
    analytics.service.js

  store/
    useRideStore.js
    useDriverStore.js

middleware.js
```

---

## 2) Database Models (Mongoose)

### Core entities

- **User**: shared auth model for rider/driver/admin with role.
- **DriverProfile**: KYC docs, approval status, online status, vehicle links.
- **Vehicle**: category, plate, model, capacity.
- **Ride**: rider + driver + geo points + route + status + fare + timestamps.
- **PricingRule**: base fare, per-km, per-minute, surge multipliers.
- **Complaint**: filed by rider/driver, status and admin resolution.
- **Rating**: rider -> driver rating and optional comment.

See starter model implementations inside `src/models`.

---

## 3) Route Handlers (API)

### Auth
- `POST /api/auth/[...nextauth]` handled by NextAuth route.

### Rider/Ride APIs
- `POST /api/rides` — fare estimate or ride booking.
- `GET /api/rides` — role-based ride list (rider own, admin all).
- `PATCH /api/rides/[rideId]` — start, complete, cancel, rate.

### Driver APIs
- `PATCH /api/drivers/status` — online/offline toggle + heartbeat location.
- `PATCH /api/drivers/approve` — admin approval workflow.

### Admin APIs
- `GET/PATCH /api/pricing` — update pricing rules.
- `GET/POST/PATCH /api/complaints` — complaint lifecycle.

### Realtime bootstrapping
- `GET /api/socket` — initialize Socket.IO server in dev/proxy mode.

---

## 4) Page List

### Public
- `/login`
- `/register`

### Rider
- `/rider/book`
- `/rider/history`
- `/rider/track/[rideId]`

### Driver
- `/driver/dashboard`
- `/driver/requests`
- `/driver/earnings`

### Admin
- `/admin/dashboard`
- `/admin/rides`
- `/admin/drivers`
- `/admin/pricing`
- `/admin/complaints`

---

## 5) UI Component List

- Shared layout: `AppShell`, `StatCard`, `DataTable`, `ConfirmModal`
- Map stack: `MapCanvas`, `LocationPicker`, `RoutePreview`, `DriverTrackerMap`
- Rider flow: `FareEstimator`, `RideTypeSelector`, `TripHistoryList`, `RatingStars`
- Driver flow: `DriverAvailabilityToggle`, `IncomingRideDrawer`, `DocumentUploader`
- Admin flow: `ApprovalQueue`, `PricingEditor`, `ComplaintsBoard`

---

## 6) Socket Event Architecture

Defined in `src/config/socket-events.js`.

### Namespaces / Rooms

- Global namespace: `/`
- Role rooms: `rider:{riderId}`, `driver:{driverId}`, `ride:{rideId}`, `admin:ops`

### Event flow

1. Rider books ride
   - emit: `ride:request`
   - server routes nearest online drivers
2. Driver receives request
   - emit to driver: `driver:ride_request`
   - driver replies `driver:ride_response`
3. On acceptance
   - emit to rider: `ride:accepted`
   - both join `ride:{rideId}`
4. Tracking
   - driver emits `driver:location_update`
   - server relays `ride:location_update` to rider and admin room
5. Lifecycle
   - `ride:started`, `ride:completed`, `ride:cancelled`

---

## 7) Implementation Steps (Production-Oriented)

1. Bootstrap Next.js App Router + Tailwind + ESLint + Prettier.
2. Add MongoDB connection pool and model registry guards.
3. Implement NextAuth with role embedding in JWT/session.
4. Build role-based middleware and route guards.
5. Integrate Google Maps (autocomplete + route + distance matrix).
6. Implement pricing service with surge/time-band rules.
7. Build rider booking pipeline (estimate -> request -> assign).
8. Add Socket.IO gateway and room strategy.
9. Build driver app (availability, incoming requests, trip actions).
10. Build admin app (approvals, ride monitoring, pricing, complaints).
11. Add retries, idempotency keys, validation (Zod/Joi), structured errors.
12. Add observability (Sentry/OTel logs), rate limits, security headers.
13. Add integration and load tests for dispatch and trip-state transitions.

---

## 8) Environment Example

See `.env.example` for a full starter environment matrix.

---

## 9) Starter Code Snippets

- DB connector: `src/lib/db/connect.js`
- NextAuth config: `src/lib/auth/options.js`
- Role middleware: `middleware.js` + `src/middleware/role-middleware.js`
- Fare calculator: `src/lib/utils/fare.js`
- Ride APIs: `src/app/api/rides/route.js`
- Socket events: `src/config/socket-events.js`

---

## 10) Notes for Real Deployments

- Run Socket.IO as separate service (Node gateway) for horizontal scale.
- Use Redis adapter for Socket.IO in multi-instance deployments.
- Use background queue (BullMQ/SQS) for driver matching and notifications.
- Use PostGIS or Mongo geospatial indexes for nearest-driver lookup.
- Add strict audit logs for admin actions.

