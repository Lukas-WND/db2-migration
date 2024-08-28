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
import { api } from "@/api/api";
import { Connection } from "@/interfaces/connection";

export function ConnectionCard({
  db,
  connData,
  dispatchers,
}: {
  db: string;
  connData: Connection;
  dispatchers: React.Dispatch<React.SetStateAction<string>>[];
}) {
  async function testConnection(event: React.FormEvent) {
    event.preventDefault();
    const dbName = db.toLowerCase();
    const route = `/test-${dbName}-connection`;
    const data = {
      [`${dbName}-host`]: connData.host,
      [`${dbName}-port`]: connData.port,
      [`${dbName}-user`]: connData.user,
      [`${dbName}-password`]: connData.password,
      [`${dbName}-database`]: connData.schema,
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
                value={connData.host}
                onChange={(e) => dispatchers[0](e.target.value)}
              />
            </Label>

            <Label className="col-span-1">
              Porta
              <Input
                placeholder="3306..."
                className="mt-2"
                value={connData.port}
                onChange={(e) => dispatchers[1](e.target.value)}
              />
            </Label>

            <Label className="col-span-2 mt-6">
              Usuário
              <Input
                placeholder="username..."
                className="mt-2"
                value={connData.user}
                onChange={(e) => dispatchers[2](e.target.value)}
              />
            </Label>

            <Label className="col-span-2 mt-6">
              Senha
              <Input
                placeholder="password..."
                className="mt-2"
                type="password"
                value={connData.password}
                onChange={(e) => dispatchers[3](e.target.value)}
              />
            </Label>

            <Label className="col-span-2 mt-6">
              Banco de Dados
              <Input
                placeholder="db-name..."
                className="mt-2"
                value={connData.schema}
                onChange={(e) => dispatchers[4](e.target.value)}
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
