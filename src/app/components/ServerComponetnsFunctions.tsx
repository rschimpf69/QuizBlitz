"use server";
import { Game, Round } from "@prisma/client";
import client from "../libs/prismadb";

export async function updateGame(
  game: Game & { Rounds: Round[] },
  points: number
) {
  "use server";
  const currentRound = game.Rounds[game.Rounds.length - 1];

  if (game?.TurnId == game?.idPlayer1) {
    const update = await client.game.update({
      where: { id: game?.id },
      data: {
        TurnId: game.idPlayer2,
        Rounds: {
          create: {
            PointsP1: points,
            PointsP2: 0,
          },
        },
      },
    });
  } else {
    game.Rounds[game.Rounds.length - 1].PointsP2 = points;
    const winner =
      game.Rounds.length > 2
        ? checkWhoWon(game.Rounds, game.idPlayer1, game.idPlayer2 as string)
        : null;

    const isOver = winner ? true : false;

    const [UpdateRound, UpdateGame] = await Promise.all([
      await client.round.update({
        where: { id: currentRound.id },
        data: { PointsP2: points },
      }),
      await client.game.update({
        where: { id: game?.id },
        data: { TurnId: game.idPlayer1, Over: isOver, WinnerId: winner },
      }),
    ]);
  }
}
function checkWhoWon(rounds: Round[], p1: string, p2: string): string | null {
  let roundsP1 = 0;
  let roundsP2 = 0;

  rounds.forEach((round) => {
    if (round.PointsP1 > round.PointsP2) {
      roundsP1++;
    } else if (round.PointsP2 > round.PointsP1) {
      roundsP2++;
    }
  });

  if (roundsP1 > roundsP2) {
    return p1;
  } else if (roundsP2 > roundsP1) {
    return p2;
  } else {
    return null;
  }
}
export async function checkAnswer(answerId: string) {
  "use server";

  const answerIsCorrect = await client.answer.findUnique({
    select: {
      correct: true,
    },
    where: {
      id: answerId as string,
    },
  });
  return answerIsCorrect?.correct as boolean;
}