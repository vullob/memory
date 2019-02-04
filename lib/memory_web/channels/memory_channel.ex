defmodule MemoryWeb.MemoryChannel do
  use MemoryWeb, :channel

  alias Memory.Game

  def join("memory" <> name, payload, socket) do
    if authorized?(payload) do
      game = Game.new()
      socket = socket
        |> assign(:game, game)
        |> assign(:name, name)
      {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("flip", %{"id" => id}, socket) do
    game = Game.flipTile(socket.assigns[:game], id)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (memory:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
