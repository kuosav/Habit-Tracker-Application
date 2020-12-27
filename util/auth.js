const getAuthorizedUser = async(session) => {
    const auth = await session.get('authorizedUser');
    return auth;
}

const authorize = async(session, id, email) => {
    await session.set('authorizedUser', {id: id, email: email});
}

const unauthorize = async(session) => {
    await session.set('authorizedUser', false);
}

export { authorize, unauthorize, getAuthorizedUser };