"use client";

import { useEffect, useState } from "react";
import { ConnectionCard } from "./ConnectionCard";
import { Button } from "../ui/button";
import { api } from "@/api/api";
import { useRouter } from "next/router";
import { useToast } from "../ui/use-toast";

export function ConnectionManager() {
  const [host1, setHost1] = useState("");
  const [port1, setPort1] = useState("");
  const [user1, setUser1] = useState("");
  const [password1, setPassword1] = useState("");
  const [schema1, setSchema1] = useState("");

  const [host2, setHost2] = useState("");
  const [port2, setPort2] = useState("");
  const [user2, setUser2] = useState("");
  const [password2, setPassword2] = useState("");
  const [schema2, setSchema2] = useState("");

  const { toast } = useToast();

  async function ConnectDatabases(event: React.FormEvent) {
    event.preventDefault();

    try {
      const [db2, mariadb] = await Promise.all([
        api.post("/test-db2-connection", {
          [`db2-host`]: host1,
          [`db2-port`]: port1,
          [`db2-user`]: user1,
          [`db2-password`]: password1,
          [`db2-database`]: schema1,
        }),
        api.post("/test-mariadb-connection", {
          [`mariadb-host`]: host2,
          [`mariadb-port`]: port2,
          [`mariadb-user`]: user2,
          [`mariadb-password`]: password2,
          [`mariadb-database`]: schema2,
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
      });
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-x-48">
        <ConnectionCard
          db={"DB2"}
          connData={{
            host: host1,
            port: port1,
            user: user1,
            password: password1,
            schema: schema1,
          }}
          dispatchers={[setHost1, setPort1, setUser1, setPassword1, setSchema1]}
        />
        <ConnectionCard
          db={"MariaDB"}
          connData={{
            host: host2,
            port: port2,
            user: user2,
            password: password2,
            schema: schema2,
          }}
          dispatchers={[setHost2, setPort2, setUser2, setPassword2, setSchema2]}
        />
      </div>
      <div className="mt-24">
        <form onSubmit={ConnectDatabases}>
          <Button
            className="py-2 px-24 text-xl bg-emerald-700 text-white rounded-md"
            type="submit"
          >
            Iniciar Migração
          </Button>
        </form>
      </div>
    </>
  );
}
