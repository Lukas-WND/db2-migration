import { ConnectionManager } from "@/components/general/ConnectionManager";

export default function Home() {
  return (
    <div className="flex w-full">
      <div className="w-3/5 relative">
        <div className="ml-10 w-1/2 fixed">
          <img src="/home-migration.svg" alt="home-page" className="h-full" />
        </div>
      </div>
      <div className="w-2/5 py-10 flex flex-col items-center">
        <h1 className="text-2xl mb-10">Migração de Banco de Dados</h1>
        <ConnectionManager />
      </div>
    </div>
  );
}
