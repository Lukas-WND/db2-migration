import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Connection } from "@/stores/ConnectionStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function ConnectionCard({
  db,
  connData,
  dispatcher,
}: {
  db: string;
  connData: Connection;
  dispatcher: {
    method: (index: number, field: keyof Connection, value: string) => void;
    index: number;
  };
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Conexão {db}</CardTitle>
        <CardDescription>
          Insira os dados para realizar a conexão
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <Label className="col-span-1">
            Endereço de IP
            <Input
              placeholder="127.0.0.1..."
              className="mt-2"
              value={connData.host}
              onChange={(e) =>
                dispatcher.method(dispatcher.index, "host", e.target.value)
              }
            />
          </Label>

          <Label className="col-span-1">
            Porta
            <Input
              placeholder="3306..."
              className="mt-2"
              value={connData.port}
              onChange={(e) =>
                dispatcher.method(dispatcher.index, "port", e.target.value)
              }
            />
          </Label>

          <Label className="col-span-2 mt-6">
            Usuário
            <Input
              placeholder="username..."
              className="mt-2"
              value={connData.user}
              onChange={(e) =>
                dispatcher.method(dispatcher.index, "user", e.target.value)
              }
            />
          </Label>

          <Label className="col-span-2 mt-6">
            Senha
            <Input
              placeholder="password..."
              className="mt-2"
              type="password"
              value={connData.password}
              onChange={(e) =>
                dispatcher.method(dispatcher.index, "password", e.target.value)
              }
            />
          </Label>

          <Label className="col-span-1 mt-6">
            Schema
            <Input
              placeholder="bd2020..."
              className="mt-2"
              value={connData.schema}
              onChange={(e) =>
                dispatcher.method(dispatcher.index, "schema", e.target.value)
              }
            />
          </Label>

          <Label className="col-span-1 mt-6">
            SGBD
            <Select
              value={connData.sgbd}
              onValueChange={(value) =>
                dispatcher.method(dispatcher.index, "sgbd", value)
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione um banco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="db2">DB2</SelectItem>
                <SelectItem value="mariadb">MariaDB</SelectItem>
              </SelectContent>
            </Select>
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
