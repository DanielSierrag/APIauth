const Cars = require('./Car')

const Car = {
    get: async (req, res) => {
        const { id } = req.params
        console.log(req.params)
        const car = await Cars.findOne({ _id: id })
        res.status(200).send(car)
    },
    list: async (req, res) => {
        const cars = await Cars.find()
        res.status(200).send(cars)
    },
    create: async (req, res) => {
        const car = new Cars(req.body)
        const savedCar = await car.save()
        res.status(201).send(savedCar._id)
    },
    update: async (req, res) => {
        const { id } = req.params
        const car = await Cars.findOne({ _id: id })
        Object.assign(car, req.body)
        await car.save()
        res.sendStatus(204)
    },
    destroy: async (req, res) => {
        const { id } = req.params
        try {
            const car = await Cars.findOne({ _id: id})
            if(car){
                await car.deleteOne()
                res.sendStatus(204)
            }else {
                res.status(404).send('Vehiculo no encontrado')
            }
        }catch (e) {
            console.log(e)
        }
    },
}

module.exports = Car
