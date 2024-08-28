"use client";
import { api } from "@/api/api";
import { useEffect, useState } from "react";
import { SchemaList } from "./SchemaList";
import { Separator } from "../ui/separator";
import { TablesList } from "./TablesList";

export function SchemaTables() {
  const [schemas, setSchemas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSchema, setSelectedSchema] = useState(schemas[0]);

  useEffect(() => {
    async function fetchTables() {
      try {
        const response = await api.get("/db2-schema");
        const schemaNames = response.data.map(
          (item: { SCHEMANAME: string }) => item.SCHEMANAME
        );
        setSchemas(schemaNames);
      } catch (err) {
        setError("Erro ao carregar as tabelas.");
      } finally {
        setLoading(false);
      }
    }

    fetchTables();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-full border rounded-md p-2 flex gap-4">
      <SchemaList
        list={schemas}
        schema={selectedSchema}
        setSchema={setSelectedSchema}
      />
      <TablesList schema={selectedSchema} />
    </div>
  );
}
