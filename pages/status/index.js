import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <BackendInfo />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_At).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {updatedAtText}</div>;
}

function BackendInfo() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  if (isLoading) {
    return <div>Carregando informações do backend...</div>;
  }

  if (!data) {
    return <div>Erro ao carregar informações do backend.</div>;
  }

  return (
    <div>
      <h2>Informações do Backend</h2>
      <p>
        Versão do banco de dado (Postgrees):{" "}
        {data.dependencies.database.version}
      </p>
      <p>Máximo de conexões: {data.dependencies.database.max_connections}</p>
      <p>Conexões abertas: {data.dependencies.database.opened_connections}</p>
    </div>
  );
}
