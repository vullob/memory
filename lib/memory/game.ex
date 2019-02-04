defmodule Memory.Game do

  def new do
    letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' ]
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


  def checkTileRender(tile) do
     cond do
      tile.flipped == true -> tile |> Map.delete(:found) |> Map.delete(:flipped)
      true -> %{ id: tile.id }
      end
  end


  def client_view(game) do
    tiles = Enum.map(game.tiles, fn {_, tile} -> Memory.Game.checkTileRender(tile) end)
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
    parent = self()
    if length(game.currentFlipped) == 2 do
        newGame = Map.merge(newGame, %{ isChecking: true })
        # TODO: recieve message from this process
        spawn(fn -> send(parent, {:checkingDone, checkMove(game)}) end)
    end
    newGame
  end

  def wrongMove(game) do
    updatedTiles = game.currentFlipped
            |> Enum.map(fn x -> Map.merge(Map.get(game.tiles, x, nil),
                                          %{ flipped: false })
                                          end)
            |> Enum.reduce(%{}, fn x, acc -> Map.put(acc, x.id,x) end)
    updatedTiles = game.tiles
            |> Map.merge(updatedTiles)
            |> IO.inspect
      Map.put(game, :tiles, updatedTiles)
  end

  def checkMove(game) do
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
    tile = game.tiles.id
    cond do
      game.isChecking || tile.flipped -> client_view(game)
      true -> client_view(flipTile(game, id))
    end
  end

end
