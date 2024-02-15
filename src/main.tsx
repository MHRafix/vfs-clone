import {
	ApolloClient,
	ApolloProvider,
	InMemoryCache,
	createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const httpLink = createHttpLink({
	uri: 'https://asia-api.up.railway.app/graphql',
});

const authLink = setContext((_, { headers }) => {
	return {
		headers: {
			...headers,
			Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0N2Q1ZmQ3Y2Q1OWJjNTE1OGEzZGI5NSIsImVtYWlsIjoicmFmaXoubWVoZWRpQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcwNzgyOTg3OCwiZXhwIjoxNzA4MDg5MDc4fQ.ukKsWEXSrZpe64wN1SqDWwfLJ72qN1a5RocFzxU8cEg`,
		},
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<MantineProvider>
				<App />
			</MantineProvider>
		</ApolloProvider>
	</React.StrictMode>
);
