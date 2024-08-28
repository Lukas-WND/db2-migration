import { api } from "@/api/api";
import { useEffect, useState } from "react";

interface Table {
  table: string;
  references: string[];
  //   referenced: string[];
}

export function TablesList({ schema }: { schema: string }) {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTables() {
      try {
        console.log(schema);
        const response = await api.get(`/db2-tables/${schema}`);
        const tables = response.data.map();
        setTables(tables);
      } catch (err) {
        setError("Erro ao carregar as tabelas.");
      } finally {
        setLoading(false);
      }
    }

    fetchTables();
  }, [schema]);

  if (loading) {
    return <div>Carregando tabelas...</div>;
  }

  if(schema === undefined) {
    return <div>Selecione um Schema.</div>
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full border rounded-md p-2 flex gap-4">
      {tables.map((item, idx) => (
        <div key={idx}>{item.table}</div>
      ))}
    </div>
  );
}
