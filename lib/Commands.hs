{-# LANGUAGE DeriveGeneric #-}
module Commands where

import Data.Aeson
import Data.String
import Data.Text
import GHC.Generics

data RoundResult = ChoiceA | ChoiceB deriving (Generic, Show)

data CommandOption
  = BookmakerStartGame {uuid :: String}
  | PlayerJoin { uuid :: String, name :: String }
  | PlayerLeave { uuid :: String }
  | PlayerBet { uuid :: String, result :: RoundResult, amountCent :: Int }
  | PlayerCancelBet { uuid :: String }
  | BookmakerEndBet {}
  | BookmakerScheduleEndBet { milliseconds :: Int}
  | BookmakerEndRound {}
  deriving (Generic, Show)


-- instance FromJSON CommandOption
instance ToJSON CommandOption where 
  toJSON = cmdToJSON

cmdToJSON :: CommandOption -> Value
cmdToJSON (PlayerJoin u n) = object [fromString "uuid".=u, fromString "name".=n]
cmdToJSON (PlayerLeave u) = object [fromString "uuid".=u]
cmdToJSON (PlayerBet u r a) = object [fromString "uuid".=u, fromString "result".= show r, fromString "amountCent".=a]
cmdToJSON (PlayerCancelBet u) = object [fromString "uuid" .= u]
cmdToJSON (BookmakerScheduleEndBet ms) = object [fromString "milliseconds" .= ms]
cmdToJSON _ = object []


-- instance ToJSON CommandOption where
  -- toJSON cmd = case genericToJSON defaultOptions cmd of
    -- Object o -> Object (delete (fromString "tag") o)
    -- _ -> error "impossible"
