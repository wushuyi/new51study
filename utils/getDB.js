let db = null;

export default async function () {
    if (db) {
        return db;
    }

    const localforage = await import('localforage');
    await localforage.ready();
    db = localforage;

    return db;
}