defmodule MemoryWeb.MemoryChannel do
  use MemoryWeb, :channel

  alias Memory.Game
  alias Memory.BackupAgent

  def join("memory" <> name, payload, socket) do
    if authorized?(payload) do
      game = BackupAgent.get(name) || Game.new()
      BackupAgent.put(name, game)
      socket = socket
        |> assign(:game, game)
        |> assign(:name, name)
      {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("flip", %{"id" => id}, socket) do
    name = socket.assigns[:name]
    {game, laterGame} = Game.checkMove(socket.assigns[:game], id)
    {game, id} |> IO.inspect
    socket = assign(socket, :game, laterGame)
    if (game != laterGame) do
      push(socket, "updateBoard", %{"game" => Game.client_view(game)})
      BackupAgent.put(name, game)
      :timer.sleep(1000)
    end
    {laterGame, id} |> IO.inspect
    socket = assign(socket, :game, laterGame)
    BackupAgent.put(name, game)
    {:reply, {:ok, %{"game" => Game.client_view(laterGame)}}, socket}
  end


  def handle_in("new" <> name , _, socket) do
    socket.assigns[:name]
    game = Game.new()
    socket = socket
          |> assign(:game, game)
    BackupAgent.put(name, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end


  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
