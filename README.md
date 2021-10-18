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

## React Client Application Routes

- Route `/`:
    - Customers select the service type they need and see the resulting ticket while Officers can log in through the login button
    - If Officer is logged in they can't select a ticket and get redirected to `/choose`
- Route `/officer` 
    - Officers can ask through a counter for the next ticket compatible with their service type to serve
- Route `/manager` [TO IMPLEMENT]
    - Manager is able to see various statistics
- Route `/login` 
    - Form to be able to log in as officer or manager
- Route `/choose` 
    - After an Officer logs in they reach this view where they can choose which counter they want to work on

## API SERVER [TO COMPLETE]

### Retrieve counters and their services
- HTTP Method: `GET` URL `/api/counters`
- Description: Retrieve the counters and the list of their services
- Request body: _None_
- Response: `200 OK` (success)
- Response body:
```
    [{"counterId": counterId, "services": [Service1, Service2, ...], ...}
```
- Error Response: `404 Not Found` (counterId services' cannot be found), `503 Service Unavailable`

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
- HTTP Method: `GET` URL `/api/counters/:counterId/nextTicket`
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

### Get the estimated waiting time
- HTTP Method: `GET` URL `/api/services/estimation?type=serviceType`
- Description: Retrieve the estimated service time for  certain service Type `serviceType`.
- Request body: _None_
- Response: `200 OK` (success)
- Response body: 

    The estimated waiting time, eg:
    ```
    17.4999
    
    ```
- Error Response: `422 Unprocessable Entity` (value does not satisfy validators), `503 Service Unavailable`

### Update the queue counter
- HTTP Method: `GET` URL `/api/services/updateQueue?type=serviceType&operationType=opnum`
- Description: Update queue for a certain service type `serviceType` EG: type=SPID
opnum 1 = increase queue of the specified service type by one.
opnum 2 = decrease queue of the specified service type by one.
opnum 3 = reset the queue of the specified service type to zero.
- Request body: _None_
- Response: `200 OK` (success)
- Response body: 

    for an increase (`operationType=1`) of service type "SPID" (`type=SPID`) it returns the requested type and the updated queue couunter number
    ```
    {
     "type": "SPID",
     "Queue": 2
    }
    
    ```
- Error Response: `422 Unprocessable Entity` (value does not satisfy validators), `503 Service Unavailable`
### ... TO ADD

### User management

### Log in
- HTTP Method: `POST` URL: `/api/sessions`
- Description: authenticate the user who is trying to log in
- Request body: credentials of the user who is trying to log in
```
{ 
    "username": "email",
    "password": "password"
}
``` 
- Reponse: `200 OK` (success)
- Response body: authenticated user
```
{ 
    "id": id,
    "username": "email",
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
    "username": "email",
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
    - Table to store the daily list of tickets. A lower ticket number means a ticket issued earlier

## Users Credentials

- giovanni.nannino@gmail.com , password: `giovanni`
- petalo.rosa@gmail.com , password: `petalo`
- simone.gatto@gmail.com , password: `simone` 
