import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`Database connected!`)
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

export default connectDB
