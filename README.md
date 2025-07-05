# LaMontagne

A small application for creating a directory of completed or planned routes in the mountains.

### Live version

https://lamontagneapp.vercel.app/login

### Test credentials

user: test@dev.com
password: password

## Installation

### Requirements

Node >20 is ok.  
Npm or yarn.

### Run in dev mode

```bash
yarn
```

```bash
yarn run dev
```

## Instructions of Use

### Consultation Mode

-   The landing page is the connection page, or the home page if you are already connected.
-   The home page displays all available mountain routes for the connected user.
-   You can filter routes by period or season.
-   You can add a new route using the menu.
-   By clicking on a route, you can access its details and edit it.

### Edit Mode

-   In edit mode, if the route is planned in the future and within 7 days, you can automatically obtain weather forecasts from MeteoBlue for the day of the route.
-   If the route is planned within 2 days (or the day before before 4 PM), you can obtain the BERA avalanche risk index for the day of the route.
-   ⚠️ **WARNING:** A BERA index of 0 does not exist. If the value displayed is 0, it means the information is not available. Do not interpret this as "no risk"!
-   You can move the departure or arrival points directly on the map or set their coordinates in the designated fields.
-   You can load a GPX file, add or delete photos.
