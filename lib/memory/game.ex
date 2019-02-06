defmodule Memory.Game do

  def new do
    letters = [ "A", "B", "C", "D", "E", "F", "G", "H" ]
    tiles = letters
      |> Enum.concat(letters)
      |> Enum.shuffle
      |> Enum.with_index(1)
      |> Enum.reduce(%{}, fn {k,v}, acc -> Map.put(acc, v, %{
                              id: v,
                              letter: k,
                              flipped: false,
                              found: false,
                            })  end)
     %{
        totalFlipped: 0,
        currentFlipped: [],
        isChecking: false,
        tiles: tiles
     }
  end


  def checkTileRender(tile, acc) do
     cond do
      tile.flipped == true -> tile |> Map.delete(:found) |> Map.delete(:flipped); Map.put(acc, tile.id, tile)
      true -> Map.put(acc, tile.id, %{ id: tile.id })
      end
  end


  def client_view(game) do
    tiles = Enum.reduce(game.tiles, %{}, fn {_, tile}, acc -> Memory.Game.checkTileRender(tile, acc) end)
    %{
        tiles: tiles,
        totalFlipped: game.totalFlipped,
    }
  end

  def flipTile(game, id) do
    newGame = game
            |> Map.merge(%{
                        currentFlipped: [id | game.currentFlipped],
                        totalFlipped: game.totalFlipped + 1,
                        tiles: Map.put(game.tiles, id, Map.merge(
                                      Map.get(game.tiles,id, nil),
                                      %{ flipped: true }
                                      ))
                        })
    cond do
      length(newGame.currentFlipped) >= 2 -> {Map.merge(newGame, %{isChecking: true}), checkPair(newGame)}
      true -> {newGame, newGame}
    end
 end

  def wrongMove(game) do
    IO.puts("this was a bad move")
    updatedTiles = game.currentFlipped
            |> Enum.map(fn x -> Map.merge(Map.get(game.tiles, x, nil),
                                          %{ flipped: false })
                                          end)
            |> Enum.reduce(%{}, fn x, acc -> Map.put(acc, x.id,x) end)
    updatedTiles = game.tiles
            |> Map.merge(updatedTiles)
      Map.put(game, :tiles, updatedTiles)
            |> Map.put(:currentFlipped, [])
            |> Map.merge(%{isChecking: false, currentFlipped: []})
            |> IO.inspect

  end

  def checkPair(game) do
    newGame = game
          |> Map.merge(%{isChecking: false, currentFlipped: []})
    tile1 = Map.get(game.tiles, (hd game.currentFlipped)).letter
    tile2 = Map.get(game.tiles, (hd (tl game.currentFlipped))).letter
    cond do
      tile1 !== tile2 -> wrongMove(game)
      true ->  newGame
    end

  end


  def checkMove(game, id) do
    tile = Map.get(game.tiles, id)
    cond do
      game.isChecking || tile.flipped -> {game, game}
      true -> flipTile(game, id)
    end
  end

end
