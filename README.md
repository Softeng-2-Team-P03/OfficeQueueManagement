# OfficeQueueManagement

# TEAM P03
## Students:
- ### 290247 Micco Ferdinando
- ### 287871 Bianconi Luca
- ### 292496 Bincoletto Alessio
- ### 292479 Bodnarescul Paolo Stefanut
- ### 279240 Colangelo Maria Letizia
- ### 289587 Banouie Alireza
- ### 292457 De Florio Giovanni

## React Client Application Routes [TO COMPLETE]

- Route `/`:
    - Where customers select their service probably
- Route `/officer`
- Route `manager`
- Route `/login`
- ...

## API SERVER [TO COMPLETE]

### Retrieve ticket served by counterId
- HTTP Method: `GET` URL `/api/counters/:counterId/currentTicket`
- Description: Retrieve the currently served ticket number by a counter given `counterId`.
- Request body: _None_
- Response: `200 OK` (success)
- Response body: 

    If no ticket is being served:
    ```
    {"ticketNumber": null, "info": "No ticket being served."}
    ```
    If a ticket is being served an object with its ticket number:
    ```
    {"ticketNumber": ticketNumber}
    ```
- Error Response: `422 Unprocessable Entity` (value does not satisfy validators), `503 Service Unavailable`, `404 Not Found` (ticket associated with counterId not found in DB)

### Retrieve next ticket to serve by counterId
- HTTP Method: `GET` URL `/api/counters/:counterId/currentTicket`
- Description: Retrieve the currently served ticket number by a counter given `counterId`.
- Request body: _None_
- Response: `200 OK` (success)
- Response body: 

    If no ticket is being served:
    ```
    {"ticketNumber": null, "info": "No ticket to serve."}
    ```
    If a ticket is being served an object with its ticket number:
    ```
    {"ticketNumber": ticketNumber}
    ```
- Error Response: `422 Unprocessable Entity` (value does not satisfy validators), `503 Service Unavailable`, `404 Not Found` (Services not found, Ticket associated with counterId not found, Ticket associated with service not found...)

### ... TO ADD

### User management

### Log in
- HTTP Method: `POST` URL: `/api/sessions`
- Description: authenticate the user who is trying to log in
- Request body: credentials of the user who is trying to log in
```
{ 
    "username": "username",
    "password": "password"
}
``` 
- Reponse: `200 OK` (success)
- Response body: authenticated user
```
{ 
    "id": id,
    "username": "mail",
}
``` 
- Error responses: `500 Internal Server Error` (generic error), `401 Unauthorized User` (login failed)

### Check if user is logged in
- HTTP Method: `GET` URL: `/api/sessions/current/`
- Description: check if current user is logged in and get their data
- Request body: _None_
- Response: `200 OK` (success)
- Response body: authenticated user
```
{ 
    "id": id,
    "username": "mail",
}
``` 
  - Error responses: `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)

### Log out
- HTTP Method: `DELETE` URL: `/api/sessions/current/`
- Description: log out current user
- Request body: _None_
- Response: `200 OK` (success)
- Response body: _None_
- Error responses: `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)

## Database Tables

- Table `OFFICER` - contains **PK** OFFICER_ID `(int)` , email `(string)` , hash `(string)`
    - Table to store the officers
- Table `COUNTER` - contains **PK** COUNTER_ID `(int)`, serving_num `(int)`
    - Table to store counters and what ticket number they are serving
- Table `COUNTER_SERVICES` - contains **PK** COUNTER_ID `(int)`, **PK** SERVICE_TYPE `(string)`
    - Table to store counters and their services
- Table `SERVICE` - contains **PK** SERVICE_TYPE `(string)`, service_time `(int)`, queue_counter `(int)`
    - Table to store services, their average service time and queue of customers for that service
- Table `TICKET` - contains **PK** TICKET_NUM `(int)`, service_type `(string)`

## Users Credentials [I DO NOT KNOW THE PASSWORDS]

- giovanni.nannino@gmail.com , [...]
- petalo.rosa@gmail.com , [...] 
- simone.gatto@gmail.com , [...] 
