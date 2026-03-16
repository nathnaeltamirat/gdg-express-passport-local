import {config} from "dotenv"

config({path:`.env.${process.NODE_ENV || 'development'}.local`})

export const {PORT,DB_URI,SESSION_SECRET} = process.env