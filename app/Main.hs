{-# LANGUAGE OverloadedStrings #-}
import Commands
import Events
import Web.Scotty
import Data.UUID
-- import Data.Monoid (mconcat)
import System.Random
import Control.Monad.Trans (liftIO)

main = scotty 3000 $
  post "/commands/bookmaker/startGame" $ do
    id <- liftIO newUUID
    -- j <- jsonData
    json $ startGame (show id)

newUUID :: IO UUID
newUUID = randomIO

startGame :: String -> Event
startGame = GameStarted
