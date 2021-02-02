const faker = require('faker')
const { slugify } = require('transliteration');
const models = require('./models/models')

const owner = '60014b4a3df3d02ee4bc4d3f'

module.exports = async () => {
    try {
        await models.Post.remove()

        Array.from({length: 20}).forEach(async(_, i) => {
            const title = faker.lorem.words(3)
            const body = faker.lorem.words(50)
            const url = slugify(`${title}-${Date.now().toString(36)}`, {lowercase: false})
            await models.Post.create({
                title,
                body,    
                owner,
                url 
            })
        })
    } catch (error) {
        console.log(error)
    }
}