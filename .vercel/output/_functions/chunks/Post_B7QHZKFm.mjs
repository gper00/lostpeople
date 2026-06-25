import mongoose, { Schema } from "mongoose";
//#region src/lib/db.ts
var MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("MONGO_URI environment variable is not set");
var uri = MONGO_URI;
var isConnected = false;
async function connectDB() {
	if (isConnected) return mongoose;
	try {
		await mongoose.connect(uri);
		isConnected = true;
		console.log("Database connected:", mongoose.connection.host);
		return mongoose;
	} catch (error) {
		console.error("Database connection error:", error);
		throw error;
	}
}
//#endregion
//#region src/models/Post.ts
var postSchema = new Schema({
	title: {
		type: String,
		required: true,
		minLength: [10, "Title cannot be less than 10 characters"],
		maxLength: [255, "Title must not exceed 255 characters"],
		trim: true
	},
	slug: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		index: true
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	category: {
		type: String,
		trim: true,
		maxLength: 25,
		default: null
	},
	thumbnail: {
		type: String,
		default: null
	},
	tags: [{
		type: String,
		maxLength: [25, "Each tag cannot be more than 25 characters"],
		trim: true,
		default: null
	}],
	excerpt: {
		type: String,
		required: true,
		minLength: [30, "Excerpt cannot be less than 30 characters"],
		maxLength: [500, "Excerpt must not exceed 500 characters"]
	},
	content: {
		type: String,
		required: true,
		minLength: [100, "Content must be at least 100 characters long"]
	},
	status: {
		type: String,
		enum: [
			"draft",
			"published",
			"archived"
		],
		default: "draft"
	},
	viewsCount: {
		type: Number,
		default: 0
	}
}, { timestamps: true });
postSchema.index({
	status: 1,
	createdAt: -1
});
var Post = mongoose.models.Post || mongoose.model("Post", postSchema);
//#endregion
export { connectDB as n, Post as t };
