var ghpages = require('gh-pages');

ghpages.publish(
    'public',
    {
        branch: 'gh-pages',
        repo: 'https://github.com/aquelemiguel/its-ok-i-guess.git', 
        user: {
            name: 'Miguel Mano',
            email: 'aquelemiguel@gmail.com'
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)