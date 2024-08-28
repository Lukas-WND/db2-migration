"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useState } from "react";
import { api } from "@/api/api";

export function ConnectionCard({ db }: { db: string }) {
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [schema, setSchema] = useState("");

  async function testConnection(event: React.FormEvent) {
    event.preventDefault();
    const dbName = db.toLowerCase();
    const route = `/test-${dbName}-connection`;
    const data = {
      [`${dbName}-host`]: host,
      [`${dbName}-port`]: port,
      [`${dbName}-user`]: user,
      [`${dbName}-password`]: password,
      [`${dbName}-database`]: schema,
    };

    api.post(route, data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conexão {db}</CardTitle>
        <CardDescription>
          Insira os dados para realizar a conexão
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={testConnection}>
          <div className="grid grid-cols-2 gap-2">
            <Label className="col-span-1">
              Endereço de IP
              <Input
                placeholder="127.0.0.1..."
                className="mt-2"
                value={host}
                onChange={(e) => setHost(e.target.value)}
              />
            </Label>

            <Label className="col-span-1">
              Porta
              <Input
                placeholder="3306..."
                className="mt-2"
                value={port}
                onChange={(e) => setPort(e.target.value)}
              />
            </Label>

            <Label className="col-span-2 mt-6">
              Usuário
              <Input
                placeholder="username..."
                className="mt-2"
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
            </Label>

            <Label className="col-span-2 mt-6">
              Senha
              <Input
                placeholder="password..."
                className="mt-2"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Label>

            <Label className="col-span-2 mt-6">
              Banco de Dados
              <Input
                placeholder="db-name..."
                className="mt-2"
                value={schema}
                onChange={(e) => setSchema(e.target.value)}
              />
            </Label>
          </div>

          <Button className="mt-10 w-full" type="submit">
            Testar Conexão
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
