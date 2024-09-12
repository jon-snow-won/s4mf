/* eslint-disable */

export const profileMock = {
    id: '020df777-415f-465a-bcf1-f873b531aeff',
    username: 'nkozlov',
    firstName: 'Николай',
    lastName: 'Козлов',
    email: 'nskozlov@rtk-element.ru',
    emailVerified: false,
    userProfileMetadata: {
        attributes: [
            {
                name: 'username',
                displayName: '${username}',
                required: true,
                readOnly: true,
                validators: {},
            },
            {
                name: 'email',
                displayName: '${email}',
                required: true,
                readOnly: false,
                validators: {
                    email: {
                        'ignore.empty.value': true,
                    },
                },
            },
            {
                name: 'firstName',
                displayName: '${firstName}',
                required: true,
                readOnly: false,
                validators: {},
            },
            {
                name: 'lastName',
                displayName: '${lastName}',
                required: true,
                readOnly: false,
                validators: {},
            },
        ],
    },
    attributes: {
        LDAP_ENTRY_DN: ['uid=nkozlov,ou=users,ou=system'],
        givenName: ['Николай'],
        fullName: ['Козлов Николай Сергеевич'],
        LDAP_ID: ['nkozlov'],
        createTimestamp: ['20220323173356.209Z'],
        modifyTimestamp: ['20230307092617.056Z'],
    },
}
