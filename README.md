# Microbet

Tiny web app to bet with your friends

## Play

You can try the app online [on heroku](https://microbet.herokuapp.com/).  
First of all, a bookmaker needs to create a new game from the [bookmaker interface](https://microbet.herokuapp.com/bookmaker).  
Then other player can join the game from [the home](https://microbet.herokuapp.com/).  

## Code

### App design

This app is "event source" oriented. 
1. Commands check state to reject order or to emit event(s).
2. State listen on events to update itself.

Which means technically:
1. You can call Commands via HTTP endpoints. 
2. Events are emitted.
    - on an event bus for the backend.
    - on a WebSocket to the client.
3. Reducers update State according to the events received. Reducers are Isomorphics, they run in the clients and in the backend to maintain state on both side.

### Scripts

Assuming nodejs v18 and yarn installed, you can launch the following command to...

* Install dependencies:: `yarn`
* Run backend: `yarn start`
* Run frontend: `yarn run dev`
* Run tests: `yarn test`

### Deploy

Push/Merge in master, CI will build a Docker image based on the `Dockerfile` and deploy it to heroku.
