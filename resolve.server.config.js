import React from 'react';
import { StaticRouter } from 'react-router';
import storageDriver from 'resolve-storage-file';
import busDriver from 'resolve-bus-memory';

import createStore from './client/store';
import RootComponent from './client/components/RootComponent';
import aggregates from './common/aggregates';
import queries from './common/read-models';
import events from './common/aggregates/users';

async function getInitialState(executeQuery) {
    const resultOfQueries = await Promise.all(
        queries.map(async ({ name }) => {
            const state = await executeQuery(name);
            return { state, name };
        })
    );

    return resultOfQueries.reduce((result, { state, name }) => {
        result[name] = state;
        return result;
    }, {});
}

const dbPath = './storage.json';

export default {
    entries: {
        createStore,
        rootComponent: (props, context) =>
            <StaticRouter location={props.url} context={{}}>
                <RootComponent />
            </StaticRouter>
    },
    bus: { driver: busDriver },
    storage: {
        driver: storageDriver,
        params: { pathToFile: dbPath }
    },
    initialState: query => getInitialState(query),
    aggregates,
    events,
    queries,
    extendExpress: () => { }
};
