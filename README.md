# Release Guardian Demo - Launch Airways

Launch Airways is an airline trying to move fast with some tough headwinds (get it?). They've let their legacy systems linger for too long, and now are stuck with a lot of duct tape and long outages. 

They've undertaken the path to modernization, across everything from the databases that power the various parts of their application, into the custom experiences they put in front of their most valuable members. 

## Capabilities Showcased 

* Remediate software issues before they become incidents - Launch Airways is rolling out a new set of databases across their airport system to allow better scale across their organization. The new database has to be faster than what they are offering today, and it can't result in errors. They are testing moving off of PostgreSQL for their high performance systems, and into Redis for better caching performance. 
* Target and Personalize User Experiences - Launch Airways wants to roll out Launch Club as a means to reward their most loyal customers, and drive engagement in the higher tiers. 
* (Coming Soon) Measure and experiment

## Running 

* Clone this repo 
* `npm i` from within the project directory 
* `npm run dev` to start the project 

## Application Details 

* NextJS 14 App Router based application 
* Drizzle for Database ORM 
* TailwindCSS + Shadcn UI 
* Runs extremely well in Railway.app 

## Setup 

These values are in the internal Confluence

```bash 
NEXT_PUBLIC_LD_CLIENT_KEY='<LaunchDarkly Client SDK Key>'
LD_SERVER_KEY='<LaunchDarkly Server SDK Key'
DATABASE_URL='<database URL for PostgreSQL database>'
REDIS_URL='<database URL for Redis database>'
```

## The interesting bits 

### Feature Flags to Create 

* `flightDb` - Boolean Flag, Server Side (no client side checked)
* `launchClubLoyalty` -  Boolean Flag, Client-Side Key checked 

### Release Guardian
Control over the database is in the `/app/api/route.ts` file where you'll find a simple conditional around the feature flag `flightDb`. The Redis database should perform better, but the PostgreSQL database will eventually result in failed attempts. 

These are visualized in `/components/ui/airwayscomponents/airportPicker.tsx` on the client side