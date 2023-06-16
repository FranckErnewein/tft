{-# LANGUAGE DeriveGeneric #-}
module Events where

import Data.Aeson
import Data.String
import Data.Text
import GHC.Generics

-- data RoundResult = ChoiceA | ChoiceB deriving (Generic, Show)

data Event 
  = GameStarted { uuid :: String }
  | PlayerJoined { uuid :: String, name :: String }
  | PlayerLeft { uuid :: String }
  | RoundStarted { uuid :: String }
  | BetCommited { uuid :: String, result :: String, amountCent :: Int }
  | BetCanceled { uuid :: String }
  | BetEnded {}
  | RoundEnded {}
  deriving (Generic, Show)

-- instance FromJSON CommandOption
instance ToJSON Event where 
  toJSON = eventToJSON

eventToJSON :: Event -> Value
eventToJSON (GameStarted u) = object [fromString "uuid" .= u]
eventToJSON (PlayerJoined u n) = object [fromString "uuid".=u, fromString "name".=n]
eventToJSON (PlayerLeft u) = object [fromString "uuid".=u]
eventToJSON (RoundStarted u) = object [fromString "uuid".= u]
eventToJSON (BetCommited u r a) = object [fromString "uuid".=u, fromString "result".= show r, fromString "amountCent".=a]
eventToJSON (BetCanceled u) = object [fromString "uuid" .= u]
eventToJSON _ = object []
