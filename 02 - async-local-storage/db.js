async function create_user(body) {

    console.log('Creating user in DB...');

    return new Promise((resolve, reject) => {

        setTimeout(() => {

            if (Math.random() > 0.5) {
                console.log('User successfully created!');
                resolve(body);
            } else {
                reject(new Error('Unexpected error while creating user!'));
            }

        }, 500);

    });

}

module.exports = { create_user };
