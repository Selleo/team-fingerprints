import React from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

const queryClient = new QueryClient()

const Example = () => {
  const { isLoading, error, data } = useQuery('repoData', () =>
    fetch('http://localhost:3000').then(res =>res.text())
  )
  console.log(data)
  if (isLoading) return  <div>'Loading...'</div>
  if (error) return <div>'An error has occurred: ' + console.error;
  </div>

  return (
    <div>
      <h1>Data</h1>
      <h1>{data}</h1>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  )
}