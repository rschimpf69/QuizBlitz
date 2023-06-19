"use client";
import { Game, Round, User } from "@prisma/client";

import { FunctionComponent } from "react";
import ShowGameResume from "./ComponentShowGameResume";
import ModuleShowGame, { ModuleType } from "./ModuleShowGame";
import useSWR, { Fetcher } from "swr";
import { GetGamesByPlayerId } from "../../currentGames/action";

type Props = {
  PlayerId?: string;
};

const AllModulesShowGame: FunctionComponent<Props> = ({ PlayerId }) => {
  const pid = PlayerId;
  const fetcher: Fetcher<
    (Game & {
      Player1: User;
      Player2: User | null;
      Rounds: Round[];
    })[],
    string
  > = async (PlayerId) => await GetGamesByPlayerId(PlayerId);
  const { data, error } = useSWR<
    (Game & {
      Player1: User;
      Player2: User | null;
      Rounds: Round[];
    })[],
    Error
  >(pid, fetcher);
  if (error) {
    console.log(error);
  }

  const finishedGames = data?.filter((game) => game.Over === true);
  const unFinishedGames = data?.filter((game) => game.Over === false);
  const pendingGames = unFinishedGames?.filter(
    (game) =>
      (game.Turn == 1 && game.idPlayer1 == PlayerId) ||
      (game.Turn == 2 && game.idPlayer2 == PlayerId)
  );
  const waitingGames = unFinishedGames?.filter(
    (game) =>
      (game.Turn == 1 && game.idPlayer2 == PlayerId) ||
      (game.Turn == 2 && game.idPlayer1 == PlayerId) ||
      (game.Turn == 0 && game.idPlayer1 == PlayerId)
  );
  return (
    <>
      {pendingGames != undefined && pendingGames.length > 0 && (
        <ModuleShowGame
          text="Tu Turno"
          games={pendingGames}
          type={ModuleType.your}
          userId={PlayerId}
        />
      )}

      {waitingGames != undefined && waitingGames.length > 0 && (
        <ModuleShowGame
          text="Su Turno"
          games={waitingGames}
          type={ModuleType.their}
          userId={PlayerId}
        />
      )}
      {finishedGames != undefined && finishedGames.length > 0 && (
        <ModuleShowGame
          text="Juegos Terminados"
          games={finishedGames}
          type={ModuleType.finished}
          userId={PlayerId}
        />
      )}
    </>
  );
};
export default AllModulesShowGame;
