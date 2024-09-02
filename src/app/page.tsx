import { ConnectionManager } from "@/components/general/ConnectionManager";

export default function Home() {
  return (
    <div className="flex w-full bg-emerald-600">
      <div className="w-3/5 relative">
        <div className="ml-10 w-1/2 fixed">
          <img src="/home-migration.svg" alt="home-page" className="h-full" />
        </div>
      </div>
      <div className="w-2/5 p-10 flex flex-col bg-slate-50">
        <div className="mb-10 w-full text-justify text-emerald-500">
          <h1 className="text-3xl flex gap-2 items-center">
            <span>Migração</span>
            <span>DB2</span>
            <span>
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
                className="lucide lucide-arrow-left-right"
              >
                <path d="M8 3 4 7l4 4" />
                <path d="M4 7h16" />
                <path d="m16 21 4-4-4-4" />
                <path d="M20 17H4" />
              </svg>
            </span>
            <span>MariaDB</span>
          </h1>
          <h2 className="text-slate-500 text mt-2">
            Preencha as informações abaixo para iniciar a migração do seu banco
            de dados
          </h2>
        </div>
        <ConnectionManager />
      </div>
    </div>
  );
}
