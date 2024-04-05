# SmartCampus
The official Backend Repository of SmartCampus, a facility reservation system for Mapua Malayan Colleges Mindanao.

## Technology Stack
- [NestJS](https://docs.nestjs.com/) - Back-End Framework
- [Prisma](https://www.prisma.io/docs) - Object Relational Mapping Tool
- [Supabase](https://supabase.com/) - Database, Storage and Authentication Provider
- [PostgreSQL](https://www.postgresql.org/) - Database Management System
- [Git](https://git-scm.com/)/[Github](https://github.com/) - Version Control
- [Swagger](https://swagger.io/) - API Endpoint Documentation and Testing
- [Thunder Client](https://www.thunderclient.com/) - API Endpoint Testing

## Database Design
### **Users**

| Type    | Column Name     | Type |
| ------- | --------------- |--------------- |
| String  | id           | *uuid default*|
| String  | supabaseId            | *unique*|
| String  | username          ||
| String?  | fullName |*optional*|
| String? | idNum         | *optional*|
| String   | email          |*unique*|
| String   | password          ||
| Role  | role          ||
| Reservation[]   | Reservation||
| Feedback[]  | Feedback[]          ||

### **Reservation**

| Type    | Column Name     | Type |
| ------- | --------------- |--------------- |
| String  | id           | *uuid default*|
| String?  | department           | *optional*|
| String? | purpose          |*optional*|
| String? | professorName          |*optional*|
| String? | classGrade          |*optional*|
| String[] | equipments          |*optional*|
| Int[] | equipmentQty         |*optional*|
| Date  | fillingDate |*default (now())*|
| Date | startDate         ||
| Date   | endDate         ||
| Status   | status||
| Role  | role          ||

### **Facility**

| Type    | Column Name     | Type |
| ------- | --------------- |--------------- |
| Int  | id           | *autoincrement default*|
| String?  | roomNum           | *optional*|
| String | name          ||
| String?  | description |*optional*|
| Int? | capacity         |*optional*|

### Role *enum*
- STUDENT
- TEACHER 
- STAFF

### Status *enum*
- CONFIRMED
- PENDING 
- CANCELLED
- FINISHED

## Setting up the Application
1. Clone the Repository
```bash
git clone git@github.com:louispawaon/smartcampus-backend.git
```
or
```bash
git clone https://github.com/louispawaon/smartcampus-backend.git
```
2. Fetch for updates
```bash
git fetch origin
```
3. Install the necessary libraries
```bash
npm i
```
4. Add a `.env` file locally based on the `.env.example` file
5. Update the database by the Prisma Migrations
```bash
npx prisma migrate reset
```
```bash
npx prisma generate
```
```bash
npx prisma migrate dev
```

## Running your Application
You may either perform the following:
- Run the NestJS Back-End in development mode
```
npm run start:dev
```
- Run the NestJS Back-End with Hot-Reloading
```bash
npm run start:hot
```

## Other Commands to rememeber
- Perform Code Linting
```bash
npm run lint
```
- In cases that the database is reset, perform seed operation
```
npm run seed
```
