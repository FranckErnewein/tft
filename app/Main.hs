{-# LANGUAGE OverloadedStrings #-}
import Commands
import Events
import Web.Scotty
import Data.UUID
-- import Data.Monoid (mconcat)
import System.Random
import Control.Monad.Trans (liftIO)


newUUID :: IO UUID
newUUID = randomIO

commandHandler :: CommandOption -> Event
commandHandler (BookmakerStartGame id) = GameStarted id
commandHandler _  = error "command not supported"

main = scotty 3000 $ do
  post "/commands/bookmaker/startGame" $ do
    id <- liftIO newUUID
    json $ commandHandler (BookmakerStartGame {Commands.uuid = show id })

  post "/commands/player/join" $ do
    let id <- liftIO newUUID
    cmd <- jsonData
    json $ commandHandler (PlayerJoin {Commands.uuid = show id})
