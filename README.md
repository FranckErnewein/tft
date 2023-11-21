# Microbet

Tiny web app to bet with yours friends

## Play

You can try the app online [on heroku](https://microbet.herokuapp.com/).
First of all, a bookmaker need to create a new game from the [bookmaker interface](https://microbet.herokuapp.com/bookmaker).
Then other player can join the game from [the home](https://microbet.herokuapp.com/).

App can host only one game at the 

## Code

### App design

This app is event sourcing oriented. 
1. Commands check state the reject order or emit event(s) if state allow it.
2. State listen events to update itself.

Which means technically:
1. You can call Commands via HTTP endpoints. 
2. Events are emitted 
    - on an event bus to maintain backend state 
    - on a WebSocket to the client to maintain client state

Reducers (or state's update functions) are isomorphic, they can run on bothside: client and server. 

### Scripts

Assuming nodejs v18 and yarn installed, you can launch the following command to...

* Install dependencies:: `yarn`
* Run backend: `yarn start`
* Run frontend: `yarn run dev`
* Run tests: `yarn test`

### Deploy

Push/Merge in master, CI will build a Docker image based on the `Dockerfile` and deploy it to heroku.
