const router = require("express").Router()

const _ = require("lodash")

const { PrismaClient } = require('@prisma/client')


const {coach} = new PrismaClient()

const loadData = async (n) => {
    await coach.create({
        data: {
            Seat: n,
            Status: true
        }
    })
}

router.get("/load", async(req,res)=>{
    for (let index = 1; index <= 80; index++) {
        await loadData(index)
    }
    res.send("Finished Loading Data")
})

router.get("/seats", async(req,res) => {
    const seats = await coach.findMany()
    res.status(200).json(seats)
})


const validId = async (n) => {
    validfields = await coach.findMany({
        select: {
            id: true,
            Seat: true
        },
        where:{
            Status: true
        }
    })
    valid_seats = []
    if (validfields < n) {
        return "Cannot Create seats befitting of your request."
    }
    for (let index = 0; index < n; index++) {
        valid_seats.push(validfields[index].id)
        
    }
    return valid_seats
}


const booking = async (number) => {
    const seats = []

    const valid_seats = await validId(number)
    if (typeof valid_seats === "string") {
        return valid_seats
    }
    for (let index = 0; index < number; index++) {
       let seat = await coach.update({
            where: {
                id: valid_seats[index]
            },
            data: {Status: false}
        })

        seats.push(seat)
        
    }
    return seats
}

router.post("/book", async(req, res) => {
    const {number} = req.body
    if (number === 0 || number > 7) {
        return res.status(400).json({
            msg: "Invalid Input"
        })
    } 
    const seats = await booking(number)
    if (typeof seats === "string") {
        return res.status(400).json({msg: seats})
    }
    res.status(200).json(seats)
})

module.exports = router