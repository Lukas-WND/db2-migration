"use client";

import { api } from "@/api/api";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { ConnectionCard } from "./ConnectionCard";
import { useConnectionsStore } from "@/stores/ConnectionStore";

export function ConnectionManager() {
  const {
    connections,
    updateConnection,
    clearConnections,
    areConnectionsValid,
  } = useConnectionsStore((state) => ({
    connections: state.connections,
    updateConnection: state.updateConnection,
    clearConnections: state.clearConnections,
    areConnectionsValid: state.areConnectionsValid,
  }));

  const { toast } = useToast();

  async function ConnectDatabases(event: React.FormEvent) {
    event.preventDefault();

    if (!areConnectionsValid()) {
      toast({
        variant: "destructive",
        title: "Erro!",
        description:
          "Preencha todas as conexões obrigatórias antes de prosseguir.",
      });
      return;
    }

    try {
      const [db2, mariadb] = await Promise.all([
        api.post(`test-${connections[0].sgbd}-connection`, {
          [`${connections[0].sgbd}-host`]: connections[0].host,
          [`${connections[0].sgbd}-port`]: connections[0].port,
          [`${connections[0].sgbd}-user`]: connections[0].user,
          [`${connections[0].sgbd}-password`]: connections[0].password,
          [`${connections[0].sgbd}-database`]: connections[0].schema,
        }),
        api.post(`test-${connections[1].sgbd}-connection`, {
          [`${connections[1].sgbd}-host`]: connections[1].host,
          [`${connections[1].sgbd}-port`]: connections[1].port,
          [`${connections[1].sgbd}-user`]: connections[1].user,
          [`${connections[1].sgbd}-password`]: connections[1].password,
          [`${connections[1].sgbd}-database`]: connections[1].schema,
        }),
      ]);

      if (db2.status === 200 && mariadb.status === 200) {
        toast({
          title: "Conexão realizada com sucesso",
          description: "Em instantes você será redirecionado",
        });

        window.location.href = "/migrate";
      }
    } catch (error) {
      console.error("Erro ao testar conexões:", error);
      toast({
        variant: "destructive",
        title: "Erro ao realizar conexão!",
        description: "Verifique as configurações e tente novamente.",
      });
    }
  }

  return (
    <div className="w-full px-10">
      <div className="flex flex-col gap-12 justify-between items-center">
        <ConnectionCard
          db={"Fonte"}
          connData={connections[0]}
          dispatcher={{ method: updateConnection, index: 0 }}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-move-down"
        >
          <path d="M8 18L12 22L16 18" />
          <path d="M12 2V22" />
        </svg>
        <ConnectionCard
          db={"Destino"}
          connData={connections[1]}
          dispatcher={{ method: updateConnection, index: 1 }}
        />
      </div>
      <div className="mt-24">
        <form
          onSubmit={ConnectDatabases}
          className="w-full flex gap-2 items-center justify-center"
        >
          <Button
            type="button"
            variant="secondary"
            onClick={() => clearConnections()}
            className="w-full"
          >
            Limpar
          </Button>
          <Button
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-md"
            type="submit"
            disabled={!areConnectionsValid()}
          >
            Iniciar Migração
          </Button>
        </form>
      </div>
    </div>
  );
}
